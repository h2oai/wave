import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { Markdown, MarkdownInline } from './markdown';
import { Dict, S } from './telesync';
import { border, getTheme, padding, pc } from './theme';

/** Create text content. */
export interface Text {
  /** The text content. */
  content: S
  /** The font size of the text content. One of "xl" (extra large), "l" (large), "m" (medium), "s" (small), "xs" (extra small). */
  size?: S
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  theme = getTheme(),
  css = stylesheet({
    markdown: {
      $nest: {
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
  toTextVariant = (s: S) => { const v = textVariants[s]; return v ? v : 'mediumPlus' }

export const
  XText = ({ model: m }: { model: Text }) => {
    const
      name = 'text' + (m.size ? `-${m.size}` : ''),
      md = m.content.indexOf('\n') >= 0
        ? <div className={css.markdown}><Markdown source={m.content} /></div>
        : <MarkdownInline source={m.content} />
    return <Fluent.Text data-test={name} variant={toTextVariant(m.size || 'm')} block>{md}</Fluent.Text>
  }