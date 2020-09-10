import React from 'react'
import { render } from '@testing-library/react'
import { View } from './large_bar_stat'
import * as T from './qd'

const
  title = 'large_bar_stat',
  largeBarStatProps: T.Card<any> = {
    name: title,
    state: {
      title,
      aux_value: '={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
      value: `=\${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}`,
      progress: 0.5,
      data: { foo: 5, bar: 10 / 100 }
    },
    changed: T.box(false)
  }

describe('LargeBarStat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...largeBarStatProps} />)
    expect(queryByTestId(title)).toBeInTheDocument()
  })

  it('Renders title correctly', () => {
    const { queryByText } = render(<View {...largeBarStatProps} />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('Renders and formats aux percent correctly', () => {
    const { queryByText } = render(<View {...largeBarStatProps} />)
    expect(queryByText('10.00%')).toBeInTheDocument()
  })

  it('Renders and formats value correctly', () => {
    const { queryByText } = render(<View {...largeBarStatProps} />)
    expect(queryByText('$5.00')).toBeInTheDocument()
  })
})