import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardMenu } from './card_menu'
import { Markdown } from './markdown'
import { Dict, S } from './qd'
import { border, getTheme, padding, palette, pc } from './theme'
import { Command } from './toolbar'

/** Create text content. */
export interface Text {
  /** The text content. */
  content: S
  /** The font size of the text content. */
  size?: 'xl' | 'l' | 'm' | 's' | 'xs'
  /** Tooltip message. */
  tooltip?: S
}

/** Create extra-large sized text content. */
export interface TextXl {
  /** The text content. */
  content: S
  /** Tooltip message. */
  tooltip?: S
  /** Contextual menu commands for this component. */
  commands?: Command[]
}

/** Create large sized text content. */
export interface TextL {
  /** The text content. */
  content: S
  /** Tooltip message. */
  tooltip?: S
  /** Contextual menu commands for this component. */
  commands?: Command[]
}

/** Create medium sized text content. */
export interface TextM {
  /** The text content. */
  content: S
  /** Tooltip message. */
  tooltip?: S
}

/** Create small sized text content. */
export interface TextS {
  /** The text content. */
  content: S
  /** Tooltip message. */
  tooltip?: S
}

/** Create extra-small sized text content. */
export interface TextXs {
  /** The text content. */
  content: S
  /** Tooltip message. */
  tooltip?: S
}

const
  theme = getTheme(),
  css = stylesheet({
    text: {
      position: 'relative',
    },
    markdown: {
      $nest: {
        a: {
          color: palette.themePrimary,
          $nest: {
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
        table: {
          width: pc(100),
          borderCollapse: 'collapse',
        },
        tr: {
          borderBottom: border(1, theme.colors.text5),
        },
        th: {
          padding: padding(11, 6),
          textAlign: 'left',
        },
        td: {
          padding: padding(11, 6),
        }
      }
    },
  }),
  textVariants: Dict<keyof Fluent.IFontStyles> = {
    xl: 'xLarge',
    l: 'large',
    m: 'medium',
    s: 'small',
    xs: 'xSmall',
  },
  toTextVariant = (s: S) => textVariants[s] || 'mediumPlus'

export const
  XText = ({ content, size, commands }: { content: S, size?: S, commands?: Command[] }) => {
    const
      name = 'text' + (size ? `-${size}` : '')
    return (
      <div className={css.text}>
        <Fluent.Text data-test={name} variant={toTextVariant(size || 'm')} block>
          <div className={css.markdown}><Markdown source={content} /></div>
        </Fluent.Text>
        {!!commands?.length && <CardMenu name={name} commands={commands} />}
      </div>
    )
  }