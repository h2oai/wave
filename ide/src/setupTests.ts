import '@testing-library/jest-dom'
import { configure } from '@testing-library/dom'
import { initializeIcons } from '@fluentui/react'

configure({ testIdAttribute: 'data-test' })
initializeIcons()
