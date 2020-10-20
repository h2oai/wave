import React from 'react'
import { render } from '@testing-library/react'
import { XMessageBar, MessageBar } from './message_bar'
import { initializeIcons } from '@fluentui/react'

const
  name = 'message_bar',
  messagebarProps: MessageBar = { name, text: name }

describe('MessageBar.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Does not render data-test attr', () => {
    const { container } = render(<XMessageBar model={{}} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XMessageBar model={messagebarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display message bar when visible is false', () => {
    const { queryByTestId } = render(<XMessageBar model={{ ...messagebarProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })
})