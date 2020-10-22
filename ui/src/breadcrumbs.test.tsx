import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import { View } from './breadcrumbs'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const
  name = 'breadcrumbs',
  nameWithHash = `#${name}`,
  label = 'Menu 1',
  breadcrumbsPropsHash: T.Card<any> = {
    name,
    state: { items: [{ name: nameWithHash, label },] },
    changed: T.box(false)
  }
let breadcrumbsProps: T.Card<any>

describe('Breadcrumbs.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    T.qd.args[name] = null
    jest.clearAllMocks()
    breadcrumbsProps = {
      name,
      state: { items: [{ name, label }] },
      changed: T.box(false)
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...breadcrumbsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...breadcrumbsProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByText } = render(<View {...breadcrumbsProps} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByText } = render(<View {...breadcrumbsPropsHash} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[name]).toBeNull()
    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Sets window window location hash when name starts with hash', () => {
    const { getByText } = render(<View {...breadcrumbsPropsHash} />)
    fireEvent.click(getByText(label))

    expect(window.location.hash).toBe(nameWithHash)
  })

  it('Renders correct label for single-word url - Auto mode', () => {
    breadcrumbsProps = {
      ...breadcrumbsProps,
      state: { items: [] },
    }
    window.location.hash = 'spam/ham/eggs'
    const { queryByText } = render(<View {...breadcrumbsProps} />)

    // Capitalization is handled by CSS making it untestable via Jest.
    expect(queryByText('spam')).toBeInTheDocument()
    expect(queryByText('ham')).toBeInTheDocument()
    expect(queryByText('eggs')).toBeInTheDocument()

    window.location.hash = 'tuna/cheese/burger'
    window.dispatchEvent(new HashChangeEvent("hashchange"))

    expect(queryByText('spam')).not.toBeInTheDocument()
    expect(queryByText('ham')).not.toBeInTheDocument()
    expect(queryByText('eggs')).not.toBeInTheDocument()
    expect(queryByText('tuna')).toBeInTheDocument()
    expect(queryByText('cheese')).toBeInTheDocument()
    expect(queryByText('burger')).toBeInTheDocument()
  })

  it('Renders correct label for multi-word url - Auto mode', () => {
    breadcrumbsProps = {
      ...breadcrumbsProps,
      state: { items: [] },
    }
    window.location.hash = 'spam-ham/ham-ham/eggs-meggs'
    const { queryByText } = render(<View {...breadcrumbsProps} />)

    // Capitalization is handled by CSS making it untestable via Jest.
    expect(queryByText('spam ham')).toBeInTheDocument()
    expect(queryByText('ham ham')).toBeInTheDocument()
    expect(queryByText('eggs meggs')).toBeInTheDocument()
  })

  it('Sets correct url on click - Auto mode', async () => {
    breadcrumbsProps = {
      ...breadcrumbsProps,
      state: { items: [] },
    }
    window.location.hash = 'spam-ham/ham-ham/eggs-meggs'
    const { getByText, queryByText } = render(<View {...breadcrumbsProps} />)

    expect(queryByText('spam ham')).toBeInTheDocument()
    expect(queryByText('ham ham')).toBeInTheDocument()
    expect(queryByText('eggs meggs')).toBeInTheDocument()

    fireEvent.click(getByText('spam ham'))
    expect(window.location.hash).toBe('#spam-ham')

    // Wait for DOM to get rerendered.
    await wait(() => expect(queryByText('spam ham')).toBeInTheDocument(), { timeout: 1000 })
    await wait(() => expect(queryByText('ham ham')).not.toBeInTheDocument(), { timeout: 1000 })
    await wait(() => expect(queryByText('eggs meggs')).not.toBeInTheDocument(), { timeout: 1000 })
  })

})