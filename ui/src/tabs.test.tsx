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
import { Tabs, XTabs } from './tabs'
import { wave } from './ui'

const name = 'tabs'
const tabsProps: Tabs = { name, items: [{ name }] }

describe('Tabs.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTabs model={tabsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByRole } = render(<XTabs model={tabsProps} />)
    fireEvent.click(getByRole('tab'))

    expect(wave.args[name]).toBe(name)
    expect(pushMock).toHaveBeenCalled()
  })
  it('Does not call sync on click - args not changed', () => {
    const pushMock = jest.fn()
    wave.push = pushMock
    wave.args[name] = name

    const { getByRole } = render(<XTabs model={tabsProps} />)
    fireEvent.click(getByRole('tab'))

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

})