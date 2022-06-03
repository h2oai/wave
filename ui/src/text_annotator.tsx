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
  /** The `name` of the text annotator tag to refer to for the `label` and `color` of this item. */
  tag?: S
}

/**
 * Create a text annotator component.
 * 
 * The text annotator component enables user to manually annotate parts of text. Useful for NLP data prep.
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
  /** True to prevent user interaction with the annotator component. Defaults to False. */
  readonly?: B
  /** If enabled it automatically selects the whole word when clicking on it. Defaults to True. */
  smart_selection?: B
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
  },
  tagWrapper: {
    marginRight: 4,
    marginBottom: 4,
    border: border(2, cssVar('$card')),
    padding: 1,
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
    background: cssVar('$card'),
  },
  readonly: { pointerEvents: 'none' }
})

export
  const AnnotatorTags = ({ tags, activateTag, activeTag }: { tags: TextAnnotatorTag[], activateTag: (name: S) => () => void, activeTag?: S }) => (
    <div className={css.tags}>
      {
        tags.map(({ name, color, label }) => {
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
      }
    </div>
  ),
  XTextAnnotator = ({ model: { name, title, tags, items, trigger, readonly, smart_selection = true } }: { model: TextAnnotator }) => {
    const
      [activeTag, setActiveTag] = React.useState<S | undefined>(readonly ? undefined : tags[0]?.name),
      [hoveredTagIdx, setHoveredTagIdx] = React.useState<U | null>(),
      tagColorMap = tags.reduce((map, t) => {
        map.set(t.name, t.color)
        return map
      }, new Map<S, S>()),
      [tokens, setTokens] = React.useState(items.reduce((arr, { text, tag }) => {
        // If the smart_selection is True, split by any non-letter character.
        text.split(smart_selection ? /(?=[^a-z0-9])/ig : "").forEach((textItem) => {
          const
            start = arr.length === 0 ? 0 : arr[arr.length - 1].end + 1,
            end = arr.length === 0 ? textItem.length - 1 : arr[arr.length - 1].end + textItem.length
          if (/[^a-z]/i.test(textItem)) {
            arr.push({ text: textItem.substring(0, 1), tag, start, end: start })
            if (textItem.substring(1) !== '') arr.push({ text: textItem.substring(1), tag, start: start + 1, end: end + 1 })
          } else {
            arr.push({ text: textItem, tag, start, end })
          }
        })
        return arr
      }, [] as (TextAnnotatorItem & { start: number, end: number })[])),
      submitWaveArgs = () => {
        let currentText = ''
        let currentTag: S | undefined
        wave.args[name] = tokens.reduce((arr, { text, tag }, idx, tokens) => {
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
        if (trigger) wave.push()
      },
      activateTag = (tagName: S) => () => setActiveTag(tagName),
      removeAnnotation = (idx: U) => (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        ev.stopPropagation() // Stop event bubbling so that annotate is not called.
        const tagToRemove = tokens[idx].tag
        for (let i = idx; tokens[i]?.tag === tagToRemove; i++) tokens[i].tag = undefined
        setTokens([...tokens])
        submitWaveArgs()
      },
      timeoutRef = React.useRef<NodeJS.Timeout | null>(null),
      mouseDownTimeRef = React.useRef<number>(0),
      annotate = (target?: EventTarget & HTMLSpanElement) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        const
          selectedText = window.getSelection(),
          startElData = selectedText?.anchorNode?.parentElement?.dataset,
          endElData = selectedText?.focusNode?.parentElement?.dataset

        if (!startElData || !endElData) return

        const
          selectedTextStr = selectedText.toString(),
          startTokenIdx = parseInt(smart_selection ? startElData!.key! : startElData!.start!),
          endTokenIdx = target ? (startTokenIdx + selectedTextStr.length) : parseInt(smart_selection ? endElData!.key! : endElData!.end!),
          max = Math.max(startTokenIdx, endTokenIdx),
          min = Math.min(startTokenIdx, endTokenIdx)

        if (target && selectedTextStr.length) {
          // smart selection on double click
          const targetDataIdx = parseInt(target.dataset.key!)
          let strLength = 0 // number of characters right to the selection target; if not 0, we loop to the left direction
          for (let i = 0; i <= selectedTextStr.length; i++) {
            const tokenIdx = targetDataIdx + (!strLength ? i : (strLength - i))
            tokens[tokenIdx].tag = activeTag
            if (/[^a-z0-9]/i.test(tokens[tokenIdx + (!strLength ? 1 : -1)]?.text)) {
              strLength = i + 1
            }
          }
        } else {
          // selection by dragging or clicking
          for (let i = min; i <= max; i++) {
            // HACK: Ignore accompanying spaces selected by double clicking in Firefox
            // HACK: Ignore characters returned by Firefox when user hovers over the part of the prev/next character
            if (!smart_selection && max - min + 1 !== selectedTextStr.length) {
              if (i === min && selectedTextStr.charAt(0) !== tokens[i].text) continue
              if (i === max && selectedTextStr.charAt(selectedTextStr.length - 1) !== tokens[i].text) continue
            }
            tokens[i].tag = activeTag
          }
        }

        setTokens([...tokens])
        submitWaveArgs()
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
      handleOnMouseUp = (ev: React.MouseEvent<HTMLSpanElement>) => {
        if (smart_selection) annotate()
        else if (timeoutRef.current) annotate(ev.currentTarget) // double-click
        else if (new Date().getTime() - mouseDownTimeRef.current > 250) annotate() // dragging (long click)
        else timeoutRef.current = setTimeout(() => annotate(), 250) // click
      },
      Token = ({ idx, tokenProps: { start, end, tag, text } }: { idx: number, tokenProps: TextAnnotatorItem & { start: number, end: number } }) =>
        <span
          data-key={idx}
          data-start={start}
          data-end={end}
          onMouseDown={() => { mouseDownTimeRef.current = new Date().getTime() }}
          onMouseUp={handleOnMouseUp}
          onMouseLeave={(ev: React.MouseEvent<HTMLSpanElement>) => {
            if ((ev.relatedTarget as any)?.nodeName !== 'SPAN') handleOnMouseUp(ev) // nodeName prop is not typed yet
          }}
        >
          {tag ? getMark(text, idx, tag) : text}
        </span>


    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[name] = items as unknown as Rec[] }, [])


    return (
      <div data-test={name} className={readonly ? css.readonly : ''}>
        <div className={clas('wave-s16 wave-w6', css.title)}>{title}</div>
        <AnnotatorTags tags={tags} activateTag={activateTag} activeTag={activeTag} />
        <div className={clas(css.content, 'wave-s16 wave-t7 wave-w3')}
        >{
            tokens.reduce((acc, token, idx) => {
              if (smart_selection || token.text === " ") acc.push(<Token key={idx} idx={idx} tokenProps={token} />)
              else if (!idx || tokens[idx - 1].text === " ") {
                const word = []
                for (let i = idx; i < tokens.length; i++) {
                  word.push(<Token key={i} idx={i} tokenProps={tokens[i]} />)
                  if (tokens[i].text === " " || i === tokens.length - 1) {
                    // placing word broken into characters into span with display: 'inline-block' prevents it from wrapping in the EOL
                    acc.push(<span key={`w${i}`} style={{ display: 'inline-block' }}>{word}</span>)
                    break
                  }
                }
              }
              return acc
            }, [] as React.ReactElement[])
          }
        </div>
      </div>
    )
  }