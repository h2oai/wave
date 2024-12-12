import * as Fluent from '@fluentui/react'
import { B, Id, Rec, S, U } from './core'
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
  /** An identifying name for this component. */
  name?: S
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
}

type TokenProps = TextAnnotatorItem & { start: U, end: U }
type TokenMouseEventProps = { key: U, start: U, end: U }
type AnnotatorTagsProps = {
  tags: TextAnnotatorTag[],
  activateTag: (name: S) => () => void,
  activeTag?: S
}

const
  css = stylesheet({
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
    readonly: { pointerEvents: 'none' },
    checkbox: {
      $nest: {
        '&:hover': {
          backgroundColor: cssVar('$neutralLighter'),
          color: cssVar('$neutralDark')
        }
      }
    }
  }),
  annotateNumbersAroundToken = (tokenIdx: U, tokens: TokenProps[], activeTag?: S) => {
    let charRightIdx = tokenIdx + 1, charLeftIdx = tokenIdx - 1
    while (charRightIdx <= tokens.length - 1 && !isNaN(+tokens[charRightIdx].text)) {
      tokens[charRightIdx].tag = activeTag
      charRightIdx++
    }
    while (charLeftIdx >= 0 && !isNaN(+tokens[charLeftIdx].text)) {
      tokens[charLeftIdx].tag = activeTag
      charLeftIdx--
    }
  }

export
  const AnnotatorTags = ({ tags, activateTag, activeTag }: AnnotatorTagsProps) => (
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
  XTextAnnotator = ({ model: { name, title, tags, items, trigger, readonly } }: { model: TextAnnotator }) => {
    const
      [activeTag, setActiveTag] = React.useState<S | undefined>(readonly ? undefined : tags[0]?.name),
      [hoveredTagIdx, setHoveredTagIdx] = React.useState<U | null>(),
      [smartSelection, setSmartSelection] = React.useState(true),
      startElPropsRef = React.useRef<TokenMouseEventProps>(),
      tagColorMap = new Map(tags.map(t => [t.name, t.color])),
      [tokens, setTokens] = React.useState(items.reduce((tokenArr, { text, tag }) => {
        // Split by any non-letter.
        text.split(/([^a-z])/ig).filter(word => word !== '').forEach(textItem => {
          const
            start = tokenArr.length === 0 ? 0 : tokenArr[tokenArr.length - 1].end + 1,
            end = tokenArr.length === 0 ? textItem.length - 1 : tokenArr[tokenArr.length - 1].end + textItem.length

          tokenArr.push(...textItem.split('').map(char => ({ text: char, tag, start, end })))
        })
        return tokenArr
      }, [] as TokenProps[])),
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
        startElPropsRef.current = undefined
        setTokens([...tokens])
        submitWaveArgs()
      },
      removeAllAnnotations = () => {
        tokens.forEach(token => token.tag = undefined)
        setTokens([...tokens])
        submitWaveArgs()
      },
      annotate = (endElProps: TokenMouseEventProps) => {
        if (!startElPropsRef.current) return
        const
          startElProps = startElPropsRef.current,
          max = smartSelection ? Math.max(startElProps.end, endElProps.end) : Math.max(startElProps.key, endElProps.key),
          min = smartSelection ? Math.min(startElProps.start, endElProps.start) : Math.min(startElProps.key, endElProps.key),
          // Remove new line characters because Firefox does count them.
          selectedStr = window.getSelection()?.toString().replace(/\r?\n|\r/g, "")

        for (let i = min; i <= max; i++) {
          // Ignore characters returned when user hovers over the part of the prev/next character.
          if (!smartSelection && selectedStr && max - min + 1 !== selectedStr.length) {
            // Check whether the first character highlighted by the browser corresponds with the character returned by the mouse event.
            if (i === min && selectedStr.charAt(0) !== tokens[i].text) continue
            // Check whether the last character highlighted by the browser corresponds with the character returned by the mouse event.
            if (i === max && selectedStr.charAt(selectedStr.length - 1) !== tokens[i].text) continue
          }
          tokens[i].tag = activeTag
        }

        if (smartSelection) {
          if (!isNaN(+tokens[startElProps.key].text)) {
            annotateNumbersAroundToken(startElProps.key, tokens, activeTag)
          }
          if (startElProps.key !== endElProps.key && !isNaN(+tokens[endElProps.key].text)) {
            annotateNumbersAroundToken(endElProps.key, tokens, activeTag)
          }
        }

        setTokens([...tokens])
        submitWaveArgs()
        window.getSelection()?.removeAllRanges()
        startElPropsRef.current = undefined
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
        const color = tagColorMap.get(tag)
        // Handle invalid tags entered by user.
        if (!color) return text
        const
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
            <Fluent.Icon iconName='CircleAdditionSolid' data-test='remove-icon' styles={{ root: removeIconStyle }} className={clas(css.removeIcon, 'wave-w6')} onMouseUp={removeAnnotation(idx)} />
            {/* HACK: Put color underlay under remove icon because its glyph is transparent and doesn't look good on tags. */}
            <span style={removeIconStyle as React.CSSProperties} className={css.iconUnderlay}></span>
          </mark>
        )
      },
      handleMouseDown = (startElProps: TokenMouseEventProps) => () => startElPropsRef.current = startElProps,
      handleMouseUp = (endElProps: TokenMouseEventProps) => () => annotate(endElProps),
      // handles the selection in case mouse up event is fired when cursor is not above text
      handleSelectionFinish = (ev: React.MouseEvent<HTMLSpanElement>) => {
        const nodeName = (ev.relatedTarget as any)?.nodeName // nodeName prop is not typed yet
        if (startElPropsRef.current !== undefined && nodeName !== 'P' && nodeName !== 'MARK') {
          const keys = window.getSelection()?.focusNode?.parentElement?.dataset?.keys
          if (keys) annotate(JSON.parse(keys))
        }
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { wave.args[name] = items as unknown as Rec[] }, [])

    return (
      <div data-test={name} className={readonly ? css.readonly : ''}>
        <div className={clas('wave-s16 wave-w6', css.title)}>{title}</div>
        <AnnotatorTags tags={tags} activateTag={activateTag} activeTag={activeTag} />
        <div style={{ display: 'flex' }}>
          <Fluent.Checkbox
            label='Smart selection'
            checked={smartSelection}
            onChange={() => setSmartSelection(prevSelection => !prevSelection)}
            className={css.checkbox}
            styles={{ root: { alignItems: 'center', paddingLeft: 8, paddingRight: 8 } }}
          />
          <Fluent.CommandBar styles={{ root: { padding: 0 } }} items={[
            {
              key: 'remove-all',
              text: 'Remove all selections',
              onClick: removeAllAnnotations,
              disabled: !tokens.find(token => token.tag),
              iconProps: { iconName: 'DependencyRemove', styles: { root: { fontSize: 20 } } },
            },
          ]}
          />
        </div>
        <div className={clas(css.content, 'wave-s16 wave-t7 wave-w3')} onMouseUp={handleSelectionFinish}>{
          tokens.map(({ start, end, text, tag }, idx) => {
            const activeColor = activeTag ? tagColorMap.get(activeTag) : undefined
            return (
              // Use paragraph instead of span to support text highlight.
              text === '\n' || text === '\r'
                // Handle newline escape characters
                ? <br key={idx}></br>
                // Use paragraph instead of span to support text highlight.
                : <p
                  key={idx}
                  // data-keys keeps state in DOM to access it via window.getSelection() API in case mouse up event is fired when cursor is not above <p/> element
                  data-keys={`{ "key": ${idx}, "start": ${start}, "end": ${end} }`}
                  onMouseDown={handleMouseDown({ key: idx, start, end })}
                  onMouseUp={handleMouseUp({ key: idx, start, end })}
                  style={{ display: 'inline', padding: '4px 0px' }}
                  className={activeColor ? style({ $nest: { '&::selection': { background: activeColor, color: getContrast(activeColor) } } }) : undefined}
                >
                  {tag ? getMark(text, idx, tag) : text}
                </p>
            )
          })
        }</div>
      </div>
    )
  }