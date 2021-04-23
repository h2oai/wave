import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Markdown } from './markdown'
import { B, bond, box, S, U } from './qd'
import { clas, cssVar, padding } from './theme'

const
  css = stylesheet({
    compactContainer: {
      display: 'flex',
      alignItems: 'flex-end'
    },
    multilineContainer: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    multilineText: {
      border: `1px solid ${cssVar('$neutralSecondary')}`,
      borderRadius: 2,
      padding: padding(0, 8)
    },
    btn: {
      minWidth: 'initial'
    },
    copiedBtn: {
      background: cssVar('$green'),
      $nest: {
        '&:hover': {
          background: cssVar('$green'),
        }
      }
    }
  }),
  CopyButton = bond(({ textRef, markdownRef }: { textRef?: React.RefObject<Fluent.ITextField>, markdownRef?: React.RefObject<HTMLDivElement> }) => {
    let timeoutRef: U
    const
      copiedB = box(false),
      onClick = () => {
        if (!textRef && !markdownRef) return
        window.getSelection()?.removeAllRanges()

        if (textRef) {
          const el = textRef.current
          if (!el) return
          el.select()
        }

        if (markdownRef) {
          const
            start = markdownRef.current?.firstChild?.firstChild,
            end = markdownRef.current?.firstChild?.lastChild

          if (!start || !end) return
          const range = document.createRange()
          range.setStart(start, 0)
          range.setEnd(end, 0)
          window.getSelection()?.addRange(range)
        }
        document.execCommand('copy')
        window.getSelection()?.removeAllRanges()
        copiedB(true)

        timeoutRef = window.setTimeout(() => copiedB(false), 2000)
      },
      dispose = () => window.clearTimeout(timeoutRef),
      render = () => (
        <Fluent.TooltipHost content='Copy to clipboard'>
          {
            copiedB()
              ? <Fluent.PrimaryButton iconProps={{ iconName: 'CheckMark' }} className={clas(css.btn, css.copiedBtn)} />
              : <Fluent.PrimaryButton onClick={onClick} iconProps={{ iconName: 'Copy' }} className={css.btn} />
          }
        </Fluent.TooltipHost>
      )

    return { render, copiedB, dispose }
  })

/**
 * Create a copyable text component.
 * Use this component when you want to enable your users to quickly copy paste sections of text.
*/
export interface CopyableText {
  /** Text to be displayed inside the component. Markdown is supported only when 'multiline' is set. */
  value: S
  /** The text displayed above the textbox. */
  label: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should allow multi-line text entry. */
  multiline?: B
}

export const XCopyableText = bond(({ model }: { model: CopyableText }) => {
  const
    ref = React.createRef<Fluent.ITextField | HTMLDivElement>(),
    render = () => (
      <div data-test={model.name}>
        {
          model.multiline
            ? (
              <>
                <div className={css.multilineContainer}>
                  <Fluent.Label>{model.label}</Fluent.Label>
                  <CopyButton markdownRef={ref as React.RefObject<HTMLDivElement>} />
                </div>
                <div ref={ref as React.RefObject<HTMLDivElement>} className={css.multilineText}>
                  <Markdown source={model.value} />
                </div>
              </>
            )
            : (
              <div className={css.compactContainer}>
                <Fluent.TextField
                  componentRef={ref as React.RefObject<Fluent.ITextField>}
                  defaultValue={model.value}
                  label={model.label}
                  styles={{ root: { flexGrow: 1 } }}
                  readOnly
                />
                <CopyButton textRef={ref as React.RefObject<Fluent.ITextField>} />
              </div>
            )
        }
      </div>
    )


  return { render }
})