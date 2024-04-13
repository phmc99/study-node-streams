export const buildRoutePath = (path) => {
  const routerParamRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routerParamRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}`)

  return pathRegex
}