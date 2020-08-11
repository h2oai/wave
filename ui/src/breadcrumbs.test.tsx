import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { View } from './breadcrumbs';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const
  name = 'breadcrumbs',
  nameWithHash = `#${name}`,
  label = 'Menu 1',
  breadcrumbsProps: T.Card<any> = {
    name,
    state: { items: [{ name, label }] },
    changed: T.box(false)
  },
  breadcrumbsPropsHash: T.Card<any> = {
    name,
    state: { items: [{ name: nameWithHash, label },] },
    changed: T.box(false)
  }

describe('Breadcrumbs.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    T.qd.args[name] = null
    jest.clearAllMocks()
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

})