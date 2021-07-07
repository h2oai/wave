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

import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Buttons, XButtons } from './button'
import { wave } from './ui'

const name = 'test-btn'
const hashName = `#${name}`
const btnProps: Buttons = { items: [{ button: { name, label: name } }] }
const btnPropsNameHash: Buttons = { items: [{ button: { name: hashName, label: name } }] }
describe('Button.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    wave.args[name] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr for Buttons', () => {
    const { queryByTestId } = render(<XButtons model={{ items: [], name }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render data-test attr for Buttons', () => {
    const { container } = render(<XButtons model={{ items: [] }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr for Button', () => {
    const { queryByTestId } = render(<XButtons model={btnProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Calls sync() after click', () => {
    const
      pushMock = jest.fn(),
      btnProps: Buttons = { items: [{ button: { name, label: 'btn-label' } }] },
      { getByText } = render(<XButtons model={btnProps} />)

    wave.push = pushMock
    fireEvent.click(getByText('btn-label'))
    wave.args[name] = null
  })

  it('Calls sync() after click', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XButtons model={btnProps} />)

    wave.push = pushMock
    fireEvent.click(getByText(name))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Sets args after click - unspecified value', () => {
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText(name))

    expect(wave.args[name]).toBe(true)
  })

  it('Sets args after click - specified value', () => {
    const { getByText } = render(<XButtons model={{ items: [{ button: { name, label: name, value: 'val' } }] }} />)
    fireEvent.click(getByText(name))

    expect(wave.args[name]).toBe('val')
  })

  it('Sets window.location hash when name starts with #', () => {
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)
    fireEvent.click(getByText(name))

    expect(window.location.hash).toBe(hashName)
  })

  it('Does not call sync when name starts with #', () => {
    const pushMock = jest.fn()
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)

    wave.push = pushMock
    fireEvent.click(getByText(name))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not set args when name starts with #', () => {
    const { getByText } = render(<XButtons model={btnPropsNameHash} />)

    fireEvent.click(getByText(name))

    expect(wave.args[name]).toBe(null)
  })

  it('Does not set window.location hash when name does not start with #', () => {
    const { getByText } = render(<XButtons model={btnProps} />)
    fireEvent.click(getByText(name))

    expect(window.location.hash).toBe('')
  })

  it('Renders a link when specified', () => {
    const btnLinkProps: Buttons = { items: [{ button: { name, label: name, link: true } }] }
    const { getByTestId } = render(<XButtons model={btnLinkProps} />)

    expect(getByTestId(name)).toHaveClass('ms-Link')
  })

  it('Does not render a link when not specified', () => {
    const { queryByTestId } = render(<XButtons model={btnProps} />)

    expect(queryByTestId(name)).not.toHaveClass('ms-Link')
  })
})