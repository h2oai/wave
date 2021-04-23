import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { B, bond, box, S, U } from './qd'
import { clas, cssVar } from './theme'

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
  CopyButton = bond(({ textRef }: { textRef: React.RefObject<Fluent.ITextField> }) => {
    let timeoutRef: U
    const
      copiedB = box(false),
      onClick = () => {
        const el = textRef.current
        if (!el) return

        el.select()
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
  /** Text to be displayed inside the component. */
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
    ref = React.createRef<Fluent.ITextField>(),
    render = () => {
      const textFieldProps: Fluent.ITextFieldProps = {
        componentRef: ref,
        defaultValue: model.value,
        styles: { root: { flexGrow: 1 } },
        readOnly: true
      }
      return (
        <div data-test={model.name}>
          {
            model.multiline
              ? (
                <>
                  <div className={css.multilineContainer}>
                    <Fluent.Label>{model.label}</Fluent.Label>
                    <CopyButton textRef={ref} />
                  </div>
                  <Fluent.TextField {...textFieldProps} multiline />
                </>
              )
              : (
                <div className={css.compactContainer}>
                  <Fluent.TextField {...textFieldProps} label={model.label} />
                  <CopyButton textRef={ref} />
                </div>
              )
          }
        </div>
      )
    }

  return { render }
})