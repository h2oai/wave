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
import { Markup, View, XMarkup } from './markup'

const name = 'markup'

describe('Markup.tsx', () => {

  describe('Markup card', () => {
    const cardMarkupProps: T.Model<any> = {
      name,
      state: { content: '' },
      changed: T.box(false)
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<View {...cardMarkupProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })
  })

  describe('Form Markup', () => {
    const formMarkupProps: Markup = { name, content: '' }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XMarkup model={formMarkupProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Does not render data-test attr - name not specified', () => {
      const { queryByTestId } = render(<XMarkup model={{ content: '' }} />)
      expect(queryByTestId(name)).not.toBeInTheDocument()
    })

  })
})