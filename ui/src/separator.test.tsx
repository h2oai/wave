import React from 'react'
import { render } from '@testing-library/react'
import { XSeparator, Separator } from './separator'

const
  name = 'separator',
  separatorProps: Separator = { name, label: name }

describe('Separator.tsx', () => {

  it('Does not render data-test attr', () => {
    const { container } = render(<XSeparator model={{}} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XSeparator model={separatorProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display separator when visible is false', () => {
    const { queryByTestId } = render(<XSeparator model={{ ...separatorProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })
})