const fs = require('fs')

let content = `// THIS FILE IS GENERATED. DO NOT EDIT.

import { it, expect } from "./config"
`
fs.readFileSync('../../../py/examples/tour.conf').toString().split('\n').forEach(example => {
  // Remove .py extension
  example = example.split('.')[0]
  content += `
it("should render ${example} correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#${example}', { waitUntil: 'networkidle' })
  // Wait till everything loads
  const timeout = browserName === 'firefox' ? 0 : 2000 // Firefox is the fastest, so it doesn't need such long timeout
  await new Promise((res) => setTimeout(() => res('Resolved'), timeout))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(\`${example}-\${browserName}.png\`, { threshold: 0.2 })
})
  `
})

fs.writeFileSync('visual.spec.ts', content)