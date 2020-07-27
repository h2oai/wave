import React from 'react';
import { stylesheet } from 'typestyle';
import { F, S, U } from '../qd';

const css = stylesheet({
  body: {
    position: 'relative',
  },
  rail: {
    position: 'absolute',
    width: '100%',
    opacity: 0.15,
  },
  bar: {
    position: 'absolute',
  }
})

interface Props {
  thickness: U
  color: S
  value: F
}

export const ProgressBar = ({ thickness, color, value }: Props) => {
  return (
    <div className={css.body} style={{ height: thickness }}>
      <div className={css.rail} style={{ height: thickness, backgroundColor: color }} />
      <div className={css.bar} style={{ width: `${Math.round(value * 100)}%`, height: thickness, backgroundColor: color }} />
    </div>
  )
}
