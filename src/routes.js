import { randomUUID } from 'node:crypto'
import { Database } from './database.js';

const db = new Database()

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handle: (req, res) => {
      return res
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(db.list('tasks')));
    }
  },
  {
    method: "POST",
    path: "/tasks",
    handle: (req, res) => {
      const { title, description } = req.body

      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      db.insert('tasks', newTask)
  
      return res
        .writeHead(201)
        .end();
    }
  },
]