import '@testing-library/jest-dom/extend-expect'
import { configure } from '@testing-library/dom'
import 'jest-canvas-mock'
import { initializeIcons } from '@fluentui/react'

configure({ testIdAttribute: 'data-test' })
initializeIcons()