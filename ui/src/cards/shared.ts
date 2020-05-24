// Types in this files ("shared.ts") are special-cased in telegen 
// and are not prefixed with the filename when exported.

import { S, U } from "../telesync";

// TODO These are for backward compatibility, and need to be dealt with.

// --- Begin backward compatibility ---

export interface DataSource {
    t: 'Table' | 'View'
    id: U
}

export interface Query {
    sql: S
    sources: DataSource[]
}

export interface HeadingCell {
    level: U
    content: S
}

export interface MarkdownCell {
    content: S
}

export interface FrameCell {
    source: S
    width: S
    height: S
}

export interface DataCell {
    content: S
}

export interface VegaCell {
    specification: S
    query: Query
}

export interface Cell {
    heading?: HeadingCell
    markdown?: MarkdownCell
    frame?: FrameCell
    data?: DataCell
    vega?: VegaCell
}

export interface Command {
    action: S
    icon: S
    label: S
    caption: S
    data: S
}

// --- End backward compatibility ---
