import React from 'react'
import { render } from '@testing-library/react'
import { View, VegaVisualization, XVegaVisualization } from './vega'
import * as T from './qd'

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
  }`,
  vegaProps: T.Card<any> = {
    name,
    state: { specification },
    changed: T.box(false)
  },
  xVegaProps: VegaVisualization = {
    specification,
    name
  }

describe('Vega.tsx', () => {

  it('Renders data-test attr for Card', () => {
    const { queryByTestId } = render(<View {...vegaProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render data-test attr for XVegaVisualization', () => {
    const { container } = render(<XVegaVisualization model={{ specification }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr for XVegaVisualization', () => {
    const { queryByTestId } = render(<XVegaVisualization model={xVegaProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})