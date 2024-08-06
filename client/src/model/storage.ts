class Storage {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(this.prefix + key, value)
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.prefix + key)
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key))
  }
}

export const storage = new Storage("nononote-")
