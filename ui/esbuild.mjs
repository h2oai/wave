import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import fs from 'fs'

const wavePlugin = {
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
      index = index
        .replace('<!-- SCRIPTS -->', js)
        .replace('<!-- STYLES -->', files.filter(f => f.endsWith('.css')).map(f => `<link href="${f}" rel="stylesheet">`).join('\n'))
        .replace('<script type="module" src="/src/index.tsx"></script>\n', '') // Development-only.
        .replace('<link href="inter.css" rel="stylesheet">\n', '') // Development-only.

      await fs.promises.writeFile(`${outdir}/index.html`, index)
    })
  },
}

esbuild.build({
  entryPoints: ['./src/index.tsx', "./src/index.scss", "./public/inter.css"],
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
  loader: { '.ttf': 'file' },
  external: ['*.ttf'],
  plugins: [wavePlugin, sassPlugin()]
}).catch(() => process.exit(1))