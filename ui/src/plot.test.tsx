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

import React from 'react'
import { render } from '@testing-library/react'
import { View, XVisualization, Visualization } from './plot'
import * as T from './qd'

const name = 'plot'

describe('Plot.tsx', () => {

  describe('Card Plot', () => {
    const cardPlotProps: T.Card<any> = {
      name,
      state: { data: [], plot: { marks: [] } },
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardPlotProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Plot', () => {
    const formPlotProps: Visualization = {
      name,
      data: [] as any,
      plot: { marks: [] }
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XVisualization model={{ ...formPlotProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Does not display form plot when visible is false', () => {
      const { queryByTestId } = render(<XVisualization model={{ ...formPlotProps, visible: false }} />)
      expect(queryByTestId(name)).not.toBeVisible()
    })
  })
})