import React, { CSSProperties } from 'react'
import { CardMenu } from './card_menu'
import { bond, Page, S } from './qd'
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
    page: {
      width: pc(100)
    }
  })

export const
  FlexLayout = bond(({ page }: { page: Page }) => {
    const
      { changedB } = page,
      getStyle = (placement: S): CSSProperties | undefined => {
        placement = placement.endsWith('|') ? placement.slice(0, -1) : placement
        if (placement === '') return { flexGrow: 1, flexBasis: pc(100) }
        if (placement.endsWith('px')) return { width: placement }
        if (!isNaN(+placement)) return { minWidth: `calc(${pc(+placement * 100)} - ${gap * 5}px)`, flexGrow: 1 }
        return undefined
      },
      render = () => {
        const
          children = page.list()
            .filter(c => c.name !== 'meta')
            .map(c => (
              <React.Fragment key={c.id}>
                <div className={css.slot} style={getStyle(c.state.box)}>
                  <CardView card={c} />
                  <CardMenu card={c} />
                </div>
                {/* Serves as a line break. */}
                {(c.state.box as S).endsWith('|') && <div style={{ width: pc(100) }}></div>}
              </React.Fragment>
            )
            )
        return (
          <div data-test={page.key} className={css.page}>
            <div className={css.flex}>{children}</div>
          </div>
        )
      }
    return { render, changedB }
  })