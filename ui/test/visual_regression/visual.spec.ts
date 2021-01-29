// THIS FILE IS GENERATED. DO NOT EDIT.

import { it, expect } from "./config"

it("should render hello_world correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#hello_world', { waitUntil: 'networkidle' })
  // Wait till everything loads
  const timeout = browserName === 'firefox' ? 0 : 2000 // Firefox is the fastest, so it doesn't need such long timeout
  await new Promise((res) => setTimeout(() => res('Resolved'), timeout))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`hello_world-${browserName}.png`, { threshold: 0.2 })
})