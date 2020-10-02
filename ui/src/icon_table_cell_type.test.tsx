import React from 'react'
import { render } from '@testing-library/react'
import { IconTableCellType, XIconTableCellType } from './icon_table_cell_type'

const
  name = 'icon-cell',
  icon = '',
  iconCellProps: IconTableCellType = { name }

describe('IconTableCellType.tsx', () => {

  it('Does not render data-test attr ', () => {
    const { container } = render(<XIconTableCellType model={{}} icon={icon} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XIconTableCellType model={iconCellProps} icon={icon} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})