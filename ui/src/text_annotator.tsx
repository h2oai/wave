import * as Fluent from '@fluentui/react'
import { B, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet, style } from 'typestyle'
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

type TokenProps = TextAnnotatorItem & { start: U, end: U }
type TokenMouseEventProps = { key: U, start: U, end: U }

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
    cursor: 'pointer',
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
    paddingTop: 2,
    lineHeight: '26px'
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
const Token = ({ idx, tokenProps: { start, end, tag, text }, handleMouseDown, handleMouseUp, handleMouseLeave, getMark, activeColor }: { idx: U, tokenProps: TokenProps, handleMouseDown: any, handleMouseUp: any, handleMouseLeave: any, getMark: any, activeColor: S | undefined }) =>
  <p
    onMouseDown={tag ? undefined : handleMouseDown({ key: idx, start, end })}
    onMouseUp={tag ? undefined : handleMouseUp({ key: idx, start, end })}
    onMouseLeave={handleMouseLeave({ key: idx, start, end })}
    style={{ display: 'inline' }}
    className={activeColor ? style({ $nest: { '&::selection': { background: activeColor, color: getContrast(activeColor) } } }) : undefined}
  >
    {tag ? getMark(text, idx, tag) : text}
  </p >

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
      mouseDownRef = React.useRef<TokenMouseEventProps>(),
      mouseDownTimeRef = React.useRef(0),
      tagColorMap = new Map(tags.map(t => [t.name, t.color])),
      [tokens, setTokens] = React.useState(items.reduce((arr, { text, tag }) => {
        // If the smart_selection is True, split by any non-letter and non-number character.
        text.split(/(?=[^a-z0-9])/ig).forEach((textItem) => {
          const
            start = arr.length === 0 ? 0 : arr[arr.length - 1].end + 1,
            end = arr.length === 0 ? textItem.length - 1 : arr[arr.length - 1].end + textItem.length,
            word = textItem.split(/[^a-z]/i),
            hasNonWordChar = word.length === 2

          if (hasNonWordChar) arr.push({ text: textItem.substring(0, 1), tag, start, end: start })
          if (smart_selection) {
            arr.push({ text: word[hasNonWordChar ? 1 : 0], tag, start: start + (hasNonWordChar ? 1 : 0), end })
          } else {
            arr.push(...word[hasNonWordChar ? 1 : 0].split("").map((it: any) => { return { text: it, tag, start: start + (hasNonWordChar ? 1 : 0), end } }))
          }
        })
        return arr
      }, [] as (TokenProps)[])),
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
      annotate = (endElProps: TokenMouseEventProps, smartSelection?: B) => {
        // trim new line characters because Firefox does count them
        const selectedStr = window.getSelection()?.toString().replace(/\r?\n|\r/g, "")
        if (!mouseDownRef.current || !selectedStr) return
        const startElProps = mouseDownRef.current

        const
          max = smartSelection ? endElProps.end : Math.max(startElProps.key, endElProps.key),
          min = smartSelection ? endElProps.start : Math.min(startElProps.key, endElProps.key)

        if (smart_selection) { tokens[endElProps.key].tag = activeTag }
        else {
          for (let i = min; i <= max; i++) {
            // HACK: Ignore characters returned when user hovers over the part of the prev/next character
            if (!smart_selection && max - min + 1 !== selectedStr.length) {
              if (i === min && selectedStr.charAt(0) !== tokens[i].text) continue
              if (i === max && selectedStr.charAt(selectedStr.length - 1) !== tokens[i].text) continue
            }
            tokens[i].tag = activeTag
          }
        }

        setTokens([...tokens])
        submitWaveArgs()
        window.getSelection()?.removeAllRanges()
        mouseDownRef.current = undefined
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
      handleMouseDown = (startElProps: TokenMouseEventProps) => () => {
        mouseDownRef.current = startElProps
        mouseDownTimeRef.current = new Date().getTime()
      },
      handleMouseUp = (endElProps: TokenMouseEventProps) => (ev: React.MouseEvent<HTMLSpanElement>) => {
        if (smart_selection) annotate(endElProps, true)
        else if (ev.detail === 2) annotate(endElProps, true) // double-click
        else if (ev.detail === 1 && new Date().getTime() - mouseDownTimeRef.current > 200) annotate(endElProps) // dragging
      },
      handleMouseLeave = (endElProps: TokenMouseEventProps) => (ev: React.MouseEvent<HTMLSpanElement>) => {
        if (mouseDownRef.current !== undefined && (ev.relatedTarget as any)?.nodeName !== 'P') annotate(endElProps)
      },
      text = tokens.map((token, idx) => {
        return <Token
          key={idx}
          idx={idx}
          tokenProps={token}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseLeave={handleMouseLeave}
          getMark={getMark}
          activeColor={activeTag ? tagColorMap.get(activeTag)! : undefined}
        />
      }, [] as React.ReactElement[])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[name] = items as unknown as Rec[] }, [])


    return (
      <div data-test={name} className={readonly ? css.readonly : ''}>
        <div className={clas('wave-s16 wave-w6', css.title)}>{title}</div>
        <AnnotatorTags tags={tags} activateTag={activateTag} activeTag={activeTag} />
        <div className={clas(css.content, 'wave-s16 wave-t7 wave-w3')}>{text}</div>
      </div>
    )
  }