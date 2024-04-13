import http from 'node:http'

import { getRequestBody } from './utils/getRequestBody.js'
import { routes } from './routes.js'
import { getQueryParams } from './utils/getQueryParams.js'


const server = http.createServer(async (req, res) => {
  const { method, url } = req
  
  try {
    req.body = await getRequestBody(req)
  } catch (error) {
    req.body = null
  }

  const route = routes.find(r => r.method === method && r.path.test(url))

  if (route) {
    const routeParams = req.url.match(route.path)

    const {query, ...params} = routeParams.groups
    
    req.params = params
    req.query = query ? getQueryParams(query) : {}

    return route.handle(req, res)
  }

  res.end("Desafio 1");
})

server.listen(3000)