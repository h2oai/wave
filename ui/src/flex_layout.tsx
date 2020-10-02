import React, { CSSProperties } from 'react'
import { CardMenu } from './card_menu'
import { bond, Page, S, C } from './qd'
import { CardView } from './grid_layout'
import { stylesheet } from 'typestyle'
import { getTheme, pc } from './theme'

const
  { colors } = getTheme(),
  gap = 15,
  css = stylesheet({
    flex: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      backgroundColor: colors.page,
      height: 'min-content',
      width: pc(100)
    },
    slot: {
      backgroundColor: colors.card,
      boxSizing: 'border-box',
      borderRadius: 3,
      boxShadow: `0px 3px 5px ${colors.text0}`,
      overflow: 'auto',
      margin: gap,
      padding: 15
    },
  }),
  pageSortingF = (cardA: C, cardB: C) => {
    const
      [colA, rowA] = cardA.state.box.split(' '),
      [colB, rowB] = cardB.state.box.split(' '),
      a = +`${rowA}${colA}`,
      b = +`${rowB}${colB}`

    return b > a ? -1 : 1
  },
  FlexLinebreak = () => <div style={{ width: pc(100) }}></div>

export const
  FlexLayout = bond(({ page }: { page: Page }) => {
    const
      { changedB } = page,
      getStyle = (placement: S): CSSProperties | undefined => {
        const placements = placement.split(' ')
        if (placements.length < 3) return { flexGrow: 1, flexBasis: 200 }

        // Fixed width in px or %.
        const width = placements[2]
        if (width.endsWith('px')) return { width }
        // Unitless ratio-based width.
        if (!isNaN(+width)) return { flexGrow: +width }

        return undefined
      },
      render = () => {
        let currentRow = 1
        const
          children = page.list()
            .filter(c => c.name !== 'meta' && c.state.view !== 'top_nav' && c.state.view !== 'side_nav')
            .sort(pageSortingF)
            .map(c => {
              const
                cardRow = Number(c.state.box.split(' ')[1]),
                hasLinebreak = currentRow === cardRow - 1

              if (hasLinebreak) currentRow = cardRow

              return (
                <React.Fragment key={c.id}>
                  {hasLinebreak && <FlexLinebreak />}
                  <div className={css.slot} style={getStyle(c.state.box)}>
                    <CardView card={c} />
                    {!!c.state.commands?.length && <CardMenu name={c.name} commands={c.state.commands} changedB={c.changed} />}
                  </div>
                </React.Fragment>
              )
            })
        return <div data-test={page.key} className={css.flex}>{children}</div>

      }
    return { render, changedB }
  })