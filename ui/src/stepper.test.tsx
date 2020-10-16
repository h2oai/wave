import React from 'react'
import { render } from '@testing-library/react'
import { XStepper, Stepper } from './stepper'
import { initializeIcons } from '@fluentui/react'

let stepperProps: Stepper

describe('Stepper.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    stepperProps = {
      name: 'stepper',
      items: [
        { label: 'Step1' },
        { label: 'Step2' },
        { label: 'Step3' },
      ]
    }
  })

  it('Does not display stepper when visible is false', () => {
    const { queryByTestId } = render(<XStepper model={{ ...stepperProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
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