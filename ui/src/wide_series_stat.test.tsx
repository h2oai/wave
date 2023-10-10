// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { render } from '@testing-library/react'
import * as T from './core'
import React from 'react'
import { View } from './wide_series_stat'

const
  title = 'wide_series_stat',
  wideSeriesStatProps: T.Model<any> = {
    name: title,
    state: {
      title,
      aux_value: '={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
      value: `=\${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}`,
      plot_data: jest.fn().mockImplementation(() => []),
      data: { foo: 5, bar: 10 / 100 }
    },
    changed: T.box(false)
  }

describe('WideSeriesStat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...wideSeriesStatProps} />)
    expect(queryByTestId(title)).toBeInTheDocument()
  })

  it('Renders title correctly', () => {
    const { queryByText } = render(<View {...wideSeriesStatProps} />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('Renders and formats aux percent correctly', () => {
    const { getByText } = render(<View {...wideSeriesStatProps} />)
    expect(getByText('10.00%')).toBeInTheDocument()
  })

  it('Renders and formats value correctly', () => {
    const { getByText } = render(<View {...wideSeriesStatProps} />)
    expect(getByText('$5.00')).toBeInTheDocument()
  })
})