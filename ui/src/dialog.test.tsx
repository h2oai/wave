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

import { fireEvent, render, wait } from '@testing-library/react'
import React from 'react'
import Dialog, { dialogB } from './dialog'

const
  name = 'dialog',
  dialogProps = {
    name,
    title: 'Dialog Title',
    items: [],
  }
describe('Dialog.tsx', () => {

  beforeEach(() => dialogB(dialogProps))

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
})