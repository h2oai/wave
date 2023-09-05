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
import { Markdown } from './markdown'

const source = 'The quick brown [fox](?fox) jumps over the lazy [dog](dog).'

describe('Markdown.tsx', () => {

  // Jest JSDOM does not support event system, so we can only check if the event was dispatched.
  it('Dispatches a custom event when link prefixed with "?"', () => {
    const dispatchEventMock = jest.fn()
    window.dispatchEvent = dispatchEventMock
    const { getByText } = render(<Markdown source={source} />)

    fireEvent.click(getByText('fox'))
    expect(dispatchEventMock).toHaveBeenCalled()

    dispatchEventMock.mockClear()
    fireEvent.click(getByText('dog'))
    expect(dispatchEventMock).not.toHaveBeenCalled()
  })
})