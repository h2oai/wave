
import React from 'react';
import { bond, F, U } from './qd';
import { ProgressArc } from './parts/progress_arc';
import { grid } from './layout';
import { stylesheet } from 'typestyle';
import { getTheme } from './theme';

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
 * Create a custom cell for progress values. The value of the model must be
 * a valid percentage (between 0 - 100).
*/
export interface ProgressTableCellType {
  /** Specify thickness for a progress arc. Default value is 2. */
  thickness?: U
}

export const XProgressTableCellType = bond(({ model: m, progress }: { model: ProgressTableCellType, progress: F }) => {
  const
    render = () => (
      <div className={css.container}>
        <ProgressArc size={grid.unitInnerHeight} thickness={m.thickness || 2} color={theme.color('red')} value={progress / 100} />
        <div className={css.percentContainer}>
          <div className={css.percent}>{`${Math.round(progress)}%`}</div>
        </div>
      </div>
    )

  return { render }
})