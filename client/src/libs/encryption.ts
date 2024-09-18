import * as bip39 from "bip39"
import Cryptr from "cryptr"

bip39.setDefaultWordlist("english") // Set the default wordlist to English

/**
 * EncryptionService class to handle encryption and decryption of notes.
 * This class uses the bip39 library to generate a 12-word mnemonic and derive an encryption key from it.
 * The encryption key is then used to create a Cryptr instance, which is used to encrypt and decrypt notes.
 *
 * The class has the following methods:
 * - generateMnemonic(): Method to generate a 12-word mnemonic.
 * - deriveKeyFromMnemonic(mnemonic: string): Method to derive the encryption key from the mnemonic.
 * - encryptNote(note: string): Method to encrypt a note.
 * - decryptNote(encryptedNote: string): Method to decrypt a note.
 *
 * Example usage:
 *
 *  ```typescript
 *   const encryptionService = new EncryptionService()
 *
 *  // Generate mnemonic
 *  const mnemonic = encryptionService.generateMnemonic()
 *  console.log("Generated mnemonic:", mnemonic)
 *
 *  // Derive key from mnemonic
 *  const encryptionKey = await encryptionService.deriveKeyFromMnemonic(mnemonic)
 *  console.log("Derived encryption key:", encryptionKey)
 *
 *  // Encrypt a note
 *  const note = "This is a secret note."
 *  const encryptedNote = encryptionService.encryptNote(note)
 *  console.log("Encrypted note:", encryptedNote)
 *
 *  // Decrypt the note
 *  const decryptedNote = encryptionService.decryptNote(encryptedNote)
 *  console.log("Decrypted note:", decryptedNote)
 * ```
 *
 */
export class EncryptionService {
  private cryptrInstance: Cryptr | null = null

  // Method to generate a 12-word mnemonic
  public generateMnemonic(): string {
    return bip39.generateMnemonic(128) // 12-word mnemonic
  }

  // Method to derive the encryption key from the mnemonic
  public async deriveKeyFromMnemonic(mnemonic: string): Promise<string> {
    // Check if mnemonic is valid
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic.")
    }

    const seed = await bip39.mnemonicToSeed(mnemonic) // Generate seed from mnemonic
    const key = seed.toString("hex")
    this.cryptrInstance = new Cryptr(key) // Create Cryptr instance with the derived key
    return key
  }

  // Method to encrypt a note
  public encryptNote(note: string): string {
    if (!this.cryptrInstance) {
      throw new Error("Cryptr instance is not initialized. Please derive the key first.")
    }
    return this.cryptrInstance.encrypt(note)
  }

  // Method to decrypt a note
  public decryptNote(encryptedNote: string): string {
    if (!this.cryptrInstance) {
      throw new Error("Cryptr instance is not initialized. Please derive the key first.")
    }
    return this.cryptrInstance.decrypt(encryptedNote)
  }
}
