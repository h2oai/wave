import { U, S } from "h2o-wave"

const BASE = 0
const ABOVE = 1

const
    HEADER = ABOVE + BASE,
    TABLE_HEADER = ABOVE + BASE,
    TABLE_GROUPS_HEADER = ABOVE + TABLE_HEADER,
    DIALOG = ABOVE + TABLE_GROUPS_HEADER,
    TIME_PICKER = ABOVE + DIALOG,
    NOTIFICATION_BAR = ABOVE + TIME_PICKER

export const getZIndex = (zIndex: U, xid: S, idx?: S) => {
    const id = parseInt(xid.substring(1))
    const cardBase = id * 10
    console.log('ZINDEX', xid, id, cardBase, zIndex)
    // return cardBase + zIndex
    return idx ? parseInt(idx.substring(1)) * 10 : zIndex
}

export const Z_INDEX = {
    HEADER,
    TABLE_HEADER,
    TABLE_GROUPS_HEADER,
    DIALOG,
    TIME_PICKER,
    NOTIFICATION_BAR
}
