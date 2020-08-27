import React from 'react';
import { render } from '@testing-library/react';
import { View } from './stepper';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

let stepperProps: T.Card<any>

describe('Stepper.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    stepperProps = {
      name: 'stepper',
      state: {
        items: [
          { label: 'Step1' },
          { label: 'Step2' },
          { label: 'Step3' },
        ]
      },
      changed: T.box(false)
    }
  })

  it('Throws error when done steps are not in order', () => {
    stepperProps = {
      ...stepperProps,
      state: {
        items: [
          { label: 'Step1' },
          { label: 'Step2' },
          { label: 'Step3', done: true },
        ]
      }
    }
    // Should throw an error, but we don't want to see it in testing terminal.
    jest.spyOn(console, 'error').mockImplementation(jest.fn())

    expect(() => render(<View {...stepperProps} />)).toThrowError()
  })

  it('Renders step numbers by default', () => {
    const { queryByText } = render(<View {...stepperProps} />)

    expect(queryByText('1')).toBeInTheDocument()
    expect(queryByText('2')).toBeInTheDocument()
    expect(queryByText('3')).toBeInTheDocument()
  })

  it('Renders labels', () => {
    const { queryByText } = render(<View {...stepperProps} />)

    expect(queryByText('Step1')).toBeInTheDocument()
    expect(queryByText('Step2')).toBeInTheDocument()
    expect(queryByText('Step3')).toBeInTheDocument()
  })

  it('Renders step icons', () => {
    stepperProps = {
      ...stepperProps,
      state: {
        items: [
          { label: 'Step1', icon: 'Cafe' },
          { label: 'Step2', icon: 'Cafe' },
          { label: 'Step3', icon: 'Cafe' },
        ]
      }
    }
    const { container } = render(<View {...stepperProps} />)
    expect(container.querySelectorAll('[data-icon-name="Cafe"]').length).toBe(3)
  })

  it('Disables steps correctly - nothing done', () => {
    const { container } = render(<View {...stepperProps} />)
    expect(container.querySelectorAll('div[class*="disabled_"]').length).toBe(2)
  })
})