import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { B, bond, box, S, U } from './qd'
import { clas, cssVar } from './theme'

const
  css = stylesheet({
    multiContainer: {
      position: 'relative',
      $nest: {
        '&:hover > button': {
          opacity: 1
        }
      }
    },
    compactContainer: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    btnMultiple: {
      position: 'absolute',
      top: 35,
      right: 10,
      opacity: 0,
      transition: 'opacity .5s'
    },
    btn: {
      minWidth: 'initial',
      margin: 0
    },
    copiedBtn: {
      background: cssVar('$green'),
      $nest: {
        '&:hover': {
          background: cssVar('$green'),
        }
      }
    }
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
  let timeoutRef: U
  const
    ref = React.createRef<Fluent.ITextField>(),
    copiedB = box(false),
    onClick = () => {
      const el = ref.current
      if (!el) return
      el.select()

      document.execCommand('copy')
      window.getSelection()?.removeAllRanges()
      copiedB(true)

      timeoutRef = window.setTimeout(() => copiedB(false), 2000)
    },
    dispose = () => window.clearTimeout(timeoutRef),
    render = () => (
      <div data-test={model.name}>
        {
          model.multiline
            ? (
              <div className={css.multiContainer}>
                <Fluent.TextField componentRef={ref} defaultValue={model.value} label={model.label} multiline readOnly />
                <Fluent.PrimaryButton onClick={onClick} text={copiedB() ? 'Copied!' : 'Copy'} className={clas(css.btn, css.btnMultiple)} />
              </div>
            )
            : (
              <div className={css.compactContainer}>
                <Fluent.TextField componentRef={ref} defaultValue={model.value} label={model.label} styles={{ root: { flexGrow: 1 } }} readOnly />
                <Fluent.TooltipHost content='Copy to clipboard'>
                  <Fluent.PrimaryButton onClick={onClick} iconProps={{ iconName: copiedB() ? 'CheckMark' : 'Copy' }} className={clas(css.btn, copiedB() ? css.copiedBtn : '')} />
                </Fluent.TooltipHost>
              </div>
            )
        }
      </div>
    )

  return { render, dispose, copiedB }
})