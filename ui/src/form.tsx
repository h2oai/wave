import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Button, Buttons, XButtons, XStandAloneButton } from './button'
import { Checkbox, XCheckbox } from './checkbox'
import { Checklist, XChecklist } from './checklist'
import { ChoiceGroup, XChoiceGroup } from './choice_group'
import { ColorPicker, XColorPicker } from './color_picker'
import { Combobox, XCombobox } from './combobox'
import { DatePicker, XDatePicker } from './date_picker'
import { Dropdown, XDropdown } from './dropdown'
import { Expander, XExpander } from './expander'
import { FileUpload, XFileUpload } from './file_upload'
import { Frame, XFrame } from './frame'
import { Label, XLabel } from './label'
import { cards } from './layout'
import { Link, XLink } from './link'
import { Markup, XMarkup } from './markup'
import { MessageBar, XMessageBar } from './message_bar'
import { Picker, XPicker } from './picker'
import { Visualization, XVisualization } from './plot'
import { Progress, XProgress } from './progress'
import { bond, Card, Packed, unpack, xid } from './qd'
import { RangeSlider, XRangeSlider } from './range_slider'
import { Separator, XSeparator } from './separator'
import { Slider, XSlider } from './slider'
import { Spinbox, XSpinbox } from './spinbox'
import { Stepper, XStepper } from './stepper'
import { Table, XTable } from './table'
import { Tabs, XTabs } from './tabs'
import { Template, XTemplate } from './template'
import { Text, TextL, TextM, TextS, TextXl, TextXs, XText } from './text'
import { Textbox, XTextbox } from './textbox'
import { getTheme, margin } from './theme'
import { Toggle, XToggle } from './toggle'
import { XToolTip } from './tooltip'
import { VegaVisualization, XVegaVisualization } from './vega'

/** Create a component. */
export interface Component {
  /** Text block. */
  text?: Text;
  /** Extra-large sized text block. */
  text_xl?: TextXl;
  /** Large sized text block. */
  text_l?: TextL;
  /** Medium sized text block. */
  text_m?: TextM;
  /** Small sized text block. */
  text_s?: TextS;
  /** Extra-small sized text block. */
  text_xs?: TextXs;
  /** Label. */
  label?: Label;
  /** Separator. */
  separator?: Separator;
  /** Progress bar. */
  progress?: Progress;
  /** Message bar. */
  message_bar?: MessageBar;
  /** Textbox. */
  textbox?: Textbox;
  /** Checkbox. */
  checkbox?: Checkbox;
  /** Toggle. */
  toggle?: Toggle;
  /** Choice group. */
  choice_group?: ChoiceGroup;
  /** Checklist. */
  checklist?: Checklist;
  /** Dropdown. */
  dropdown?: Dropdown;
  /** Combobox. */
  combobox?: Combobox;
  /** Slider. */
  slider?: Slider;
  /** Spinbox. */
  spinbox?: Spinbox;
  /** Date picker. */
  date_picker?: DatePicker;
  /** Color picker. */
  color_picker?: ColorPicker;
  /** Button. */
  button?: Button;
  /** Button set. */
  buttons?: Buttons;
  /** File upload. */
  file_upload?: FileUpload;
  /** Table. */
  table?: Table;
  /** Link. */
  link?: Link;
  /** Tabs. */
  tabs?: Tabs;
  /** Expander. */
  expander?: Expander;
  /** Frame. */
  frame?: Frame;
  /** Markup */
  markup?: Markup
  /** Template */
  template?: Template
  /** Picker.*/
  picker?: Picker;
  /** Range Slider. */
  range_slider?: RangeSlider;
  /** Stepper. */
  stepper?: Stepper;
  /** Visualization. */
  visualization?: Visualization;
  /** Vega-lite Visualization. */
  vega_visualization?: VegaVisualization;
}

/** Create a form. */
interface State {
  /** The components in this form. */
  items: Packed<Component[]>;
}


const
  theme = getTheme(),
  defaults: Partial<State> = { items: [] },
  css = stylesheet({
    form: {
      $nest: {
        '> *': {
          margin: margin(10, 0)
        }
      }
    }
  })


export const
  XComponents = ({ items }: { items: Component[] }) => {
    const components = items.map(m => <XComponent key={xid()} model={m} />)
    return <>{components}</>
  }

const
  XComponent = ({ model: m }: { model: Component }) => {
    if (m.text) return <XToolTip content={m.text.tooltip} expand={false}><XText name={m.text.name} content={m.text.content} size={m.text.size} visibility={m.text.visible} /></XToolTip>
    if (m.text_xl) return <XToolTip content={m.text_xl.tooltip} expand={false}><XText name={m.text_xl.name} content={m.text_xl.content} size='xl' commands={m.text_xl.commands} visibility={m.text_xl.visible} /></XToolTip>
    if (m.text_l) return <XToolTip content={m.text_l.tooltip} expand={false}><XText name={m.text_l.name} content={m.text_l.content} size='l' commands={m.text_l.commands} visibility={m.text_l.visible} /></XToolTip>
    if (m.text_m) return <XToolTip content={m.text_m.tooltip} expand={false}><XText name={m.text_m.name} content={m.text_m.content} visibility={m.text_m.visible} /></XToolTip>
    if (m.text_s) return <XToolTip content={m.text_s.tooltip} expand={false}><XText name={m.text_s.name} content={m.text_s.content} size='s' visibility={m.text_s.visible} /></XToolTip>
    if (m.text_xs) return <XToolTip content={m.text_xs.tooltip} expand={false}><XText name={m.text_xs.name} content={m.text_xs.content} size='xs' visibility={m.text_xs.visible} /></XToolTip>
    if (m.label) return <XToolTip content={m.label.tooltip} expand={false}><XLabel model={m.label} /></XToolTip>
    if (m.link) return <XToolTip content={m.link.tooltip} expand={false}><XLink model={m.link} /></XToolTip>
    if (m.separator) return <XSeparator model={m.separator} />
    if (m.progress) return <XToolTip content={m.progress.tooltip}><XProgress model={m.progress} /></XToolTip>
    if (m.message_bar) return <XMessageBar model={m.message_bar} />
    if (m.textbox) return <XToolTip content={m.textbox.tooltip}><XTextbox model={m.textbox} /></XToolTip>
    if (m.checkbox) return <XToolTip content={m.checkbox.tooltip} expand={false}><XCheckbox model={m.checkbox} /></XToolTip>
    if (m.toggle) return <XToolTip content={m.toggle.tooltip} expand={false}><XToggle model={m.toggle} /></XToolTip>
    if (m.choice_group) return <XToolTip content={m.choice_group.tooltip}><XChoiceGroup model={m.choice_group} /></XToolTip>
    if (m.dropdown) return <XToolTip content={m.dropdown.tooltip}><XDropdown model={m.dropdown} /></XToolTip>
    if (m.checklist) return <XToolTip content={m.checklist.tooltip}><XChecklist model={m.checklist} /></XToolTip>
    if (m.combobox) return <XToolTip content={m.combobox.tooltip}><XCombobox model={m.combobox} /></XToolTip>
    if (m.slider) return <XToolTip content={m.slider.tooltip}><XSlider model={m.slider} /></XToolTip>
    if (m.spinbox) return <XToolTip content={m.spinbox.tooltip} expand={false}><XSpinbox model={m.spinbox} /></XToolTip>
    if (m.date_picker) return <XToolTip content={m.date_picker.tooltip}><XDatePicker model={m.date_picker} /></XToolTip>
    if (m.color_picker) return <XToolTip content={m.color_picker.tooltip}><XColorPicker model={m.color_picker} /></XToolTip>
    if (m.file_upload) return <XToolTip content={m.file_upload.tooltip}><XFileUpload model={m.file_upload} /></XToolTip>
    if (m.table) return <XToolTip content={m.table.tooltip}><XTable model={m.table} /></XToolTip>
    if (m.buttons) return <XButtons model={m.buttons} />
    if (m.tabs) return <XTabs model={m.tabs} />
    if (m.button) return <XToolTip content={m.button.tooltip} showIcon={false} expand={false}><XStandAloneButton model={m.button} /></XToolTip>
    if (m.expander) return <XExpander model={m.expander} />
    if (m.frame) return <XFrame model={m.frame} />
    if (m.markup) return <XMarkup model={m.markup} />
    if (m.template) return <XTemplate model={m.template} />
    if (m.picker) return <XToolTip content={m.picker.tooltip}><XPicker model={m.picker} /></XToolTip>
    if (m.range_slider) return <XToolTip content={m.range_slider.tooltip}><XRangeSlider model={m.range_slider} /></XToolTip>
    if (m.stepper) return <XToolTip content={m.stepper.tooltip}><XStepper model={m.stepper} /></XToolTip>
    if (m.visualization) return <XVisualization model={m.visualization} />
    if (m.vega_visualization) return <XVegaVisualization model={m.vega_visualization} />
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  }

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          items = unpack<Component[]>(s.items) // XXX ugly

        return (
          <div data-test={name} className={css.form}>
            <XComponents items={items} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('form', View)

