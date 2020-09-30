
import React from 'react'
import { bond, F, S } from './qd'
import { ProgressArc } from './parts/progress_arc'
import { grid } from './grid_layout'
import { stylesheet } from 'typestyle'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    container: {
      display: 'flex'
    },
    percentContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'absolute',
      left: 12,
      top: 10,
      width: grid.unitInnerHeight,
      height: grid.unitInnerHeight,
    },
    percent: {
      ...theme.font.s12,
      opacity: 0.5,
    },
  })

/**
 * Create a cell type that renders a column's cells as progress bars instead of plain text.
 * If set on a column, the cell value must be between 0.0 and 1.0.
*/
export interface ProgressTableCellType {
  /** Color of the progress arc. */
  color?: S
}

export const XProgressTableCellType = bond(({ model: m, progress }: { model: ProgressTableCellType, progress: F }) => {
  const
    render = () => (
      <div className={css.container}>
        <ProgressArc size={grid.unitInnerHeight} thickness={2} color={theme.color(m.color || 'red')} value={progress} />
        <div className={css.percentContainer}>
          <div className={css.percent}>{`${Math.round(progress * 100)}%`}</div>
        </div>
      </div>
    )

  return { render }
})