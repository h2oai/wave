import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTabs, Tabs } from './tabs'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'tabs'
const tabsProps: Tabs = { name, items: [{ name }] }

describe('Tabs.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTabs model={tabsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display tabs when visible is false', () => {
    const { queryByTestId } = render(<XTabs model={{ ...tabsProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByRole } = render(<XTabs model={tabsProps} />)
    fireEvent.click(getByRole('tab'))

    expect(T.qd.args[name]).toBe(name)
    expect(syncMock).toHaveBeenCalled()
  })
  it('Does not call sync on click - args not changed', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    T.qd.args[name] = name

    const { getByRole } = render(<XTabs model={tabsProps} />)
    fireEvent.click(getByRole('tab'))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

})