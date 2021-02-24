import { B, box, S, U } from "./qd"

export enum CardAttrT { String, Text, Integer, Record }

export type CardAttr = {
  name: S
  optional: B
} & ({
  t: CardAttrT.String
  value: S
} | {
  t: CardAttrT.Text
  value: S
} | {
  t: CardAttrT.Integer
  value: U
  min: U
  max: U
  step: U
} | {
  t: CardAttrT.Record
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