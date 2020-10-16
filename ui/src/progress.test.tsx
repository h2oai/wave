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

  it('Does not display progress when visible is false', () => {
    const { queryByTestId } = render(<XProgress model={{ ...progressProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })
})