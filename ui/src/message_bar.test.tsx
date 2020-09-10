import React from 'react'
import { render } from '@testing-library/react'
import { XMessageBar, MessageBar } from './message_bar'
import { initializeIcons } from '@fluentui/react'

const
  name = 'message_bar',
  messagebarProps: MessageBar = { text: name }

describe('MessageBar.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XMessageBar model={messagebarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})