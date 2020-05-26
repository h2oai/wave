import React from 'react';
import { stylesheet } from 'typestyle';
import { CardView, grid } from './grid';
import { bond, Page } from './telesync';
import { getTheme } from './theme';

// interface PageViewProps { page: Page }

const
  theme = getTheme(),
  css = stylesheet({
    grid: {
      width: grid.innerWidth,
      height: grid.innerHeight,
      transform: `translate(${grid.gap}px,${grid.gap}px)`,
    },
    slot: {
      position: 'absolute',
      backgroundColor: theme.colors.card,
      boxSizing: 'border-box',
      borderRadius: 3,
      boxShadow: `0px 3px 5px ${theme.colors.text0}`,
      overflow: 'auto',
      $nest: {
        '>*:first-child': {
          position: 'absolute',
          left: grid.gap, top: grid.gap, right: grid.gap, bottom: grid.gap,
        }
      }
    }
  })

export const GridLayout = bond(({ page }: { page: Page }) => {
  const
    { changed: changedB } = page,
    render = () => {
      const
        children = page.list().map(c => {
          const box = grid.place(c.state.box), { left, top, width, height } = box
          c.size = { width: box.width, height: box.height }
          return (
            <div key={c.id} className={css.slot} style={{ width, height, transform: `translate(${left}px,${top}px)` }}>
              <CardView card={c} />
            </div>
          )
        })
      return (
        <div className={css.grid}>
          {children}
        </div>
      )
    }
  return { render, changedB }
})
