import React from 'react';
import { render } from '@testing-library/react';
import { View } from './wide_bar_stat';
import * as T from './qd';

const
  title = 'wide-bar-stat',
  wideBarStatProps: T.Card<any> = {
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

describe('WideBarStat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...wideBarStatProps} />)
    expect(queryByTestId(title)).toBeInTheDocument()
  })

  it('Renders title correctly', () => {
    const { queryByText } = render(<View {...wideBarStatProps} />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('Renders and formats aux percent correctly', () => {
    const { queryByText } = render(<View {...wideBarStatProps} />)
    expect(queryByText('10.00%')).toBeInTheDocument()
  })

  it('Renders and formats value correctly', () => {
    const { queryByText } = render(<View {...wideBarStatProps} />)
    expect(queryByText('$5.00')).toBeInTheDocument()
  })
})