import fs from "node:fs/promises"

const dbPath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}
  
  constructor() {
    fs.readFile(dbPath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database, null, 2))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  list(table) {
    return this.#database[table] || []
  }

  update(table, id, data) {
    const dataIndex = this.#database[table].findIndex(item => item.id === id)
    const currentData = this.#database[table].find(item => item.id === id)

    if (dataIndex !== -1) {
      this.#database[table][dataIndex] = {...currentData, ...data}
      this.#persist()
    } 
  }

  delete(table, id) {
    const dataIndex = this.#database[table].findIndex(item => item.id === id)

    if (dataIndex !== -1) {
      this.#database[table].splice(dataIndex, 1)
      this.#persist()
    }
  }
}