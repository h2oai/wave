import React from 'react'
import { render } from '@testing-library/react'
import { View, Template, XTemplate } from './template'
import * as T from './qd'

const
  name = 'template',
  templateProps: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  },
  xTemplateProps: Template = {
    content: '',
    name,
  }

describe('Template.tsx', () => {

  it('Renders data-test attr for Card', () => {
    const { queryByTestId } = render(<View {...templateProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render data-test attr for XTemplate', () => {
    const { container } = render(<XTemplate model={{ content: '' }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr for XTemplate', () => {
    const { queryByTestId } = render(<XTemplate model={xTemplateProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})