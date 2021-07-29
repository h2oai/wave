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
import { MessageBar, XMessageBar } from './message_bar'

const
  name = 'message_bar',
  messagebarProps: MessageBar = { name, text: name }

describe('MessageBar.tsx', () => {

  it('Does not render data-test attr', () => {
    const { container } = render(<XMessageBar model={{}} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XMessageBar model={messagebarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})