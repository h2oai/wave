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
import { Template, View, XTemplate } from './template'

const
  name = 'template',
  templateProps: T.Model<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  },
  xTemplateProps: Template = {
    content: '',
    name,
  }

describe('Template.tsx', () => {

  it('Renders data-test attr for Card', () => {
    const { queryByTestId } = render(<View {...templateProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render data-test attr for XTemplate', () => {
    const { container } = render(<XTemplate model={{ content: '' }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr for XTemplate', () => {
    const { queryByTestId } = render(<XTemplate model={xTemplateProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})