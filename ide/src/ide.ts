
interface ProxyMessage {
  headers?: { [key: string]: string[] }
  body?: string
}

interface ProxyRequest extends ProxyMessage {
  method: string
  url: string
}

interface ProxyResponse extends ProxyMessage {
  status: string
  code: number
}

interface ProxyResult {
  error?: string
  result?: ProxyResponse
}

async function proxy(req: ProxyRequest): Promise<ProxyResult> {
  const res = await fetch('/_p', { method: 'POST', body: JSON.stringify(req) })
  return await res.json()
}

async function rpc<T>(method: string, args: any): Promise<T> {
  const { error, result } = await proxy({ method: 'POST', url: 'http://localhost:55554', body: JSON.stringify([method, args]) })
  if (error) throw error // proxying error
  if (!result) throw 'empty result' // shouldn't happen
  const { code, status, body } = result
  if (code != 200) throw `${status} (${code}): ${body}` // unhandled error from IDE backend
  if (!body) throw 'empty response' // shouldn't happen
  const res = JSON.parse(body)
  if (res[1]) throw res[1] // validation error from IDE backend
  return res[0] as T
}

export async function create_app(app_name: string) {
  return await rpc('create_app', { app_name })
}

export async function delete_app(app_name: string) {
  return await rpc('delete_app', { app_name })
}

export async function start_app(app_name: string) {
  return await rpc('start_app', { app_name })
}

export async function stop_app(app_name: string) {
  return await rpc('stop_app', { app_name })
}

export async function list_apps() {
  return await rpc<string[]>('list_apps', {})
}

export async function read_file(app_name: string, file_name: string) {
  return await rpc<string>('read_file', { app_name, file_name })
}

export async function write_file(app_name: string, file_name: string, file_content: string) {
  return await rpc('write_file', { app_name, file_name, file_content })
}

export async function rename_file(app_name: string, file_name: string, new_file_name: string) {
  return await rpc('rename_file', { app_name, file_name, new_file_name })
}

export async function delete_file(app_name: string, file_name: string) {
  return await rpc('delete_file', { app_name, file_name })
}