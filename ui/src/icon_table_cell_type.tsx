import * as Fluent from '@fluentui/react'
import React from 'react'
import { bond, S } from './qd'

/**
 * Create a cell type that renders a column's cells as icons instead of plain text.
 * If set on a column, the cell value is interpreted as the name of the icon to be displayed.
*/
export interface IconTableCellType {
  /** Icon color. */
  color?: S
}

export const XIconTableCellType = bond(({ model: m, icon }: { model: IconTableCellType, icon: S }) => {
  const
    render = () => <Fluent.Icon iconName={icon} styles={{ root: { fontSize: '1.2rem', color: m.color || 'inherit' } }} />

  return { render }
})