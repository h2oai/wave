import React from 'react'
import { render } from '@testing-library/react'
import { XLabel, Label } from './label'

const name = 'label'
const labelProps: Label = { name, label: name }

describe('Label.tsx', () => {

  it('Does not render data-test attr', () => {
    const { container } = render(<XLabel model={{ label: '' }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XLabel model={labelProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display label when visible is false', () => {
    const { queryByTestId } = render(<XLabel model={{ ...labelProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

})