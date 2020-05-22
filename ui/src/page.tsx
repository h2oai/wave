import React from 'react';
import { stylesheet } from 'typestyle';
import bond from './bond';
import { Page } from './delta';
import { CardView, grid } from './grid';
import { getTheme } from './theme';

// interface PageViewProps { page: Page }

const
  theme = getTheme(),
  css = stylesheet({
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

export const PageView = bond(({ page }: { page: Page }) => {
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
        <div className="grid" style={{ width: 0, height: 0, transform: `translate(${grid.gap}px,${grid.gap}px)` }}>
          {children}
        </div>
      )
    }
  return { render, changedB }
})
