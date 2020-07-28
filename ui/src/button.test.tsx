import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XButtons, Buttons } from './button';
import * as T from './qd';

const name = 'test-btn';
const hashName = `#${name}`;
const btnProps: Buttons = { items: [{ button: { name, label: name } }] }
const btnPropsNameHash: Buttons = { items: [{ button: { name: hashName, label: name } }] }
describe('Button.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    T.qd.args[name] = null
    jest.clearAllMocks()
  })

  it('Calls sync() after click', () => {
    const
      syncMock = jest.fn(),
      btnProps: Buttons = { items: [{ button: { name, label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    T.qd.sync = syncMock
    fireEvent.click(getByText('btn-label'))
    T.qd.args[name] = null
  })

  it('Calls sync() after click', () => {
    const syncMock = jest.fn()
    const { getByText } = render(<XButtons model={btnProps} />)

    T.qd.sync = syncMock
    fireEvent.click(getByText(name))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Sets args after click - unspecified value', () => {
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText(name))

    expect(T.qd.args[name]).toBe(true)
  })

  it('Sets args after click - specified value', () => {
    const { getByText } = render(<XButtons model={{ items: [{ button: { name, label: name, value: 'val' } }] }} />)
    fireEvent.click(getByText(name))

    expect(T.qd.args[name]).toBe('val')
  })

  it('Sets window.location hash when name starts with #', () => {
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)
    fireEvent.click(getByText(name))

    expect(window.location.hash).toBe(hashName)
  })

  it('Does not call sync when name starts with #', () => {
    const syncMock = jest.fn()
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)

    T.qd.sync = syncMock
    fireEvent.click(getByText(name))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Does not set args when name starts with #', () => {
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)

    fireEvent.click(getByText(name))

    expect(T.qd.args[name]).toBe(null)
  })

  it('Does not set window.location hash when name does not start with #', () => {
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText(name))

    expect(window.location.hash).toBe('')
  })

  it('Renders a link when specified', () => {
    const btnLinkProps: Buttons = { items: [{ button: { name, label: name, link: true } }] }
    const { getByTestId } = render(<XButtons model={btnLinkProps} />)

    expect(getByTestId('link')).toBeTruthy()
  })

  it('Does not render a link when not specified', () => {
    const { queryByTestId } = render(<XButtons model={btnProps} />)

    expect(queryByTestId('link')).toBeFalsy()
  })
})