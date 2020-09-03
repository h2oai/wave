import React from 'react';
import { render } from '@testing-library/react';
import { XProgress, Progress } from './progress';

const
  name = 'progress',
  progressProps: Progress = { label: name }

describe('Progress.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XProgress model={progressProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})