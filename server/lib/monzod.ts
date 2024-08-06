import { MongoClient, Collection } from "mongodb"
import z from "zod"
import { autoGenerateId } from "./monzod/id"
import { addTimestamps } from "./monzod/data"

// This is a very simple wrapper around the MongoDB driver that
// uses Zod to provide type safety for the collections.

// A collection schema is a Zod object schema.
export type CollectionSchema = z.ZodObject<any, any, any>

export type CollectionConfig = {
  schema: CollectionSchema
  indexes: string[]
}

export type CollectionConfigs = {
  [key: string]: CollectionConfig
}

type MonzodConfig<Configs extends CollectionConfigs> = {
  collections: Configs
  url: string
  db: string
}

// A MonzodCollection is a MongoDB collection with a schema.
export type MonzodCollection<Schema extends CollectionSchema> = Collection<
  z.infer<Schema>
> & {
  schema: Schema
  generateId: () => string
}

type Collections<Schemas extends CollectionConfigs> = {
  [K in keyof Schemas]: MonzodCollection<Schemas[K]["schema"]>
}

class Monzod<Schemas extends CollectionConfigs> {
  private client: MongoClient | null = null
  public cols = {} as Collections<Schemas>

  constructor(public config: MonzodConfig<Schemas>) {}

  public async connect(): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(this.config.url)
      const db = this.client.db(this.config.db)

      for (const name of Object.keys(this.config.collections)) {
        const colConfig = this.config.collections[name as keyof Schemas]

        this.cols[name as keyof Schemas] = db.collection<
          z.infer<(typeof colConfig)["schema"]>
        >(name) as any
        this.cols[name as keyof Schemas].schema = addTimestamps(
          colConfig.schema
        )
        this.cols[name as keyof Schemas].generateId = () => autoGenerateId(name)

        this.config.collections[name as keyof Schemas].schema = addTimestamps(
          colConfig.schema
        )

        for (const index of colConfig["indexes"]) {
          await this.cols[name as keyof Schemas].createIndex({ [index]: 1 })
        }
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }
}

export default Monzod
