import React from 'react'
import { render } from '@testing-library/react'
import { View } from './vega'
import * as T from './qd'

const
  name = 'vega',
  vegaProps: T.Card<any> = {
    name,
    state: {
      specification: `{
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
    },
    changed: T.box(false)
  }

describe('Vega.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...vegaProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})