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
import { CopyableText, XCopyableText } from './copyable_text'

const name = 'name'
const copyableTextProps: CopyableText = { name, value: '', label: '' }

describe('CopyableText.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCopyableText model={copyableTextProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Display new value when "value" prop changes', () => {
    const { getByTestId, rerender } = render(<XCopyableText model={{ ...copyableTextProps, value: 'A' }} />)
    expect(getByTestId(name)).toHaveValue('A')

    rerender(<XCopyableText model={{ ...copyableTextProps, value: 'B' }} />)
    expect(getByTestId(name)).toHaveValue('B')
  })

})