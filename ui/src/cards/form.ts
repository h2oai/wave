import { B, F, Rec, S } from "../telesync";
import { Section } from './notebook';

export interface Text {
  size: S
  text: S
  tooltip: S
}

export interface Separator {
  label: S
}

export interface Label {
  label: S
  required: B
  disabled: B
  tooltip: S
}

export interface Progress {
  label: S
  caption: S
  value: F
  tooltip: S
}

export interface MessageBar {
  type: S
  text: S
}

export interface Textbox {
  name: S
  label: S
  placeholder: S
  mask: S
  icon: S
  prefix: S
  suffix: S
  value: S
  error: S
  required: B
  disabled: B
  readonly: B
  multiline: B
  password: B
  tooltip: S
}

export interface Checkbox {
  name: S
  label: S
  value: B
  indeterminate: B
  disabled: B
  trigger: B
  tooltip: S
}

export interface Toggle {
  name: S
  label: S
  value: B
  disabled: B
  trigger: B
  tooltip: S
}

export interface Choice {
  name: S
  label: S
  disabled: B
}

export interface ChoiceGroup {
  name: S
  label: S
  value: S
  choices: Choice[]
  required: B
  trigger: B
  tooltip: S
}

export interface Checklist {
  name: S
  label: S
  values: S[]
  choices: Choice[]
  tooltip: S
}

export interface Dropdown {
  name: S
  label: S
  placeholder: S
  multiple: B
  value: S
  values: S[]
  choices: Choice[]
  required: B
  disabled: B
  trigger: B
  tooltip: S
}

export interface Combobox {
  name: S
  label: S
  placeholder: S
  value: S
  choices: S[]
  error: S
  disabled: B
  tooltip: S
}

export interface Slider {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  trigger: B
  tooltip: S
}

export interface Spinbox {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  tooltip: S
}

export interface DatePicker {
  name: S
  label: S
  placeholder: S
  value: S
  disabled: B
  tooltip: S
}

export interface ColorPicker {
  name: S
  label: S
  value: S
  choices: S[]
  tooltip: S
}

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

export interface FileUpload {
  name: S
  label: S
  multiple: B
  tooltip: S
}

export interface TableColumn {
  name: S
  label: S
}

export interface TableRow {
  name: S
  cells: S[]
}

export interface Table {
  name: S
  columns: TableColumn[]
  rows: TableRow[]
  multiple: B
  tooltip: S
}

export interface Link {
  label: S
  path: S
  disabled: B
  button: B
  tooltip: S
}

export interface Tab {
  name: S
  label: S
  icon: S
}

export interface Tabs {
  name: S
  value: S
  items: Tab[]
}

export interface Expander {
  name: S
  label: S
  expanded: B
  items: Component[]
}

export interface Component {
  text?: Text
  label?: Label
  separator?: Separator
  progress?: Progress
  message_bar?: MessageBar
  textbox?: Textbox
  checkbox?: Checkbox
  toggle?: Toggle
  choice_group?: ChoiceGroup
  checklist?: Checklist
  dropdown?: Dropdown
  combobox?: Combobox
  slider?: Slider
  spinbox?: Spinbox
  date_picker?: DatePicker
  color_picker?: ColorPicker
  buttons?: Buttons
  file_upload?: FileUpload
  table?: Table
  link?: Link
  tabs?: Tabs
  button?: Button
  expander?: Expander
  section?: Section
}

export interface State {
  url: S
  method: S
  args: Rec
  items: Component[]
}
