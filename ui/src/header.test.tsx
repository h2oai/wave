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
import { box, Model } from 'h2o-wave'
import React from 'react'
import { View } from './header'
import { wave } from './ui'

const
  name = 'header',
  hashName = `#${name}`,
  label = 'label'

let headerProps: Model<any>

describe('Header.tsx', () => {
  beforeEach(() => {
    headerProps = {
      name,
      state: { nav: [{ label: 'group1', items: [{ name, label }] }] },
      changed: box(false)
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...headerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Closes nav on click', () => {
    const { container, queryByText } = render(<View {...headerProps} />)
    fireEvent.click(container.querySelector('.ms-Icon')!)

    const menuItem = queryByText(label)
    expect(menuItem).toBeInTheDocument()

    fireEvent.click(menuItem!)
    expect(menuItem).not.toBeVisible()
  })

  it('Sets args - init', () => {
    render(<View {...headerProps} />)
    expect(wave.args[name]).toBe(false)
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    wave.push = syncMock

    const { getByText } = render(<View {...headerProps} />)
    fireEvent.click(getByText(label))

    expect(wave.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
    expect(window.location.hash).toBe('')
  })

  it('Does not set args, calls sync on click, updates browser hash when name starts with hash', () => {
    const syncMock = jest.fn()
    wave.push = syncMock
    headerProps.state.items[0].name = hashName

    const { getByText } = render(<View {...headerProps} />)
    fireEvent.click(getByText(label))

    expect(wave.args[hashName]).toBe(false)
    expect(syncMock).toHaveBeenCalledTimes(0)
    expect(window.location.hash).toBe(hashName)
  })

  it('should show nested submenus', () => {
    const subText = 'SubItem'
    headerProps.state.items[0].items = [{ name: subText, label: subText, items: [{ name: '' }] }]

    const { getByText, getAllByRole } = render(<View {...headerProps} />)

    fireEvent.click(getByText(label))
    fireEvent.click(getByText(subText))

    expect(getAllByRole('menu')).toHaveLength(2)
  })
})