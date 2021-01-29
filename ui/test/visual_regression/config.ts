import { folio as baseFolio } from "@playwright/test"
import { BrowserContextOptions } from "playwright"

const builder = baseFolio.extend()

builder.contextOptions.override(async ({ contextOptions }, runTest) => {
  const modifiedOptions: BrowserContextOptions = {
    ...contextOptions, // default
    viewport: { width: 1536, height: 864 }
  }
  await runTest(modifiedOptions)
})

const folio = builder.build()

export const it = folio.it
export const expect = folio.expect