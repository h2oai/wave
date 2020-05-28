import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { Markdown, MarkdownInline } from './markdown';
import { Dict, S } from './telesync';
import { border, getTheme, padding, pc } from './theme';

export interface Text {
  size: S
  text: S
  tooltip: S
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
      md = m.text.indexOf('\n') >= 0
        ? <div className={css.markdown}><Markdown source={m.text} /></div>
        : <MarkdownInline source={m.text} />
    return <Fluent.Text data-test={name} variant={toTextVariant(m.size)} block>{md}</Fluent.Text>
  }