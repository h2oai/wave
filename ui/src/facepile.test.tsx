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
import { wave } from './ui'
import { Facepile, XFacepile } from "./facepile"

const
  name = 'facepile',
  facepileProps: Facepile = { name, items: [{ persona: { title: 'John' } }] },
  pushMock = jest.fn()

describe('Persona.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    pushMock.mockReset()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XFacepile model={facepileProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Calls push on click', () => {
    const { container } = render(<XFacepile model={facepileProps} />)

    fireEvent.click(container.querySelector('.ms-Facepile-addButton')!)

    expect(wave.args[name]).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Redirects on hash name', () => {
    const hashName = `#${name}`
    const { container } = render(<XFacepile model={{ ...facepileProps, name: hashName }} />)

    fireEvent.click(container.querySelector('.ms-Facepile-addButton')!)

    expect(wave.args[name]).toBe(null)
    expect(pushMock).not.toHaveBeenCalled()
    expect(window.location.hash).toBe(hashName)
  })
})