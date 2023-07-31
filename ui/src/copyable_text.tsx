import * as Fluent from '@fluentui/react'
import { B, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, pc } from './theme'

const
  css = stylesheet({
    animate: {
      opacity: 0,
      transition: 'opacity .5s'
    },
    visible: {
      opacity: 1,
    },
    btn: {
      minWidth: 'initial',
      position: 'fixed',
      width: 24,
      height: 24,
      // TODO: Compute dynamically based on anchor element.
      // right: 0,
      // transform: 'translate(-4px, 4px)',
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

export const ClipboardCopyButton = ({ value, anchorElementRef, showOnHover }: { value: S, anchorElementRef: any, showOnHover: B }) => {
  const
    timeoutRef = React.useRef<U>(),
    [copied, setCopied] = React.useState(false),
    [visible, setVisible] = React.useState(!showOnHover),
    onClick = async () => {
      const el = anchorElementRef.current
      if (!el) return
      try {
        if (document.queryCommandSupported('copy')) {
          el.select() // TODO: Test, replace with componentRef
          document.execCommand('copy')
          window.getSelection()?.removeAllRanges()
        }
      } catch (error) {
        await window.navigator.clipboard.writeText(value)
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    }

  React.useEffect(() => {
    const el = anchorElementRef.current
    if (el) {
      console.log(anchorElementRef.current.getBoundingClientRect())
      // textFieldMultiline: multiline ? { '&:hover button': { opacity: 1 } } : undefined // TODO: Re-implement with pure CSS: '&hover childId'
      el.addEventListener('mouseenter', () => { setVisible(true) })
      el.addEventListener('mouseleave', () => { setVisible(false) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (<Fluent.PrimaryButton
    title='Copy to clipboard'
    onClick={onClick}
    iconProps={{ iconName: copied ? 'CheckMark' : 'Copy' }}
    className={clas(css.btn, copied ? css.copiedBtn : '', showOnHover ? css.animate : '', visible ? css.visible : '')}
  />)
}

export const XCopyableText = ({ model }: { model: CopyableText }) => {
  const
    { name, multiline, label, value, height } = model,
    heightStyle = multiline && height === '1' ? fullHeightStyle : undefined,
    ref = React.useRef<Fluent.ITextField>(null),
    domRef = React.useRef<HTMLDivElement>(null)

  return (
    <>
      <Fluent.TextField
        data-test={name}
        componentRef={ref}
        elementRef={domRef} // Temporary solution which will be replaced with ref once TextField is converted to a function component.
        value={value}
        multiline={multiline}
        onRenderLabel={() =>
          <div className={css.labelContainer}>
            <Fluent.Label>{label}</Fluent.Label>
          </div>
        }
        styles={{
          root: {
            ...heightStyle,
            textFieldRoot: { position: 'relative', width: pc(100) },
          },
          wrapper: heightStyle,
          fieldGroup: heightStyle || { minHeight: height },
          field: { ...heightStyle, height, resize: multiline ? 'vertical' : 'none', },
        }}
        readOnly
      />
      <ClipboardCopyButton anchorElementRef={domRef} showOnHover={!!multiline} value={value} />
    </>
  )
}