import React from 'react'
import { render } from '@testing-library/react'
import { View, XFrame, Frame } from './frame'
import * as T from './qd'

const name = 'frame'

describe('Frame.tsx', () => {
  beforeAll(() => window.URL.createObjectURL = jest.fn(() => ''))
  describe('Frame card', () => {
    const cardFrameProps: T.Card<any> = {
      name,
      state: {},
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardFrameProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Frame', () => {
    const formFrameProps: Frame = { name }

    it('Does not display form frame when visible is false', () => {
      const { queryByTestId } = render(<XFrame model={{ ...formFrameProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })

    it('Does not render data-test attr for XFrame', () => {
      const { container } = render(<XFrame model={{}} />)
      expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
    })

    it('Renders data-test attr for XFrame', () => {
      const { queryByTestId } = render(<XFrame model={formFrameProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })
})