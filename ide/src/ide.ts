
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

interface RPCResult<T> {
  error?: string
  result?: T
}

async function rpc<T>(method: string, args: any): Promise<RPCResult<T>> {
  const { error, result } = await proxy({ method: 'POST', url: 'http://localhost:55554', body: JSON.stringify([method, args]) })
  if (error) return { error }
  if (!result) return { error: 'empty result' }
  const { code, status, body } = result
  if (code != 200) return { error: `${status} (${code}): ${body}` }
  if (!body) return { error: 'empty response' }
  const res = JSON.parse(body)
  return { result: res[0], error: res[1] }
}

export async function create_app(app_name: string) {
  const { result, error } = await rpc('create_app', { app_name })
  console.log(result, error)
}

export async function delete_app(app_name: string) {
  const { result, error } = await rpc('delete_app', { app_name })
  console.log(result, error)
}

export async function start_app(app_name: string) {
  const { result, error } = await rpc('start_app', { app_name })
  console.log(result, error)
}

export async function stop_app(app_name: string) {
  const { result, error } = await rpc('stop_app', { app_name })
  console.log(result, error)
}

export async function list_apps() {
  const { result, error } = await rpc<string[]>('list_apps', {})
  console.log(result, error)
}

export async function read_file(app_name: string, file_name: string) {
  const { result, error } = await rpc<string[]>('read_file', { app_name, file_name })
  console.log(result, error)
}

export async function write_file(app_name: string, file_name: string, file_content: string) {
  const { result, error } = await rpc<string[]>('write_file', { app_name, file_name, file_content })
  console.log(result, error)
}

export async function rename_file(app_name: string, file_name: string, new_file_name: string) {
  const { result, error } = await rpc<string[]>('rename_file', { app_name, file_name, new_file_name })
  console.log(result, error)
}

export async function delete_file(app_name: string, file_name: string) {
  const { result, error } = await rpc<string[]>('delete_file', { app_name, file_name })
  console.log(result, error)
}