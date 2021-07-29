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
import { Expander, XExpander } from './expander'
import { wave } from './ui'

const name = 'expander'
const expanderProps: Expander = { name }
describe('Expander.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XExpander model={expanderProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - null', () => {
    render(<XExpander model={expanderProps} />)
    expect(wave.args[name]).toBeNull()
  })

  it('Sets args on click', () => {
    const { getByRole } = render(<XExpander model={expanderProps} />)
    fireEvent.click(getByRole('button'))

    expect(wave.args[name]).toBe(true)
  })
})