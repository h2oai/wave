// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Model, Packed, S, unpack } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { AudioAnnotator, XAudioAnnotator } from './audio_annotator'
import { Button, Buttons, MiniButton, MiniButtons, XButtons, XMiniButton, XMiniButtons, XStandAloneButton } from './button'
import { Checkbox, XCheckbox } from './checkbox'
import { Checklist, XChecklist } from './checklist'
import { ChoiceGroup, XChoiceGroup } from './choice_group'
import { ColorPicker, XColorPicker } from './color_picker'
import { Combobox, XCombobox } from './combobox'
import { CopyableText, XCopyableText } from "./copyable_text"
import { DatePicker, XDatePicker } from './date_picker'
import { Dropdown, XDropdown } from './dropdown'
import { Expander, XExpander } from './expander'
import { Facepile, XFacepile } from "./facepile"
import { FileUpload, XFileUpload } from './file_upload'
import { Frame, XFrame } from './frame'
import { Image, XImage } from './image'
import { ImageAnnotator, XImageAnnotator } from './image_annotator'
import { Label, XLabel } from './label'
import { cards } from './layout'
import { Link, Links, XLink, XLinks } from './link'
import { Markup, XMarkup } from './markup'
import { Menu, XMenu } from './menu'
import { MessageBar, XMessageBar } from './message_bar'
import { Persona, XPersona } from "./persona"
import { Picker, XPicker } from './picker'
import { Visualization, XVisualization } from './plot'
import { Progress, XProgress } from './progress'
import { RangeSlider, XRangeSlider } from './range_slider'
import { Separator, XSeparator } from './separator'
import { Slider, XSlider } from './slider'
import { Spinbox, XSpinbox } from './spinbox'
import { Stats, XStats } from './stats'
import { Stepper, XStepper } from './stepper'
import { Table, XTable } from './table'
import { Tabs, XTabs } from './tabs'
import { Tags, XTags } from './tags'
import { Template, XTemplate } from './template'
import { Text, TextL, TextM, TextS, TextXl, TextXs, XText } from './text'
import { TextAnnotator, XTextAnnotator } from './text_annotator'
import { Textbox, XTextbox } from './textbox'
import { alignments, clas, cssVar, justifications, padding } from './theme'
import { TimePicker, XTimePicker } from './time_picker'
import { Toggle, XToggle } from './toggle'
import { XToolTip } from './tooltip'
import { bond } from './ui'
import { VegaVisualization, XVegaVisualization } from './vega'

/** Create a component. */
export interface Component {
  /** Text block. */
  text?: Text
  /** Extra-large sized text block. */
  text_xl?: TextXl
  /** Large sized text block. */
  text_l?: TextL
  /** Medium sized text block. */
  text_m?: TextM
  /** Small sized text block. */
  text_s?: TextS
  /** Extra-small sized text block. */
  text_xs?: TextXs
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
  /** Mini button. */
  mini_button?: MiniButton
  /** Mini button set. */
  mini_buttons?: MiniButtons
  /** File upload. */
  file_upload?: FileUpload
  /** Table. */
  table?: Table;
  /** Link. */
  link?: Link
  /** Link set. */
  links?: Links
  /** Tabs. */
  tabs?: Tabs;
  /** Expander. */
  expander?: Expander
  /** Frame. */
  frame?: Frame
  /** Markup */
  markup?: Markup
  /** Template. */
  template?: Template
  /** Picker. */
  picker?: Picker
  /** Range Slider. */
  range_slider?: RangeSlider
  /** Stepper. */
  stepper?: Stepper
  /** Visualization. */
  visualization?: Visualization
  /** Vega-lite Visualization. */
  vega_visualization?: VegaVisualization
  /** Stats. */
  stats?: Stats
  /** Inline components. */
  inline?: Inline
  /** Image */
  image?: Image
  /** Persona. */
  persona?: Persona
  /** Text annotator. */
  text_annotator?: TextAnnotator
  /** Image annotator. */
  image_annotator?: ImageAnnotator
  /** Audio annotator. */
  audio_annotator?: AudioAnnotator
  /** Facepile. */
  facepile?: Facepile
  /** Copyable text. */
  copyable_text?: CopyableText
  /** Menu. */
  menu?: Menu
  /** Tags. */
  tags?: Tags
  /** Time picker. */
  time_picker?: TimePicker
}

/** Create an inline (horizontal) list of components. */
interface Inline {
  /** The components laid out inline. */
  items: Component[]
  /** Specifies how to lay out the individual components. Defaults to 'start'. */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  /** Specifies how the individual components are aligned on the vertical axis. Defaults to 'center'. */
  align?: 'start' | 'end' | 'center' | 'baseline'
  /** Whether to display the components inset from the parent form, with a contrasting background. */
  inset?: B
  /** Height of the inline container. Accepts any valid CSS unit e.g. '100vh', '300px'. Use '1' to fill the remaining card space. */
  height?: S
  /** Container direction. Defaults to 'row'. */
  direction?: 'row' | 'column'
}

/** Create a form. */
interface State {
  /** The components in this form. */
  items: Packed<Component[]>
  /** The title for this card. */
  title?: S
}

const
  defaults: Partial<State> = { items: [] },
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
    },
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      $nest: {
        '> [data-visible="true"] ~ div': {
          marginTop: 10
        },
      }
    },
    horizontal: {
      display: 'flex',
      alignItems: 'center',
      $nest: {
        '> [data-visible="true"] ~ div': {
          marginLeft: 8
        }
      }
    },
    inset: {
      background: cssVar('$page'),
      padding: padding(10, 15)
    },
    fullHeight: {
      display: 'flex',
      flexGrow: 1
    }
  })

type Justification = 'start' | 'end' | 'center' | 'between' | 'around'
type Alignment = 'start' | 'end' | 'center' | 'baseline'
type XComponentsProps = {
  items: Component[]
  justify?: Justification
  align?: Alignment
  inset?: B
  height?: S
  direction?: 'row' | 'column'
  isInline?: B
}

export const
  XComponents = ({ items, justify, align, inset, height, direction = 'column', isInline = false }: XComponentsProps) => {
    const
      components = items.map((m: any, i) => {
        const
          // All form items are wrapped by their component name (first and only prop of "m").
          [componentKey] = Object.keys(m),
          { name, visible = true, width = 'auto', height } = m[componentKey],
          visibleStyles: React.CSSProperties = visible ? {} : { display: 'none' },
          // TODO: Ugly, maybe use ui.inline's 'align' prop instead?
          alignSelf = componentKey === 'links' ? 'flex-start' : undefined,
          // Components within inline, with no explicit width, and no explicit alignment in main direction should grow to fill the available space.
          shouldParentGrow = isInline && width === 'auto' && !justify

        return (
          <div
            // Recreate only if name or position within form items changed, update otherwise.
            key={name || `${componentKey}-${i}`}
            data-visible={visible}
            className={height === '1' ? css.fullHeight : ''}
            style={{ ...visibleStyles, width, minWidth: width, alignSelf, flexGrow: shouldParentGrow ? 1 : undefined }}
          >
            <XComponent model={m} />
          </div>
        )
      })

    return (
      <div
        className={clas(direction === 'row' ? css.horizontal : css.vertical, inset ? css.inset : '', height === '1' ? css.fullHeight : '')}
        style={{
          justifyContent: justifications[justify || ''],
          alignItems: alignments[align || ''],
          height: height === '1' ? undefined : height,
        }}
      >{components}</div>
    )
  },
  XInline = ({ model: m }: { model: Inline }) => (
    <XComponents
      items={m.items}
      justify={m.justify}
      align={m.align || (m.direction === 'row' ? 'center' : undefined)}
      inset={m.inset}
      height={m.height}
      direction={m.direction || 'row'}
      isInline
    />
  )


const
  XComponent = ({ model: m }: { model: Component }) => {
    if (m.text) return <XToolTip content={m.text.tooltip} expand={false}><XText name={m.text.name} content={m.text.content} size={m.text.size} /></XToolTip>
    if (m.text_xl) return <XToolTip content={m.text_xl.tooltip} expand={false}><XText name={m.text_xl.name} content={m.text_xl.content} size='xl' commands={m.text_xl.commands} /></XToolTip>
    if (m.text_l) return <XToolTip content={m.text_l.tooltip} expand={false}><XText name={m.text_l.name} content={m.text_l.content} size='l' commands={m.text_l.commands} /></XToolTip>
    if (m.text_m) return <XToolTip content={m.text_m.tooltip} expand={false}><XText name={m.text_m.name} content={m.text_m.content} /></XToolTip>
    if (m.text_s) return <XToolTip content={m.text_s.tooltip} expand={false}><XText name={m.text_s.name} content={m.text_s.content} size='s' /></XToolTip>
    if (m.text_xs) return <XToolTip content={m.text_xs.tooltip} expand={false}><XText name={m.text_xs.name} content={m.text_xs.content} size='xs' /></XToolTip>
    if (m.label) return <XToolTip content={m.label.tooltip} expand={false}><XLabel model={m.label} /></XToolTip>
    if (m.link) return <XToolTip content={m.link.tooltip} expand={false}><XLink model={m.link} /></XToolTip>
    if (m.links) return <XLinks model={m.links} />
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
    if (m.spinbox) return <XToolTip content={m.spinbox.tooltip}><XSpinbox model={m.spinbox} /></XToolTip>
    if (m.date_picker) return <XToolTip content={m.date_picker.tooltip}><XDatePicker model={m.date_picker} /></XToolTip>
    if (m.color_picker) return <XToolTip content={m.color_picker.tooltip}><XColorPicker model={m.color_picker} /></XToolTip>
    if (m.file_upload) return <XToolTip content={m.file_upload.tooltip}><XFileUpload model={m.file_upload} /></XToolTip>
    if (m.table) return <XToolTip content={m.table.tooltip}><XTable model={m.table} /></XToolTip>
    if (m.buttons) return <XButtons model={m.buttons} />
    if (m.tabs) return <XTabs model={m.tabs} />
    if (m.button) return <XToolTip content={m.button.tooltip} showIcon={false} expand={false}><XStandAloneButton model={m.button} /></XToolTip>
    if (m.expander) return <XExpander model={{ ...m.expander }} /> //HACK: Force new props reference on every update.
    if (m.frame) return <XFrame model={m.frame} />
    if (m.markup) return <XMarkup model={m.markup} />
    if (m.template) return <XTemplate model={m.template} />
    if (m.picker) return <XToolTip content={m.picker.tooltip}><XPicker model={m.picker} /></XToolTip>
    if (m.range_slider) return <XToolTip content={m.range_slider.tooltip}><XRangeSlider model={m.range_slider} /></XToolTip>
    if (m.stepper) return <XToolTip content={m.stepper.tooltip}><XStepper model={m.stepper} /></XToolTip>
    if (m.visualization) return <XVisualization model={m.visualization} />
    if (m.vega_visualization) return <XVegaVisualization model={m.vega_visualization} />
    if (m.stats) return <XStats model={m.stats} />
    if (m.inline) return <XInline model={m.inline} />
    if (m.image) return <XImage model={m.image} />
    if (m.persona) return <XPersona model={m.persona} />
    if (m.text_annotator) return <XTextAnnotator model={m.text_annotator} />
    if (m.image_annotator) return <XImageAnnotator model={m.image_annotator} />
    if (m.audio_annotator) return <XAudioAnnotator model={m.audio_annotator} />
    if (m.mini_button) return <XMiniButton model={m.mini_button} />
    if (m.mini_buttons) return <XMiniButtons model={m.mini_buttons} />
    if (m.facepile) return <XFacepile model={m.facepile} />
    if (m.copyable_text) return <XCopyableText model={m.copyable_text} />
    if (m.menu) return <XMenu model={m.menu} />
    if (m.tags) return <XTags model={m.tags} />
    if (m.time_picker) return <XTimePicker model={m.time_picker} />
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  }

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const
          s = { ...defaults, ...state },
          title = s.title,
          items = unpack<Component[]>(s.items) // XXX ugly

        return (
          <div data-test={name} className={css.card}>
            {title && <div className='wave-s12 wave-w6'>{title}</div>}
            <XComponents items={items} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('form', View)