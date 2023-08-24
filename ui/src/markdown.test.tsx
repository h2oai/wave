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
import userEvent from '@testing-library/user-event'

const source = 'The quick brown [fox](?fox) jumps over the lazy [dog](dog).'
const codeBlockSource = `
\`\`\`py
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    # Display a Hello, world! message.
    q.page['hello'] = ui.markdown_card(
        box='1 1 4 4',
        title='Hello',
        content='Hello, world!'
    )

    await q.page.save()
\`\`\`
`

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

  it('Shows copy to clipboard button on hover over code block', async () => {
    const { container } = render(<Markdown source={codeBlockSource} />)
    await new Promise(resolve => setTimeout(resolve, 500))

    const copyButton = container.querySelector('button')
    const textfield = container.querySelectorAll('code')[1]!

    expect(textfield).toBeInTheDocument()
    expect(copyButton).toBeInTheDocument()
    expect(copyButton).not.toBeVisible()

    userEvent.hover(textfield)
    expect(container.querySelector('button')).toBeVisible()
  })

  it('Does not render copy to clipboard button - markdown without code block', async () => {
    const { container } = render(<Markdown source={source} />)
    await new Promise(resolve => setTimeout(resolve, 500))

    const copyButton = container.querySelector('button')

    expect(copyButton).not.toBeInTheDocument()
  })
})