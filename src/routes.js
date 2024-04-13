import { randomUUID } from 'node:crypto'
import { Database } from './database.js';
import { buildRoutePath } from './utils/buildRoutePath.js';

const db = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handle: (req, res) => {

      const { title, description } = req.query

      const tasks = db.list('tasks')

      let response

      if (title && description) {
        response = tasks.filter(item => item.title.includes(title) && item.description.includes(description))
      } else if (title) {
        response = tasks.filter(item => item.title.includes(title))
      } else if (description) {
        response = tasks.filter(item => item.description.includes(description))
      }

      return res
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(response || tasks));
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
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
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handle: (req, res) => {
      const task = db.list('tasks').find(item => item.id === req.params.id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({message: 'task not found'}))
      }

      const { title, description } = req.body

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({message: 'invalid fields: title, description'}))
      }

      const updateData = {
        title: title || task.title,
        description: description || task.description,
        updated_at: new Date()
      }

      db.update('tasks', req.params.id, updateData)

      return res
        .writeHead(204)
        .end();
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handle: (req, res) => {
      const task = db.list('tasks').find(item => item.id === req.params.id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({message: 'task not found'}))
      }

      db.delete('tasks', req.params.id)

      return res
        .writeHead(204)
        .end();
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handle: (req, res) => {
      const task = db.list('tasks').find(item => item.id === req.params.id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({message: 'task not found'}))
      }

      db.update('tasks', req.params.id, { completed_at: !task.completed_at, updated_at: new Date() })

      return res
        .writeHead(204)
        .end();
    }
  }
]