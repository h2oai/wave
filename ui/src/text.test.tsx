import React from 'react'
import { render } from '@testing-library/react'
import { XText, Text } from './text'

const name = 'text'
const textProps: Text = { name, content: name }

describe('Text.tsx', () => {

  it('Does not render data-test attr', () => {
    const { container } = render(<XText content='' />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XText {...textProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display text when visible is false', () => {
    const { queryByTestId } = render(<XText {...textProps} visibility={false} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })
})