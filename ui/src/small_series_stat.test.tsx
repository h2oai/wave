import React from 'react';
import { render } from '@testing-library/react';
import { View } from './small_series_stat';
import * as T from './qd';

const
  name = 'small_series_stat',
  smallSeriesStatProps: T.Card<any> = {
    name,
    state: {
      plot_data: jest.fn().mockImplementation(() => [])
    },
    changed: T.box(false)
  }

describe('SmallSeriesStat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...smallSeriesStatProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})