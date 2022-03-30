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

import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'
import SidePanel, { sidePanelB } from './side_panel'
import { wave } from './ui'

const
  name = 'sidePanel',
  sidePanelProps = { name, items: [], title: 'Title' },
  emitMock = jest.fn()

describe('SidePanel.tsx', () => {
  beforeAll(() => wave.emit = emitMock)

  beforeEach(() => {
    emitMock.mockReset()
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
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should not render X closing button', () => {
    const { container } = render(<SidePanel />)
    expect(container.parentElement?.querySelector('.ms-Panel-closeButton')).not.toBeInTheDocument()
  })

  it('should render X closing button when specified', () => {
    sidePanelB({ ...sidePanelProps, closable: true })
    const { container } = render(<SidePanel />)
    expect(container.parentElement?.querySelector('.ms-Panel-closeButton')).toBeInTheDocument()
  })

  it('should close side panel when clicking on X', async () => {
    sidePanelB({ ...sidePanelProps, closable: true })
    const { container, queryByRole } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Panel-closeButton') as HTMLDivElement)
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should fire event if specified when clicking on X', () => {
    sidePanelB({ ...sidePanelProps, closable: true, events: ['dismissed'] })
    const { container } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Panel-closeButton') as HTMLDivElement)
    expect(emitMock).toHaveBeenCalled()
  })

  it('should not fire event if specified when clicking outside of side panel if blocking is specified', () => {
    sidePanelB({ ...sidePanelProps, blocking: true, events: ['dismissed'] })
    const { container } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('should fire event if specified when clicking outside of side panel', () => {
    sidePanelB({ ...sidePanelProps, events: ['dismissed'] })
    const { container } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    expect(emitMock).toHaveBeenCalled()
  })

  it('should close side panel when clicking outside of side panel', async () => {
    const { container, queryByRole } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    await waitForElementToBeRemoved(() => queryByRole('dialog'))
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should not close side panel when clicking outside of side panel if blocking is specified', async () => {
    sidePanelB({ ...sidePanelProps, blocking: true })
    const { container, queryByRole } = render(<SidePanel />)
    fireEvent.click(container.parentElement?.querySelector('.ms-Overlay') as HTMLDivElement)
    // wait for side panel to be closed in case blocking side panel fails
    await new Promise((res) => setTimeout(() => res('resolved'), 1000))
    expect(queryByRole('dialog')).toBeInTheDocument()
  })

})