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
import React from 'react'
import { XInfoTag, InfoTag } from './info_tag'

let infoTagProps: InfoTag

describe('InfoTag.tsx', () => {
  beforeEach(() => {
    infoTagProps = {
      name: 'info-tag',
      color: 'black',
      label: '1',
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XInfoTag model={infoTagProps} />)
    expect(queryByTestId(infoTagProps.name)).toBeInTheDocument()
  })

  it('Renders label', () => {
    const { queryByText } = render(<XInfoTag model={infoTagProps} />)
    expect(queryByText(infoTagProps.label)).toBeInTheDocument()
  })
})