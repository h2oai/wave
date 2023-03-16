import * as Fluent from '@fluentui/react'
import { B, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, pc } from './theme'

const
  css = stylesheet({
    btnMultiline: {
      opacity: 0,
      transition: 'opacity .5s'
    },
    btn: {
      minWidth: 'initial',
      position: 'absolute',
      width: 24,
      height: 24,
      right: 0,
      transform: 'translate(-4px, 4px)',
      zIndex: 1,
    },
    copiedBtn: {
      background: cssVar('$green'),
      $nest: {
        '&:hover': {
          background: cssVar('$green'),
        }
      }
    },
    labelContainer: {
      position: 'relative'
    }
  }),
  fullHeightStyle = {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  }

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
  /** Custom height in px (e.g. '200px') or '1' to fill the remaining card space. Requires `multiline` to be set. */
  height?: S
}

export const XCopyableText = ({ model }: { model: CopyableText }) => {
  const
    { name, multiline, label, value, height } = model,
    heightStyle = multiline && height === '1' ? fullHeightStyle : undefined,
    ref = React.useRef<Fluent.ITextField>(null),
    timeoutRef = React.useRef<U>(),
    [copied, setCopied] = React.useState(false),
    onClick = async () => {
      const el = ref.current
      if (!el) return
      try {
        if (document.queryCommandSupported('copy')) {
          el.select()
          document.execCommand('copy')
          window.getSelection()?.removeAllRanges()
        }
      } catch (error) {
        await window.navigator.clipboard.writeText(value)
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    }

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (
    <Fluent.TextField
      data-test={name}
      componentRef={ref}
      value={value}
      multiline={multiline}
      onRenderLabel={() =>
        <div className={css.labelContainer}>
          <Fluent.Label>{label}</Fluent.Label>
          <Fluent.PrimaryButton
            title='Copy to clipboard'
            onClick={onClick}
            iconProps={{ iconName: copied ? 'CheckMark' : 'Copy' }}
            className={clas(css.btn, copied ? css.copiedBtn : '', multiline ? css.btnMultiline : '')}
          />
        </div>
      }
      styles={{
        root: {
          ...heightStyle,
          textFieldRoot: { position: 'relative', width: pc(100) },
          textFieldMultiline: multiline ? { '&:hover button': { opacity: 1 } } : undefined
        },
        wrapper: heightStyle,
        fieldGroup: heightStyle || { minHeight: height },
        field: { ...heightStyle, height, resize: multiline ? 'vertical' : 'none', },
      }}
      readOnly
    />
  )
}