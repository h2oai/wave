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
import { Link, XLink } from './link'

const
  name = 'link',
  linkProps: Link = { name, path: name },
  windowOpenMock = jest.fn()

describe('Link.tsx', () => {
  beforeAll(() => window.open = windowOpenMock)
  beforeEach(() => { jest.clearAllMocks() })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XLink model={linkProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets default label when not specified', () => {
    const { queryByText } = render(<XLink model={linkProps} />)
    expect(queryByText(name)).toBeInTheDocument()
  })

  it('Sets label when specified', () => {
    const label = 'label'
    const { queryByText } = render(<XLink model={{ ...linkProps, label }} />)
    expect(queryByText(label)).toBeInTheDocument()
  })

  it('Opens button link in same tab', () => {
    const { getByText } = render(<XLink model={{ ...linkProps, button: true }} />)

    fireEvent.click(getByText(name))
    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(name, undefined)
  })

  it('Opens button link in a new tab', () => {
    const { getByText } = render(<XLink model={{ ...linkProps, button: true, target: '' }} />)

    fireEvent.click(getByText(name))
    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(name, '_blank')
  })

  it('Renders link target attribute when new tab specified', () => {
    const { getByTestId } = render(<XLink model={{ ...linkProps, target: '' }} />)
    expect(getByTestId(name).getAttribute('target')).toEqual('_blank')
  })

})