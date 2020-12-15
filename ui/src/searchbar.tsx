import * as Fluent from '@fluentui/react'
import React from 'react'
import {Button, Buttons, XButtons, XStandAloneButton} from './button'
import {Label, XLabel} from './label'
import {cards} from './layout'
import {bond, Card, Dict, Packed, S, unpack, xid} from './qd'
import {Textbox, XTextbox} from './textbox'
import {getTheme} from './theme'
import {XToolTip} from './tooltip'


/** Create a SearchBar. */
export interface SearchBar {
  /** Label. */
  label?: Label;
  /** Textbox. */
  textbox?: Textbox;
  /** Button. */
  button?: Button;
  /** Button set. */
  buttons?: Buttons;
}

/** Create a searchbar. */
interface State {
  /** The components in this searchbar. */
  items: Packed<SearchBar[]>;

  /** SearchBar direction. */
  direction?: 'horizontal' | 'vertical'

  /** SearchBar strategy for main axis. */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'

  /** SearchBar strategy for cross axis. */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'

  /** SearchBar wrapping strategy. */
  wrap?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
}


const
    theme = getTheme(),
    defaults: Partial<State> = {items: []},
    directions: Dict<S> = {
        horizontal: 'row',
        vertical: 'column',
    },
    justifications: Dict<S> = {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        between: 'space-between',
        around: 'space-around',
    },
    alignments: Dict<S> = {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        baseline: 'baseline',
        stretch: 'stretch',
    },
    wrappings: Dict<S> = {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        between: 'space-between',
        around: 'space-around',
        stretch: 'stretch',
    },
    toFlexStyle = (state: State): React.CSSProperties => {
        const
            css: React.CSSProperties = { display: 'flex', flexGrow: 1 },
            direction = directions[state.direction || ''],
            justify = justifications[state.justify || ''],
            align = alignments[state.align || ''],
            wrap = wrappings[state.wrap || '']

        if (direction) css.flexDirection = direction as any
        if (justify) css.justifyContent = justify
        if (align) css.alignItems = align
        if (wrap) {
            css.flexWrap = 'wrap'
            css.alignContent = wrap
        }
        return css
    }


export const
  XSearchBar = ({ items }: { items: SearchBar[] }) => {
    const components = items.map(m => <XStandardSearchBar key={xid()} model={m}  />)
    return <>{components}</>
  }

const
    XStandardSearchBar = ({ model: m }: { model: SearchBar }) => {
    if (m.label) return <XToolTip content={m.label.tooltip} expand={false}><XLabel model={m.label} /></XToolTip>
    if (m.textbox) return <XToolTip content={m.textbox.tooltip}><XTextbox model={m.textbox} /></XToolTip>
    if (m.buttons) return <XButtons model={m.buttons} />
    if (m.button) return <XToolTip content={m.button.tooltip} showIcon={false} expand={false}><XStandAloneButton model={m.button} /></XToolTip>
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  }

export const
  View = bond(({ name, state, changed }: Card<State>) => {

    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          items = unpack<SearchBar[]>(s.items)
        return (
            <div data-test={name} style={toFlexStyle(state)}>
                <XSearchBar items={items} />
            </div>
        )
      }
    return { render, changed }
  })

cards.register('searchbar', View)
