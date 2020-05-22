import React from 'react';
import { stylesheet } from 'typestyle';
import bond from '../bond';
import { Card, decode, S, socket, xid, Rec } from '../delta';
import { cards } from '../grid';
import { getTheme } from '../theme';


interface UIComponent {
  button?: UIButton
}

interface UIButton {
  name: S
  label: S
}

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    }
  })

interface State {
  url: S
  method: S
  args: Rec
  items: UIComponent[]
}

const defaults: Partial<State> = {
  url: '',
  method: '',
  args: {},
  items: []
}

const
  XButton = bond(({ args, button: m, submit }: { args: Rec, button: UIButton, submit: () => void }) => {
    args[m.name] = false
    const
      render = () => {
        const onClick = () => {
          args[m.name] = true
          submit()
        }
        return <button data-test={m.name} onClick={onClick} >{m.label}</button>
      }
    return { render }
  }),
  XField = ({ component: c, args, submit }: { component: UIComponent, args: Rec, submit: () => void }) => {
    if (c.button) return <XButton key={xid()} args={args} button={c.button} submit={submit} />
    return <div />
  }


const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          items = decode<UIComponent[]>(s.items), // XXX ugly
          args = decode(s.args),
          submit = () => {
            const sock = socket.current
            if (!sock) return
            sock.send(`@ ${s.url} ${JSON.stringify(args)}`)
          },
          fields = items.map((c, i) => <XField key={i} component={c} args={args} submit={submit} />)

        return (
          <div className={css.card}>
            {fields}
          </div>)
      }
    return { render, changed }
  })

cards.register('form', View)

