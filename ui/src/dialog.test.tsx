import { render } from '@testing-library/react'
import React from 'react'
import Dialog from './dialog'
import * as T from './qd'


const
  name = 'dialog',
  dialogProps = {
    name,
    title: 'Dialog Title',
    items: [],
  }
describe('Dialog.tsx', () => {

  beforeEach(() => T.qd.dialogB(dialogProps))

  it('should open dialog when global qd.dialogB is set', () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
  })

  it('should close dialog when global qd.dialogB is null', async () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
    T.qd.dialogB(null)
    // Fluent dialog implementation has a closing timeout specified.
    await new Promise((res) => setTimeout(() => res('Resolved'), 300))
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render correct title when specified', () => {
    const title = 'New Title'
    T.qd.dialogB({ ...dialogProps, title })
    const { queryByText } = render(<Dialog />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('should render X closing button when specified', () => {
    T.qd.dialogB({ ...dialogProps, closable: true })
    const { queryByTitle } = render(<Dialog />)
    expect(queryByTitle('Close')).toBeInTheDocument()
  })

})