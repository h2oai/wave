import { it, expect } from "@playwright/test"

it("compares page screenshot", async ({ page, browserName }) => {
  await new Promise((res) => setTimeout(() => res('Resolved'), 1000))
  await page.goto('http://localhost:10101/tour', { waitUntil: 'networkidle' })
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`test-${browserName}.png`, { threshold: 0.2 })
})