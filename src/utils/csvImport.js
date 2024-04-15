import fs from 'node:fs'

import { parse } from 'csv-parse'

(async () => {
  const csvFilePath = new URL('../../tasks.csv', import.meta.url)

  const stream = fs.createReadStream(csvFilePath)

  const parser = parse({ delimiter: ',', skip_empty_lines: true, from_line: 2 })

  const linesParse = stream.pipe(parser)

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }
})()
