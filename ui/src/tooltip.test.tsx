import React from 'react'
import { render } from '@testing-library/react'
import { XToolTip } from './tooltip'
import { initializeIcons } from '@fluentui/react'

const name = 'tooltip'
const tooltipProps = { children: <div />, content: 'content' }

describe('Tooltip.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XToolTip {...tooltipProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})