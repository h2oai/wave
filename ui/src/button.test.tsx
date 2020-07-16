import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XButtons, Buttons } from './button';
import * as T from './telesync';


describe('Button.tsx', () => {
  it('Calls telesync.sync() after click', () => {
    const
      syncMock = jest.fn(),
      btnProps: Buttons = { items: [{ button: { name: 'btn-test', label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    T.telesync.sync = syncMock
    fireEvent.click(getByText('btn-label'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Sets correct telesync args after click', () => {
    const btnProps: Buttons = { items: [{ button: { name: 'test-btn', label: 'btn-label' } }] }
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText('btn-label'))

    expect(T.telesync.args['test-btn']).toBe(true)
  })
})