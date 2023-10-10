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
import { View } from './graphics'

const
  name = 'graphics',
  graphicsProps: T.Model<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Graphics.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...graphicsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})