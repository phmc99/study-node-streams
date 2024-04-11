export const getRequestBody = async (req) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const body = JSON.parse(Buffer.concat(buffers).toString())

  return body
}