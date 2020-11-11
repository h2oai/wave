import '@testing-library/jest-dom'
import { configure } from '@testing-library/dom'
import { initializeIcons } from '@fluentui/react'

configure({ testIdAttribute: 'data-test' })
initializeIcons()

export const sleep = (ms: number) => new Promise((res) => setTimeout(() => res('Resolved'), ms))   