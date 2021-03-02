import { B, box, S, U } from "./qd"

export type CardAttr = {
  name: S
  optional: B
} & ({
  t: 'box'
  value: S // JSON-stringified FlexBox
} | {
  t: 'textbox'
  value: S
} | {
  t: 'textarea'
  value: S
} | {
  t: 'spinbox'
  value: U
  min: U
  max: U
  step: U
} | {
  t: 'record'
  value: any
})

export type CardDef = {
  icon: S
  view: S
  attrs: CardAttr[]
}

export enum EditorActionT { None, Pick, Add, Edit }
export type NoAction = { t: EditorActionT.None }
export type PickCard = { t: EditorActionT.Pick }
export type AddCard = { t: EditorActionT.Add, view: S }
export type EditCard = { t: EditorActionT.Edit, name: S }
export type EditorAction = NoAction | PickCard | AddCard | EditCard
export const
  noAction: EditorAction = { t: EditorActionT.None },
  pickCard: EditorAction = { t: EditorActionT.Pick },
  editorActionB = box<EditorAction>(noAction),
  editCard = (name: S) => {
    editorActionB({ t: EditorActionT.Edit, name })
  }