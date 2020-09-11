import React from 'react'
import { render } from '@testing-library/react'
import { XLabel, Label } from './label'

const name = 'label'
const labelProps: Label = { label: name }

describe('Label.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XLabel model={labelProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})