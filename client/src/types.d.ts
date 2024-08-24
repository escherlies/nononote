declare module "url:*" {
  const src: string
  export default src
}

declare module "vanta/dist/vanta.halo.min" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HALO: any
  export default HALO
}
