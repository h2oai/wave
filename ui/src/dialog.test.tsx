// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { fireEvent, render, wait, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'
import Dialog, { dialogB } from './dialog'
import { wave } from './ui'

const
  name = 'dialog',
  dialogProps = {
    name,
    title: 'Dialog Title',
    items: [],
  },
  emitMock = jest.fn()


describe('Dialog.tsx', () => {

  beforeAll(() => wave.emit = emitMock)

  beforeEach(() => {
    emitMock.mockReset()
    dialogB(dialogProps)
  })

  it('should open dialog when global qd.dialogB is set', () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
  })

  it('should close dialog when global qd.dialogB is null', async () => {
    const { queryByRole } = render(<Dialog />)
    expect(queryByRole('dialog')).toBeInTheDocument()
    dialogB(null)
    await wait(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should render correct title when specified', () => {
    const title = 'New Title'
    dialogB({ ...dialogProps, title })
    const { queryByText } = render(<Dialog />)
    expect(queryByText(title)).toBeInTheDocument()
  })

  it('should render X closing button when specified', () => {
    dialogB({ ...dialogProps, closable: true })
    const { queryByTitle } = render(<Dialog />)
    expect(queryByTitle('Close')).toBeInTheDocument()
  })

  it('should close dialog when clicking on X', async () => {
    dialogB({ ...dialogProps, closable: true })
    const { getByTitle, queryByRole } = render(<Dialog />)
    fireEvent.click(getByTitle('Close'))
    await wait(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should fire event if specified when clicking on X', () => {
    dialogB({ ...dialogProps, closable: true, events: ['dismissed'] })
    const { getByTitle } = render(<Dialog />)
    fireEvent.click(getByTitle('Close'))
    expect(emitMock).toHaveBeenCalled()
  })

  it('should not fire event if specified when clicking outside of dialog if blocking is specified', () => {
    dialogB({ ...dialogProps, blocking: true, events: ['dismissed'] })
    const { container } = render(<Dialog />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('should fire event if specified when clicking outside of dialog', () => {
    dialogB({ ...dialogProps, events: ['dismissed'] })
    const { container } = render(<Dialog />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    expect(emitMock).toHaveBeenCalled()
  })

  it('should close dialog when clicking outside of dialog', async () => {
    const { container, queryByRole } = render(<Dialog />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    await waitForElementToBeRemoved(() => queryByRole('dialog'))
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should not close dialog when clicking outside of dialog if blocking is specified', async () => {
    dialogB({ ...dialogProps, blocking: true })
    const { queryByRole, container } = render(<Dialog />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    // wait for dialog to be closed in case blocking dialog fails
    await new Promise((res) => setTimeout(() => res('resolved'), 1000))
    // when blocking is set to true, 'alertdialog' is rendered instead of a 'dialog'
    expect(queryByRole('alertdialog')).toBeInTheDocument()
  })

})