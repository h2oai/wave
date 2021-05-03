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

import { initializeIcons } from '@fluentui/react'
import { fireEvent, render } from '@testing-library/react'
import * as T from 'h2o-wave'
import React from 'react'
import { Toggle, XToggle } from './toggle'

const name = 'toggle'
const toggleProps: Toggle = { name }

describe('Toggle.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    T.wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XToggle model={toggleProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display toggle when visible is false', () => {
    const { queryByTestId } = render(<XToggle model={{ ...toggleProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Calls sync when trigger is on', () => {
    const syncMock = jest.fn()
    const { getByTestId } = render(<XToggle model={{ ...toggleProps, trigger: true }} />)

    T.wave.sync = syncMock
    fireEvent.click(getByTestId(name))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call sync when trigger is off', () => {
    const syncMock = jest.fn()
    const { getByTestId } = render(<XToggle model={toggleProps} />)

    T.wave.sync = syncMock
    fireEvent.click(getByTestId(name))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Sets args on click', () => {
    const { getByTestId } = render(<XToggle model={toggleProps} />)
    fireEvent.click(getByTestId(name))

    expect(T.wave.args[name]).toBe(true)
  })

})