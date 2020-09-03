import React from 'react';
import { render } from '@testing-library/react';
import { CardMenu } from './card_menu';
import { Card, box } from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'card'
const baseCardMenuProps: Card<any> = { name, state: {}, changed: box(false) }
describe('CardMenu.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<CardMenu card={{ ...baseCardMenuProps, state: { commands: [{ name }] } }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render when commands are not specified', () => {
    const { queryByTestId } = render(<CardMenu card={baseCardMenuProps} />)

    expect(queryByTestId(name)).toBeFalsy()
  })

  it('Renders menu when commands are specified', () => {
    const { queryByTestId } = render(<CardMenu card={{ ...baseCardMenuProps, state: { commands: [{ name }] } }} />)

    expect(queryByTestId(name)).toBeTruthy()
  })
})