// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import eslintPlugin from 'vite-plugin-eslint'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(),
    eslintPlugin({ cache: false, exclude: ['**/node_modules/**', 'package-lock.json', '**/dist/**'] }),
    // Build legacy bundle only when version is specified (releases). Not needed for regular development.
    process.env.VERSION ? legacy({ targets: ['Edge >= 16', 'Firefox >= 31', 'Chrome >= 49', 'Opera >= 36', 'Safari >= 10'] }) : null
  ],
  build: {
    outDir: 'build',
    assetsDir: 'wave-static',
    chunkSizeWarningLimit: 900
  },
  server: {
    port: 3000,
    proxy: {
      '/_s': {
        target: 'http://localhost:10101/_s/',
        ws: true
      },
      '/_f': {
        target: 'http://localhost:10101',
      },
      '/_m': {
        target: 'http://localhost:10101',
      },
    }
  }
})
