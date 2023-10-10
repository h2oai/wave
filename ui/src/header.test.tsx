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
import { box, Model } from './core'
import React from 'react'
import { View } from './header'

const
  name = 'header',
  label = 'label'

let headerProps: Model<any>

describe('Header.tsx', () => {
  beforeEach(() => {
    headerProps = {
      name,
      state: {
        nav: [{ label: 'group1', items: [{ name, label }] }],
        commands: [{ name: 'command', label }],
        image: 'img'
      },
      changed: box(false),
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...headerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Closes nav on click', () => {
    const { container, queryByText } = render(<View {...headerProps} />)
    fireEvent.click(container.querySelector('i[data-icon-name="GlobalNavButton"]') as HTMLLIElement)

    const menuItem = queryByText(label)
    expect(menuItem).toBeInTheDocument()

    fireEvent.click(menuItem!)
    expect(menuItem).not.toBeVisible()
  })

  it('Routes to home page (#) on logo click', () => {
    const { container } = render(<View {...headerProps} />)

    window.location.hash = 'about'
    fireEvent.click(container.querySelector('.ms-Image-image') as HTMLImageElement)

    expect(window.location.hash).toBe('')
  })
})