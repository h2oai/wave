import React from 'react'
import { render } from '@testing-library/react'
import { View, XVegaVisualization, VegaVisualization } from './vega'
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
  }`

describe('Vega.tsx', () => {

  describe('Card Vega', () => {
    const cardVegaProps: T.Card<any> = {
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

    it('Does not display expander when visible is false', () => {
      const { queryByTestId } = render(<XVegaVisualization model={{ ...formVegaProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })

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