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
import * as T from 'h2o-wave'
import React from 'react'
import { VegaVisualization, View, XVegaVisualization } from './vega'

const
  name = 'vega',
  specification = `{
    "description": "A simple bar plot with embedded data.",
    "data": {
      "values": [
        {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
        {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
        {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "a", "type": "ordinal"},
      "y": {"field": "b", "type": "quantitative"}
    }
  }`

describe('Vega.tsx', () => {

  describe('Card Vega', () => {
    const cardVegaProps: T.Model<any> = {
      name,
      state: { specification },
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardVegaProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Vega', () => {
    const formVegaProps: VegaVisualization = { name, specification }

    it('Does not render data-test attr', () => {
      const { container } = render(<XVegaVisualization model={{ specification }} />)
      expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
    })

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XVegaVisualization model={formVegaProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

})