import * as Fluent from '@fluentui/react'
import { B, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { border, clas, cssVar, getContrast, margin, padding } from './theme'
import { wave } from './ui'

/** Create a tag. */
interface TextAnnotatorTag {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed for this tag. */
  label: S
  /** HEX or RGB color string used as background for highlighted phrases. */
  color: S
}

/** Create an annotator item with initial selected tags or no tag for plaintext. */
interface TextAnnotatorItem {
  /** Text to be highlighted. */
  text: S
  /** Tag connected to the highlighted text. */
  tag?: S
}

/**
 * Create an annotator component.
 * 
 * The annotator component enables user to manually annotate parts of text. Useful for NLP data prep.
 */
export interface TextAnnotator {
  /** An identifying name for this component. */
  name: Id
  /** The text annotator's title. */
  title: S
  /** List of tags the user can annotate with. */
  tags: TextAnnotatorTag[]
  /** Pretagged parts of text content. */
  items: TextAnnotatorItem[]
  /** True if the form should be submitted when the annotator value changes. */
  trigger?: B
}

const css = stylesheet({
  title: {
    color: cssVar('$neutralPrimary'),
    marginBottom: 8
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 1
  },
  tag: {
    padding: padding(4, 16),
    textAlign: 'center',
    borderRadius: 4,
    cursor: 'pointer',
  },
  tagWrapper: {
    marginRight: 4,
    marginBottom: 4,
    border: border(2, cssVar('$card')),
    padding: 1
  },
  mark: {
    position: 'relative',
    padding: padding(2, 0),
  },
  firstMark: {
    paddingLeft: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },
  lastMark: {
    paddingRight: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  content: {
    margin: margin(12, 0),
    paddingTop: 2
  },
  removeIcon: {
    cursor: 'pointer',
    position: 'absolute',
    left: -8,
    top: -7,
    transform: 'rotate(45deg)', //HACK: Fluent doesn't provide rounded X icon so rotate the "+" one.
    fontSize: 16,
    fontWeight: 100,
    lineHeight: 'initial',
    color: cssVar('$neutralPrimary'),
    zIndex: 1
  },
  iconUnderlay: {
    width: 10,
    height: 10,
    position: 'absolute',
    left: -5,
    top: -3,
    background: cssVar('$card')
  }
})

export const XTextAnnotator = ({ model }: { model: TextAnnotator }) => {
  const
    [startIdx, setStartIdx] = React.useState<U | null>(null),
    [activeTag, setActiveTag] = React.useState<S | undefined>(model.tags[0]?.name),
    [hoveredTagIdx, setHoveredTagIdx] = React.useState<U | null>(),
    tagColorMap = model.tags.reduce((map, t) => {
      map.set(t.name, t.color)
      return map
    }, new Map<S, S>()),
    [tokens, setTokens] = React.useState(model.items.reduce((arr, { text, tag }) => {
      // Split by any non-letter character.
      text.split(/(?=[^A-Za-z])/g).forEach(textItem => {
        if (textItem.startsWith(' ')) {
          arr.push({ text: ' ', tag })
          arr.push({ text: textItem.substring(1), tag })
        } else {
          arr.push({ text: textItem, tag })
        }
      })
      return arr
    }, [] as TextAnnotatorItem[])),
    submitWaveArgs = () => {
      let currentText = ''
      let currentTag: S | undefined
      wave.args[model.name] = tokens.reduce((arr, { text, tag }, idx, tokens) => {
        if (idx === tokens.length - 1) {
          if (tag !== currentTag) {
            arr.push({ text: currentText, tag: currentTag })
            arr.push({ text, tag })
          }
          else {
            arr.push({ text: currentText + text, tag })
          }
        }
        else if (idx !== 0 && tag !== currentTag) {
          arr.push({ text: currentText, tag: currentTag })
          currentText = text
        } else {
          currentText += text
        }
        currentTag = tag
        return arr
      }, [] as TextAnnotatorItem[]) as unknown as Rec[]
      if (model.trigger) wave.push()
    },
    activateTag = (tagName: S) => () => setActiveTag(tagName),
    removeAnnotation = (idx: U) => (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      ev.stopPropagation() // Stop event bubbling so that annotate is not called.
      const tagToRemove = tokens[idx].tag
      for (let i = idx; tokens[i]?.tag === tagToRemove; i++) tokens[i].tag = undefined
      setTokens([...tokens])
      submitWaveArgs()
    },
    updateStartIdx = (startIdx: U) => () => setStartIdx(startIdx),
    annotate = (end: U) => () => {
      const start = startIdx
      if (start === null) return

      const max = Math.max(start, end)
      for (let i = Math.min(start, end); i <= max; i++) tokens[i].tag = activeTag

      submitWaveArgs()
      setStartIdx(null)
      window.getSelection()?.removeAllRanges()
    },
    onMarkHover = (idx: U) => () => setHoveredTagIdx(idx),
    onMarkMouseOut = () => setHoveredTagIdx(null),
    shouldShowRemoveIcon = (idx: U, tag: S) => {
      if (hoveredTagIdx === null) return false
      // Check if same tag as hovered and first mark of an annotation.
      if (tokens[hoveredTagIdx!]?.tag !== tag || tokens[idx - 1]?.tag === tag) return false
      // Check if annotation consists of a single tag.
      if (idx === hoveredTagIdx) return true
      for (let i = idx; tokens[i]?.tag === tag; i++) if (i === hoveredTagIdx) return true

      return false
    },
    getMark = (text: S, idx: U, tag: S) => {
      const
        color = tagColorMap.get(tag)!,
        removeIconStyle = { visibility: shouldShowRemoveIcon(idx, tag) ? 'visible' : 'hidden' },
        isFirst = tokens[idx - 1]?.tag !== tag,
        isLast = tokens[idx + 1]?.tag !== tag
      return (
        <mark
          onMouseOver={onMarkHover(idx)}
          onMouseOut={onMarkMouseOut}
          className={clas(css.mark, isFirst ? css.firstMark : '', isLast ? css.lastMark : '')}
          style={{ backgroundColor: cssVar(color), color: getContrast(color) }}>
          {text}
          <Fluent.Icon iconName='CircleAdditionSolid' styles={{ root: removeIconStyle }} className={clas(css.removeIcon, 'wave-w6')} onMouseUp={removeAnnotation(idx)} />
          {/* HACK: Put color underlay under remove icon because its glyph is transparent and doesn't look good on tags. */}
          <span style={removeIconStyle as React.CSSProperties} className={css.iconUnderlay}></span>
        </mark>
      )
    },
    tags = model.tags.map(({ name, color, label }) => {
      const style = stylesheet({
        tag: {
          background: cssVar(color),
          color: getContrast(color),
        },
        activeTag: {
          border: border(2, cssVar('$themePrimary')),
          borderRadius: 6
        }
      })
      return (
        <div key={name} data-test={name} className={clas(css.tagWrapper, activeTag === name ? style.activeTag : '')}>
          <div className={clas(css.tag, style.tag, 'wave-s12')} onClick={activateTag(name)}>{label}</div>
        </div>
      )
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { wave.args[model.name] = model.items as unknown as Rec[] }, [])

  return (
    <div data-test={model.name}>
      <div className={clas('wave-s16 wave-w6', css.title)}>{model.title}</div>
      <div className={css.tags}>{tags}</div>
      <div className={clas(css.content, 'wave-s16 wave-t7 wave-w3')}>{
        tokens.map(({ text, tag }, idx) => (
          <span key={idx} onMouseDown={updateStartIdx(idx)} onMouseUp={annotate(idx)}>{tag ? getMark(text, idx, tag) : text}</span>
        ))
      }
      </div>
    </div>
  )
}