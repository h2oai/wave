import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { CardMenu } from './card_menu'
import { box } from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'card'
describe('CardMenu.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Does not render data-test attr', () => {
    const { container } = render(<CardMenu commands={[{ name }]} changedB={box(false)} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders menu when commands are specified', () => {
    const { queryByTestId } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)
    expect(queryByTestId(name)).toBeTruthy()
  })

  it('Does not change hash when command name does not start with #', () => {
    const { getByTestId, getByText } = render(<CardMenu name={name} commands={[{ name }]} changedB={box(false)} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('card'))

    expect(window.location.hash).toBe('')
  })

  it('Changes hash when command name starts with #', () => {
    const { getByTestId, getByText } = render(<CardMenu name={name} commands={[{ name: '#card' }]} changedB={box(false)} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('#card'))

    expect(window.location.hash).toBe('#card')
  })
})