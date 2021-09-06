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
import { Persona, XPersona } from "./persona"

const
  name = 'persona',
  personaProps: Persona = { name, title: 'John Doe' },
  pushMock = jest.fn()

describe('Persona.tsx', () => {
  beforeAll(() => {
    wave.push = pushMock
  })
  beforeEach(() => {
    jest.resetAllMocks()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XPersona model={personaProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Calls push on click', () => {
    const { queryByTestId } = render(<XPersona model={personaProps} />)

    fireEvent.click(queryByTestId(name)!)

    expect(wave.args[name]).toBe(true)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Redirects on hash name', () => {
    const hashName = `#${name}`
    const { queryByTestId } = render(<XPersona model={{ ...personaProps, name: hashName }} />)

    fireEvent.click(queryByTestId(hashName)!)

    expect(wave.args[name]).toBe(null)
    expect(pushMock).not.toHaveBeenCalled()
    expect(window.location.hash).toBe(hashName)
  })
})