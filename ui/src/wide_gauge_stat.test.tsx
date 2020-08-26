import React from 'react';
import { render } from '@testing-library/react';
import { View } from './wide_gauge_stat';
import * as T from './qd';

const
  title = 'WideGaugeStat',
  wideGaugeStatProps: T.Card<any> = {
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

describe('WideGaugeStat.tsx', () => {

  it('Renders correctly', () => {
    const { container } = render(<View {...wideGaugeStatProps} />)
    expect(container).toBeInTheDocument()
  })

  it('Renders title correctly', () => {
    const { queryByText } = render(<View {...wideGaugeStatProps} />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('Renders and formats aux percent correctly', () => {
    const { getByText } = render(<View {...wideGaugeStatProps} />)
    expect(getByText('10.00%')).toBeInTheDocument()
  })

  it('Renders progress percent correctly', () => {
    const { getByText } = render(<View {...wideGaugeStatProps} />)
    expect(getByText('50%')).toBeInTheDocument()
  })

  it('Renders and formats value correctly', () => {
    const { getByText } = render(<View {...wideGaugeStatProps} />)
    expect(getByText('$5.00')).toBeInTheDocument()
  })
})