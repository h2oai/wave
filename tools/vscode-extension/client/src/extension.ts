/* -------------------------------------------------------------------------
 * Original work Copyright (c) Microsoft Corporation. All rights reserved.
 * Original work licensed under the MIT License.
 * See ThirdPartyNotices.txt in the project root for license information.
 * All modifications Copyright (c) Open Law Library. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License')
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http: // www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------- */
import * as net from 'net'
import * as path from 'path'
import { ExtensionContext, workspace } from 'vscode'
import { LanguageClient, ServerOptions } from 'vscode-languageclient/node'

let client: LanguageClient
const clientOptions = {
  documentSelector: [
    { scheme: 'file', language: 'python' },
    { scheme: 'untitled', language: 'python' }
  ],
  outputChannelName: 'Wave'
}

export function activate(context: ExtensionContext): void {
  if (process.env.VSCODE_DEBUG_MODE === 'true') {
    // Development - Run the server manually
    const addr = 2087
    const serverOptions: ServerOptions = () => new Promise(res => {
      const socket = new net.Socket()
      socket.connect(addr, '127.0.0.1', () => res({ reader: socket, writer: socket, }))
    })
    client = new LanguageClient(`tcp lang server (port ${addr})`, serverOptions, clientOptions)
  } else {
    // Production - Client is going to run the server (for use within `.vsix` package)
    const cwd = path.join(__dirname, '..', '..')
    let pythonPath = workspace.getConfiguration('python').get<string>('pythonPath')
    if (!pythonPath) {
      pythonPath = workspace.getConfiguration('python').get<string>('defaultInterpreterPath')
    }
    if (!pythonPath) throw new Error('Neither `python.pythonPath` nor `python.defaultInterpreterPath` is set.')

    client = new LanguageClient(pythonPath, { args: ['-m', 'server'], command: pythonPath, options: { cwd } }, clientOptions)
  }

  context.subscriptions.push(client.start())
}

export const deactivate = (): Thenable<void> => client?.stop() || Promise.resolve()