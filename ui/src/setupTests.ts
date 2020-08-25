import '@testing-library/jest-dom/extend-expect'
import { configure } from '@testing-library/dom'
import 'jest-canvas-mock'

configure({ testIdAttribute: 'data-test' })