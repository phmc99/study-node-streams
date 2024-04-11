import http from 'node:http'

import { getRequestBody } from './utils/getRequestBody.js'
import { randomUUID } from 'node:crypto'

const tasks = []

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  
  try {
    req.body = await getRequestBody(req)
  } catch (error) {
    req.body = null
  }

  if (method === "GET" && url === '/tasks') {
    return res
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === '/tasks') {
    const { title, description } = req.body

    tasks.push({
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date()
    })

    return res
      .writeHead(201)
      .end();
  }

  res.end("Desafio 1");
})

server.listen(3000)