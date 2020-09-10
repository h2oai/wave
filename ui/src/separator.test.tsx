import React from 'react'
import { render } from '@testing-library/react'
import { XSeparator, Separator } from './separator'

const
  name = 'separator',
  separatorProps: Separator = { label: name }

describe('Separator.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XSeparator model={separatorProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})