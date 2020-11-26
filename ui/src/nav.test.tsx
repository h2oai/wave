import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { View, State } from './nav'
import * as T from './qd'

const
  name = 'nav',
  hashName = `#${name}`,
  label = 'label',
  navProps: T.Card<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name, label }] }
      ]
    },
    changed: T.box(false)
  },
  navPropsHash: T.Card<State> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name: hashName, label }] }
      ]
    },
    changed: T.box(false)
  }
describe('Nav.tsx', () => {
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...navProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...navProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Makes link active when value specified', () => {
    const props: T.Card<State> = { ...navProps, state: { ...navProps.state, value: name } }
    const { getByTitle } = render(<View {...props} />)
    expect(getByTitle(label).parentElement).toHaveClass('is-selected')
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navProps} />)
    fireEvent.click(getByTitle(label))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle(label))

    expect(T.qd.args[name]).toBeNull()
    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Does set window window location hash when name starts with hash', () => {
    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle(label))

    expect(window.location.hash).toBe(hashName)
  })

  it('Collapses a group when collapse is specified', () => {
    const props = {
      ...navProps,
      state: {
        items: [
          { label: 'group1', items: [{ name, label }], collapsed: true }
        ]
      },
    }
    const { container } = render(<View {...props} />)
    expect(container.querySelector('.is-expanded')).not.toBeInTheDocument()
  })
})