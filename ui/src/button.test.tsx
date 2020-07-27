import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XButtons, Buttons } from './button';
import * as T from './qd';


const TEST_NAME = 'test-btn';
describe('Button.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    T.qd.args[TEST_NAME] = null
  })

  it('Calls qd.sync() after click', () => {
    const
      syncMock = jest.fn(),
      btnProps: Buttons = { items: [{ button: { name: TEST_NAME, label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    T.qd.sync = syncMock
    fireEvent.click(getByText('btn-label'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Sets correct qd args after click', () => {
    const btnProps: Buttons = { items: [{ button: { name: TEST_NAME, label: 'btn-label' } }] }
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText('btn-label'))

    expect(T.qd.args[TEST_NAME]).toBe(true)
  })

  it('Sets window.location hash when name starts with #', () => {
    const btnProps: Buttons = { items: [{ button: { name: `#${TEST_NAME}`, label: 'btn-label' } }] }
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText('btn-label'))

    expect(window.location.hash).toBe(`#${TEST_NAME}`)
  })

  it('Does not call sync when name starts with #', () => {
    const
      syncMock = jest.fn(),
      btnProps: Buttons = { items: [{ button: { name: `#${TEST_NAME}`, label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    T.qd.sync = syncMock
    fireEvent.click(getByText('btn-label'))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Does not set args when name starts with #', () => {
    const
      btnProps: Buttons = { items: [{ button: { name: `#${TEST_NAME}`, label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    fireEvent.click(getByText('btn-label'))

    expect(T.qd.args[TEST_NAME]).toBe(null)
  })

  it('Does not set window.location hash when name does not start with #', () => {
    const btnProps: Buttons = { items: [{ button: { name: TEST_NAME, label: 'btn-label' } }] }
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText('btn-label'))

    expect(window.location.hash).toBe('')
  })

  it('Renders a link when specified', () => {
    const btnProps: Buttons = { items: [{ button: { name: TEST_NAME, label: 'btn-label', link: true } }] }
    const { getByTestId } = render(<XButtons model={btnProps} />)

    expect(getByTestId('link')).toBeTruthy()
  })

  it('Does not render a link when not specified', () => {
    const btnProps: Buttons = { items: [{ button: { name: TEST_NAME, label: 'btn-label' } }] }
    const { queryByTestId } = render(<XButtons model={btnProps} />)

    expect(queryByTestId('link')).toBeFalsy()
  })
})