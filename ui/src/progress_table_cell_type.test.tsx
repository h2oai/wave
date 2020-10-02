import React from 'react'
import { render } from '@testing-library/react'
import { ProgressTableCellType, XProgressTableCellType} from './progress_table_cell_type'

const
  name = 'progress-cell',
  progress = 0.0,
  progressCellProps: ProgressTableCellType = { name }

describe('ProgressTableCellType.tsx', () => {

  it('Does not render data-test attr ', () => {
    const { container } = render(<XProgressTableCellType model={{}} progress={progress} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XProgressTableCellType model={progressCellProps} progress={progress} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})