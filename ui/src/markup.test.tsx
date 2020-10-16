import React from 'react'
import { render } from '@testing-library/react'
import { View, XMarkup, Markup } from './markup'
import * as T from './qd'

const name = 'markup'

describe('Markup.tsx', () => {

  describe('Markup card', () => {
    const cardMarkupProps: T.Card<any> = {
      name,
      state: { content: '' },
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardMarkupProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Markup', () => {
    const formMarkupProps: Markup = { content: '' }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XMarkup model={{ ...formMarkupProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })
  })
})