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
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  optimizeDeps: {
    entries: ['src/index.tsx']
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
    chunkSizeWarningLimit: 900
  },
  server: {
    proxy: {
      '/_s': {
        target: 'http://localhost:10101/_s/',
        ws: true
      }
    }
  }
})
