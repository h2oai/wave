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
  })

export const
  FlexLayout = bond(({ page }: { page: Page }) => {
    const
      { changedB } = page,
      getStyle = (placement: S): CSSProperties | undefined => {
        placement = placement.endsWith('|') ? placement.slice(0, -1) : placement
        if (placement === '') return { flexGrow: 1, flexBasis: 200 }
        if (placement.endsWith('px')) return { width: placement }
        if (!isNaN(+placement)) return { flexGrow: +placement }
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
        return <div data-test={page.key} className={css.flex}>{children}</div>

      }
    return { render, changedB }
  })