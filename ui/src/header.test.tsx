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
import * as T from 'h2o-wave'
import React from 'react'
import { View } from './header'
import { wave } from './ui'

const
  name = 'header',
  label = 'label',
  placeholder= "Search anything here...",
  headerProps: T.Model<any> = {
    name,
    state: { nav: [{ label: 'group1', items: [{ name, label }] }], search_name: "searchbox_icon", items: [{icon_notification: {icon: 'Ringer', icon_color: '$themePrimary', notification_count: "12"}}] },
    changed: T.box(false)
  }

describe('Header.tsx', () => {
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

  it('Searchbar visible when specified in props', () => {
    const { queryByPlaceholderText } = render(<View {...headerProps} />)

    const searchbar = queryByPlaceholderText(placeholder)
    expect(searchbar).toBeVisible()
  })

  it('Calls push on click', () => {
    const { queryByPlaceholderText } = render(<View {...headerProps} />)
    
    window.location.hash = ''
    wave.args[headerProps.state.search_name] = null
    jest.clearAllMocks()

    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.change(queryByPlaceholderText('Search anything here...')!, { target: { value: 'text' } })

    expect(wave.args[headerProps.state.search_name]).toBe('text')
    expect(pushMock).toHaveBeenCalled()
  })
})