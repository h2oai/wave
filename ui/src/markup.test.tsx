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
    const formMarkupProps: Markup = { name, content: '' }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XMarkup model={formMarkupProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Does not render data-test attr - name not specified', () => {
      const { queryByTestId } = render(<XMarkup model={{ content: '' }} />)
      expect(queryByTestId(name)).not.toBeInTheDocument()
    })

    it('Does not display Markup when visible is false', () => {
      const { queryByTestId } = render(<XMarkup model={{ ...formMarkupProps, visible: false }} />)
      expect(queryByTestId(name)).not.toBeVisible()
    })
  })
})