import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { Button, Buttons, XButtons, XStandAloneButton } from './button';
import { Checkbox, XCheckbox } from './checkbox';
import { Checklist, XChecklist } from './checklist';
import { ChoiceGroup, XChoiceGroup } from './choice_group';
import { ColorPicker, XColorPicker } from './color_picker';
import { Combobox, XCombobox } from './combobox';
import { DatePicker, XDatePicker } from './date_picker';
import { Dropdown, XDropdown } from './dropdown';
import { Expander, XExpander } from './expander';
import { FileUpload, XFileUpload } from './file_upload';
import { Label, XLabel } from './label';
import { cards } from './layout';
import { Link, XLink } from './link';
import { MessageBar, XMessageBar } from './message_bar';
import { Nav, XNav } from './nav';
import { Progress, XProgress } from './progress';
import { Separator, XSeparator } from './separator';
import { Slider, XSlider } from './slider';
import { Spinbox, XSpinbox } from './spinbox';
import { Table, XTable } from './table';
import { Tabs, XTabs } from './tabs';
import { bond, Card, Packed, Rec, S, socket, unpack } from './telesync';
import { Text, XText } from './text';
import { Textbox, XTextbox } from './textbox';
import { getTheme } from './theme';
import { Toggle, XToggle } from './toggle';
import { XToolTip } from './tooltip';

/** Create a component. */
export interface Component {
  /** Text block. */
  text?: Text
  /** Label. */
  label?: Label
  /** Separator. */
  separator?: Separator
  /** Progress bar. */
  progress?: Progress
  /** Message bar. */
  message_bar?: MessageBar
  /** Textbox. */
  textbox?: Textbox
  /** Checkbox. */
  checkbox?: Checkbox
  /** Toggle. */
  toggle?: Toggle
  /** Choice group. */
  choice_group?: ChoiceGroup
  /** Checklist. */
  checklist?: Checklist
  /** Dropdown. */
  dropdown?: Dropdown
  /** Combobox. */
  combobox?: Combobox
  /** Slider. */
  slider?: Slider
  /** Spinbox. */
  spinbox?: Spinbox
  /** Date picker. */
  date_picker?: DatePicker
  /** Color picker. */
  color_picker?: ColorPicker
  /** Button. */
  button?: Button
  /** Button set. */
  buttons?: Buttons
  /** File upload. */
  file_upload?: FileUpload
  /** Table. */
  table?: Table
  /** Link. */
  link?: Link
  /** Tabs. */
  tabs?: Tabs
  /** Expander. */
  expander?: Expander
  /** Navigation. */
  nav?: Nav
}

/** Create a form. */
interface State {
  url: S
  args: Rec
  /** The components in this form. */
  items: Packed<Component[]>
}


const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
  defaults: Partial<State> = {
    url: '',
    args: {},
    items: []
  }

// const
//   XButton = bond(({ args, button: m, submit }: { args: Rec, button: Button, submit: () => void }) => {
//     args[m.name] = false
//     const
//       render = () => {
//         const onClick = () => {
//           args[m.name] = true
//           submit()
//         }
//         return <button data-test={m.name} onClick={onClick} >{m.label}</button>
//       }
//     return { render }
//   }),
//   XField = ({ component: c, args, submit }: { component: Component, args: Rec, submit: () => void }) => {
//     if (c.button) return <XButton key={xid()} args={args} button={c.button} submit={submit} />
//     return <div />
//   }


export const
  XComponents = ({ args, items, submit }: { args: Rec, items: Component[], submit: () => void }) => {
    const components = items.map((m, i) => <XComponent key={i} model={m} args={args} submit={submit} />)
    // TODO gap 10px between fields
    return <>{components}</>
  }

const
  XComponent = ({ model: m, args, submit }: { model: Component, args: Rec, submit: () => void }) => {
    if (m.text) return <XToolTip content={m.text.tooltip} expand={false}><XText model={m.text} /></XToolTip>
    if (m.label) return <XToolTip content={m.label.tooltip} expand={false}><XLabel model={m.label} /></XToolTip>
    if (m.link) return <XToolTip content={m.link.tooltip} expand={false}><XLink model={m.link} /></XToolTip>
    if (m.separator) return <XSeparator model={m.separator} />
    if (m.progress) return <XToolTip content={m.progress.tooltip}><XProgress model={m.progress} /></XToolTip>
    if (m.message_bar) return <XMessageBar model={m.message_bar} />
    if (m.textbox) return <XToolTip content={m.textbox.tooltip}><XTextbox args={args} model={m.textbox} /></XToolTip>
    if (m.checkbox) return <XToolTip content={m.checkbox.tooltip} expand={false}><XCheckbox args={args} model={m.checkbox} submit={submit} /></XToolTip>
    if (m.toggle) return <XToolTip content={m.toggle.tooltip} expand={false}><XToggle args={args} model={m.toggle} submit={submit} /></XToolTip>
    if (m.choice_group) return <XToolTip content={m.choice_group.tooltip}><XChoiceGroup args={args} model={m.choice_group} submit={submit} /></XToolTip>
    if (m.dropdown) return <XToolTip content={m.dropdown.tooltip}><XDropdown args={args} model={m.dropdown} submit={submit} /></XToolTip>
    if (m.checklist) return <XToolTip content={m.checklist.tooltip}><XChecklist args={args} model={m.checklist} /></XToolTip>
    if (m.combobox) return <XToolTip content={m.combobox.tooltip}><XCombobox args={args} model={m.combobox} /></XToolTip>
    if (m.slider) return <XToolTip content={m.slider.tooltip}><XSlider args={args} model={m.slider} submit={submit} /></XToolTip>
    if (m.spinbox) return <XToolTip content={m.spinbox.tooltip} expand={false}><XSpinbox args={args} model={m.spinbox} /></XToolTip>
    if (m.date_picker) return <XToolTip content={m.date_picker.tooltip}><XDatePicker args={args} model={m.date_picker} /></XToolTip>
    if (m.color_picker) return <XToolTip content={m.color_picker.tooltip}><XColorPicker args={args} model={m.color_picker} /></XToolTip>
    if (m.file_upload) return <XToolTip content={m.file_upload.tooltip}><XFileUpload args={args} model={m.file_upload} submit={submit} /></XToolTip>
    if (m.table) return <XToolTip content={m.table.tooltip}><XTable args={args} model={m.table} submit={submit} /></XToolTip>
    if (m.buttons) return <XButtons args={args} model={m.buttons} submit={submit} />
    if (m.tabs) return <XTabs args={args} model={m.tabs} submit={submit} />
    if (m.button) return <XToolTip content={m.button.tooltip} showIcon={false} expand={false}><XStandAloneButton args={args} model={m.button} submit={submit} /></XToolTip>
    if (m.expander) return <XExpander args={args} model={m.expander} submit={submit} />
    if (m.nav) return <XNav args={args} model={m.nav} submit={submit} />
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  },
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          items = unpack<Component[]>(s.items), // XXX ugly
          args = unpack(s.args),
          submit = () => {
            const sock = socket.current
            if (!sock) return
            sock.send(`@ ${s.url} ${JSON.stringify(args)}`)
          }

        return (
          <div className={css.card}>
            <XComponents items={items} args={args} submit={submit} />
          </div>)
      }
    return { render, changed }
  })

cards.register('form', View)

