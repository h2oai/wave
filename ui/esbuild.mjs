import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import fs from 'fs'

const onLoadPlugin = {
  name: 'wave-plugin',
  setup(build) {
    build.onLoad({ filter: /handlebars\/lib\/index\.js$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, 'utf8')
      // HACK: Monkey-patch handlebars for NodeJS.
      return { contents: contents.replace("var fs = require('fs');", '') }
    })
    build.onEnd(async (result) => {
      const outdir = build.initialOptions.outdir
      const files = Object.keys(result.metafile.outputs).map(f => f.replace(outdir + '/', ''))
      const js = files.filter(f => f.endsWith('.js') && !f.includes('.module')).map(f => `<script type="module" src="${f}"></script>`).join('\n')

      let index = await fs.promises.readFile('index.html', 'utf8')
      index = index.replace('<!-- SCRIPTS -->', js)
      index = index.replace('<!-- STYLES -->', files.filter(f => f.endsWith('.css')).map(f => `<link href="${f}" rel="stylesheet">`).join('\n'))
      index = index.replace('<script type="module" src="/src/index.tsx"></script>', '') // Development-only script.

      await fs.promises.writeFile(`${outdir}/index.html`, index)
    })
  },
}

esbuild.build({
  entryPoints: ['./src/index.tsx', "./src/index.scss"],
  entryNames: '[name]-[hash]',
  bundle: true,
  minify: true,
  splitting: true,
  metafile: true,
  logLevel: 'info',
  format: 'esm',
  outdir: 'build',
  legalComments: 'linked',
  assetNames: '[name]-[hash]',
  drop: ['debugger'],
  plugins: [
    onLoadPlugin,
    sassPlugin(),
  ]
}).catch(() => process.exit(1))