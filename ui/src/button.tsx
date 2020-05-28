import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { B, bond, Rec, S } from './telesync';
import { px } from './theme';
import { XToolTip } from './tooltip';

export interface Button {
  name: S
  label: S
  caption: S
  primary: B
  disabled: B
  link: B
  tooltip: S
}

export interface Buttons {
  buttons: Button[]
}

const
  css = stylesheet({
    buttons: {
      boxSizing: 'border-box',
      paddingTop: px(20),
    },
  })

const
  XButton = bond(({ args, model: m, submit }: { args: Rec, model: Button, submit: () => void }) => {
    args[m.name] = false
    const
      render = () => {
        const onClick = () => {
          args[m.name] = true
          submit()
        }
        if (m.link) {
          return (<Fluent.Link data-test='link' disabled={m.disabled} onClick={onClick}>{m.label}</Fluent.Link>)
        }
        return m.caption.length
          ? m.primary
            ? <Fluent.CompoundButton data-test={m.name} primary text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
            : <Fluent.CompoundButton data-test={m.name} text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
          : m.primary
            ? <Fluent.PrimaryButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
            : <Fluent.DefaultButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
      }
    return { render }
  })
export const
  XButtons = bond(({ args, model: m, submit }: { args: Rec, model: Buttons, submit: () => void }) => {
    const
      render = () => {
        const bs = m.buttons.map(b => {
          return (<XToolTip key={b.label} content={b.tooltip} showIcon={false} expand={false}><XButton button={b} args={args} submit={submit}>{b.label}</XButton></XToolTip>)
        })
        return <div className={css.buttons}><Fluent.Stack horizontal tokens={{ childrenGap: 10 }}>{bs}</Fluent.Stack></div>
      }
    return { render }
  }),
  XStandAloneButton = ({ args, model: m, submit }: { args: Rec, model: Button, submit: () => void }) => (<div><XButton key={m.label} button={m} args={args} submit={submit}>{m.label}</XButton></div>)