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
import { box, Model } from './core'
import React from 'react'
import { wave } from './ui'
import { View } from './wide_article_preview'

const
  name = 'wide_article_preview',
  pushMock = jest.fn()
let wideArticlePreviewProps: Model<any>

describe('WideArticlePreview.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    pushMock.mockReset()
    wave.args = [] as any
    wideArticlePreviewProps = {
      name,
      state: { persona: { persona: {} }, image: '', name, title: '' },
      changed: box(false)
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...wideArticlePreviewProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Makes card clickable if name was specified', () => {
    const { getByTestId } = render(<View {...wideArticlePreviewProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })

  it('Makes card unclickable if name is empty', () => {
    wideArticlePreviewProps.state.name = ''
    const { getByTestId } = render(<View {...wideArticlePreviewProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).not.toBe(name)
  })

  it('Does not submit data to server if name starts with #', () => {
    wideArticlePreviewProps.state.name = `#${name}`
    const { getByTestId } = render(<View {...wideArticlePreviewProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBeUndefined()
  })
})