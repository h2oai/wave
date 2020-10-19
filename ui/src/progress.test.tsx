import React from 'react'
import { render } from '@testing-library/react'
import { XProgress, Progress } from './progress'

const
  name = 'progress',
  progressProps: Progress = { name, label: name }

describe('Progress.tsx', () => {

  it('Does not render data-test attr', () => {
    const { container } = render(<XProgress model={{ label: 'progress' }} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XProgress model={progressProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})