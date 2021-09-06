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
import SidePanel, { sidePanelB } from './side_panel'
import { wave } from './ui'

const
  name = 'sidePanel',
  sidePanelProps = { name, items: [], title: 'Title' }

describe('SidePanel.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sidePanelB(sidePanelProps)
  })

  it('should open side panel when global sidePanel is set', () => {
    const { queryByRole } = render(<SidePanel />)
    expect(queryByRole('dialog')).toBeInTheDocument()
  })

  it('should close side panel when global sidePanel is null', async () => {
    const { queryByRole } = render(<SidePanel />)
    expect(queryByRole('dialog')).toBeInTheDocument()
    sidePanelB(null)
    await wait(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should render X closing button when specified', () => {
    const { container } = render(<SidePanel />)
    expect(container.parentElement?.querySelector('.ms-Panel-closeButton')).toBeInTheDocument()
  })

  it('should close side panel when clicking on X', async () => {
    const { container, queryByRole } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Panel-closeButton') as any)
    await wait(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should fire event if specified when clicking on X', () => {
    sidePanelB({ ...sidePanelProps, events: ['dismissed'] })
    const { container } = render(<SidePanel />)
    const emitMock = jest.fn()
    wave.emit = emitMock
    fireEvent.click(container.parentElement?.querySelector('.ms-Panel-closeButton') as any)
    expect(emitMock).toHaveBeenCalled()
  })
})