import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { B, box, Id, Rec, S, U, wave } from 'h2o-wave'
import { clas, cssVar, margin, getContrast, padding } from './theme'
import { bond } from './ui'

/** Create a tag. */
interface AnnotatorTag {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed for this tag. */
  label: S
  /** HEX or RGB color string used as background for highlighted phrases. */
  color: S
}

/** Create an annotator item with initial selected tags or no tag for plaintext. */
interface AnnotatorItem {
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
export interface Annotator {
  /** An identifying name for this component. */
  name: Id
  /** List of tags the user can annotate with. */
  tags: AnnotatorTag[]
  /** Pretagged parts of text content. */
  items: AnnotatorItem[]
  /** True if the form should be submitted when the annotator value changes. */
  trigger?: B
}

const css = stylesheet({
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: margin(0, -4),
    marginTop: 5
  },
  tag: {
    padding: 7,
    margin: 4,
    minWidth: 60,
    textAlign: 'center',
    borderRadius: 2,
    cursor: 'pointer',
    opacity: 0.5
  },
  activeTag: {
    opacity: 1
  },
  mark: {
    position: 'relative',
    padding: padding(5, 0),
  },
  firstMark: {
    paddingLeft: 5,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2
  },
  lastMark: {
    paddingRight: 5,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  content: {
    margin: margin(10, 0),
    lineHeight: 2
  },
  removeIcon: {
    cursor: 'pointer',
    position: 'absolute',
    left: -8,
    top: -7,
    transform: 'rotate(45deg)', //HACK: Fluent doesn't provide rounded X icon so rotate the "+" one.
    fontSize: 18,
    fontWeight: 100,
    lineHeight: 'initial',
    color: cssVar('$text'),
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

export const
  XAnnotator = bond(({ model }: { model: Annotator }) => {
    wave.args[model.name] = model.items as unknown as Rec[]
    const
      startIdxB = box<U | null>(null),
      activeTagB = box<S | undefined>(),
      hoveredTagIdxB = box<U | null>(),
      tagColorMap = model.tags.reduce((map, t) => {
        map.set(t.name, t.color)
        return map
      }, new Map<S, S>()),
      tokensB = box(model.items.reduce((arr, { text, tag }) => {
        // Split by any non-letter character.
        text.split(/(?=[^A-Za-z])/g).forEach(textItem => arr.push({ text: textItem, tag }))
        return arr
      }, [] as AnnotatorItem[])),
      submitQdArgs = () => {
        let currentText = ''
        let currentTag: S | undefined
        wave.args[model.name] = tokensB().reduce((arr, { text, tag }, idx, tokens) => {
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
        }, [] as AnnotatorItem[]) as unknown as Rec[]
        if (model.trigger) wave.sync()
      },
      activateTag = (tagName: S) => () => activeTagB(tagName),
      removeAnnotation = (idx: U) => (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        ev.stopPropagation() // Stop event bubbling so that annotate is not called.
        const tokens = tokensB()
        const tagToRemove = tokens[idx].tag
        for (let i = idx; tokens[i]?.tag === tagToRemove; i++) tokens[i].tag = undefined
        tokensB([...tokens])
        submitQdArgs()
      },
      setStartIdx = (startIdx: U) => () => startIdxB(startIdx),
      annotate = (end: U) => () => {
        const start = startIdxB()
        if (start === null) return

        const max = Math.max(start, end)
        for (let i = Math.min(start, end); i <= max; i++) tokensB()[i].tag = activeTagB()

        submitQdArgs()
        startIdxB(null)
        window.getSelection()?.removeAllRanges()
      },
      onMarkHover = (idx: U) => () => hoveredTagIdxB(idx),
      onMarkMouseOut = () => hoveredTagIdxB(null),
      shouldShowRemoveIcon = (idx: U, tag: S) => {
        const tokens = tokensB()
        const hoveredTagIdx = hoveredTagIdxB()
        if (hoveredTagIdx === null) return false
        // Check if same tag as hovered and first mark of an annotation.
        if (tokens[hoveredTagIdx]?.tag !== tag || tokens[idx - 1]?.tag === tag) return false
        // Check if annotation consists of a single tag.
        if (idx === hoveredTagIdx) return true
        for (let i = idx; tokens[i]?.tag === tag; i++) if (i === hoveredTagIdx) return true

        return false
      },
      getMark = (text: S, idx: U, tag: S) => {
        const
          color = tagColorMap.get(tag)!,
          removeIconStyle = { visibility: shouldShowRemoveIcon(idx, tag) ? 'visible' : 'hidden' },
          isFirst = tokensB()[idx - 1]?.tag !== tag,
          isLast = tokensB()[idx + 1]?.tag !== tag
        return (
          <mark
            onMouseOver={onMarkHover(idx)}
            onMouseOut={onMarkMouseOut}
            className={clas('wave-w5', css.mark, isFirst ? css.firstMark : isLast ? css.lastMark : '')}
            style={{ backgroundColor: cssVar(color), color: getContrast(color) }}>
            {text}
            <Fluent.Icon iconName='CircleAdditionSolid' styles={{ root: removeIconStyle }} className={clas(css.removeIcon, 'wave-w6')} onMouseUp={removeAnnotation(idx)} />
            {/* HACK: Put color underlay under remove icon because its glyph is transparent and doesn't look good on tags. */}
            <span style={removeIconStyle as React.CSSProperties} className={css.iconUnderlay}></span>
          </mark>
        )
      },
      render = () => {
        const tags = model.tags.map(({ name, color, label }) => (
          <div
            key={name}
            className={clas(css.tag, activeTagB() === name ? css.activeTag : '', 'wave-s16 wave-w5')}
            onClick={activateTag(name)}
            style={{ background: cssVar(color), color: getContrast(color) }}
          >{label}</div>
        ))
        return (
          <div data-test={model.name}>
            <div className='wave-s20 wave-w5 wave-t9'>Select Tag to highlight text</div>
            <div className={css.tags}>{tags}</div>
            <Fluent.Separator />
            <div className={clas(css.content, 'wave-s18 wave-t9 wave-w3')}>{
              tokensB().map(({ text, tag }, idx) => (
                <span key={idx} onMouseDown={setStartIdx(idx)} onMouseUp={annotate(idx)}>{tag ? getMark(text, idx, tag) : text}</span>
              ))
            }
            </div>
            <Fluent.Separator />
          </div>
        )
      }

    return { render, startIdxB, tokensB, activeTagB, hoveredTagIdxB }
  })