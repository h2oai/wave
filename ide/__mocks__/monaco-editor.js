// Monaco editor needs to be mocked because it is packaged as ESM which Jest does not support just yet.

export const editor = {
  create: jest.fn().mockImplementation(() => ({
    addAction: jest.fn(),
    dispose: jest.fn(),
    onDidChangeModelContent: jest.fn()
  }))
}
export const KeyMod = {}
export const KeyCode = {}