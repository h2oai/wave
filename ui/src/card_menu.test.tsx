import React from 'react'
import { render } from '@testing-library/react'
import { CardMenu } from './card_menu'
import { box } from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'card'
describe('CardMenu.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders menu when commands are specified', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeTruthy()
  })
})