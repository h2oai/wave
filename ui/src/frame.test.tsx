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
import * as T from 'h2o-wave'
import React from 'react'
import { Frame, View, XFrame } from './frame'

const name = 'frame'

describe('Frame.tsx', () => {
  beforeAll(() => window.URL.createObjectURL = jest.fn(() => ''))
  describe('Frame card', () => {
    const cardFrameProps: T.Model<any> = {
      name,
      state: {},
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardFrameProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Frame', () => {
    const formFrameProps: Frame = { name }

    it('Does not render data-test attr for XFrame', () => {
      const { container } = render(<XFrame model={{}} />)
      expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
    })

    it('Renders data-test attr for XFrame', () => {
      const { queryByTestId } = render(<XFrame model={formFrameProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })
})