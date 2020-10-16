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
      data: [] as any,
      plot: { marks: [] }
    }

    it('Does not display form plot when visible is false', () => {
      const { queryByTestId } = render(<XVisualization model={{ ...formPlotProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })
  })
})