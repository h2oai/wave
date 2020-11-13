import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import * as T from '../qd'
import Dialog from './dialog'


const
  name = 'dialog',
  dialogProps = {
    name,
    title: 'Dialog Title',
    items: [],
  }
describe('Dialog.tsx', () => {

  beforeEach(() => {
    T.qd.dialogB(dialogProps)
  })

  it('should open dialog when global qd.dialogB is set', () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
  })

  it('should close dialog when global qd.dialogB is null', () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
    T.qd.dialogB(null)
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close dialog on cancel', () => {
    const { queryByRole, getByText } = render(<Dialog />)
    fireEvent.click(getByText('Cancel'))
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close dialog on submit', () => {
    const { queryByRole, getByText } = render(<Dialog />)
    fireEvent.click(getByText('Submit'))
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should call sync and set args on submit', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    const { getByText } = render(<Dialog />)
    fireEvent.click(getByText('Submit'))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('should render correct title when specified', () => {
    const title = 'New Title'
    T.qd.dialogB({ ...dialogProps, title })
    const { queryByText } = render(<Dialog />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('should render correct cancelText when specified', () => {
    const cancelText = 'New Title'
    T.qd.dialogB({ ...dialogProps, cancelText })
    const { queryByText } = render(<Dialog />)
    expect(queryByText(cancelText)).toBeInTheDocument()
  })

  it('should render correct submitText when specified', () => {
    const submitText = 'New Title'
    T.qd.dialogB({ ...dialogProps, submitText })
    const { queryByText } = render(<Dialog />)
    expect(queryByText(submitText)).toBeInTheDocument()
  })

  it('should render disabled submit button when disabled specified', () => {
    T.qd.dialogB({ ...dialogProps, disabled: true })
    const { getByText } = render(<Dialog />)
    expect(getByText('Submit')).toBeDisabled()
  })

  it('should render X closing button when specified', () => {
    T.qd.dialogB({ ...dialogProps, has_x: true })
    const { queryByTitle } = render(<Dialog />)
    expect(queryByTitle('Close')).toBeInTheDocument()
  })

})