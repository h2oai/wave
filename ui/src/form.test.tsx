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

import { render } from '@testing-library/react'
import * as T from './core'
import React from 'react'
import { Button, Buttons } from './button'
import { View } from './form'

const
  name = 'form',
  formProps: T.Model<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Form.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...formProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Hides a button component', () => {
    const
      button: Button = { name: 'btn', visible: false },
      _formProps = { ...formProps, state: { items: [{ button }] } },
      { queryByTestId } = render(<View {..._formProps} />)
    expect(queryByTestId('btn')).not.toBeVisible()
  })

  it('Hides a button component within buttons', () => {
    const
      buttons: Buttons = { items: [{ button: { name: 'btn', visible: false } }] },
      _formProps = { ...formProps, state: { items: [{ buttons }] } },
      { queryByTestId } = render(<View {..._formProps} />)
    expect(queryByTestId('btn')).not.toBeVisible()
  })

  it('Hides a button component within inline', () => {
    const
      inline = { items: [{ button: { name: 'btn', visible: false } }] },
      _formProps = { ...formProps, state: { items: [{ inline }] } },
      { queryByTestId } = render(<View {..._formProps} />)
    expect(queryByTestId('btn')).not.toBeVisible()
  })
})