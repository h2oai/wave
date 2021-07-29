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
import { Stepper, XStepper } from './stepper'

let stepperProps: Stepper
const name = 'stepper'

describe('Stepper.tsx', () => {
  beforeEach(() => {
    stepperProps = {
      name,
      items: [
        { label: 'Step1' },
        { label: 'Step2' },
        { label: 'Step3' },
      ]
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XStepper model={stepperProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders step numbers by default', () => {
    const { queryByText } = render(<XStepper model={stepperProps} />)

    expect(queryByText('1')).toBeInTheDocument()
    expect(queryByText('2')).toBeInTheDocument()
    expect(queryByText('3')).toBeInTheDocument()
  })

  it('Renders labels', () => {
    const { queryByText } = render(<XStepper model={stepperProps} />)

    expect(queryByText('Step1')).toBeInTheDocument()
    expect(queryByText('Step2')).toBeInTheDocument()
    expect(queryByText('Step3')).toBeInTheDocument()
  })

  it('Renders step icons', () => {
    stepperProps = {
      ...stepperProps,
      items: [
        { label: 'Step1', icon: 'Cafe' },
        { label: 'Step2', icon: 'Cafe' },
        { label: 'Step3', icon: 'Cafe' },
      ]
    }
    const { container } = render(<XStepper model={stepperProps} />)
    expect(container.querySelectorAll('[data-icon-name="Cafe"]').length).toBe(3)
  })

  it('Disables steps correctly - nothing done', () => {
    const { container } = render(<XStepper model={stepperProps} />)
    expect(container.querySelectorAll('div[class*="disabled_"]').length).toBe(2)
  })
})