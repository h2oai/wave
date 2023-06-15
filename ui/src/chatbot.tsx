// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, Id, Model, Rec, S, unpack } from 'h2o-wave'
import React from 'react'
import { cards } from './layout'
import { Markdown } from './markdown'
import { clas, cssVar, getContrast, important, px, rem } from './theme'
import { bond, wave } from './ui'

const
  INPUT_HEIGHT = 30,
  css = Fluent.mergeStyleSets({
    chatWindow: {
      height: '100%',
      minHeight: 400,
      // HACK: Use absolute positionning due to Safari being Safari.
      position: 'relative',
      flexGrow: 1,
    },
    msgContainer: {
      position: 'absolute',
      top: 15,
      left: 0,
      right: 0,
      overflowY: 'auto',
    },
    msgWrapper: {
      '&:first-child': { marginTop: important(px(0)) },
      display: 'flex',
      justifyContent: 'center',
    },
    msg: {
      maxWidth: '65ch',
      flexGrow: 1,
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    botMsg: {
      backgroundColor: cssVar('$neutralLighter'),
    },
    textInput: {
      padding: 15,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    },
    stopButton: {
      left: '50%',
      transform: 'translate(-50%, -7px)',
      width: 180
    }
  })

type ChatMessage = { msg: S, fromUser: B }

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec[]
  /** Chat input box placeholder. Use for prompt examples. */
  placeholder?: S
  /** The events to capture on this chatbot. One of 'stop'. */
  events?: S[]
  /** True to show a button to stop the text generation. Defaults to False. */
  generating?: B
}

export const XChatbot = ({ model }: { model: Chatbot }) => {
  const
    [msgs, setMsgs] = React.useState<ChatMessage[]>([]),
    [userInput, setUserInput] = React.useState(''),
    msgContainerRef = React.useRef<HTMLDivElement>(null),
    theme = Fluent.useTheme(),
    botTextColor = React.useMemo(() => getContrast(theme.palette.neutralLighter), [theme.palette.neutralLighter]),
    onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
      e.preventDefault()
      wave.args[model.name] = newVal
      setUserInput(newVal)
    },
    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault() // Prevents a newline from being added to the text box.
        submit()
      }
    },
    submit = () => {
      if (!userInput.trim()) return
      setMsgs([...msgs, { msg: userInput, fromUser: true }])
      wave.push()
      setUserInput('')
    },
    stopGenerating = () => { if (model.events?.includes('stop')) wave.emit(model.name, 'stop', true) }

  React.useEffect(() => {
    if (!msgContainerRef.current) return
    const offsetTop = msgContainerRef.current.scrollHeight
    if (msgContainerRef.current?.scrollTo) msgContainerRef.current.scrollTo({ top: offsetTop, behavior: 'smooth' })
    else msgContainerRef.current.scrollTop = offsetTop
  }, [msgs])
  React.useEffect(() => { if (model.data) setMsgs(model.data as ChatMessage[]) }, [model.data])

  return (
    <div className={css.chatWindow}>
      <div
        ref={msgContainerRef}
        className={css.msgContainer}
        // Height of input box + padding (+ height of stop button).
        style={{ bottom: model.generating ? 94 : 62 }}
      >
        {msgs.map(({ msg, fromUser }, idx) => (
          <div
            key={idx}
            className={clas(css.msgWrapper, fromUser ? '' : css.botMsg)}
            style={{
              paddingTop: msgs[idx - 1]?.fromUser !== fromUser ? rem(0.8) : 0,
              paddingBottom: msgs?.[idx + 1]?.fromUser !== fromUser ? rem(0.8) : 0,
              color: fromUser ? '$text' : botTextColor
            }} >
            <span
              className={clas(css.msg, 'wave-s14')}
              style={{ padding: msg?.includes('\n') ? 12 : 6 }}>
              <Markdown source={msg || ''} />
            </span>
          </div>
        ))}
      </div>
      <div className={css.textInput}>
        {model.generating &&
          <Fluent.DefaultButton className={css.stopButton} onClick={stopGenerating} iconProps={{ iconName: 'Stop' }}>
            Stop generating
          </Fluent.DefaultButton>
        }
        <Fluent.TextField
          data-test={model.name}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete='off'
          multiline
          autoAdjustHeight
          placeholder={model.placeholder || 'Type your message'}
          styles={{
            root: { flexGrow: 1 },
            fieldGroup: { minHeight: INPUT_HEIGHT },
            field: {
              paddingRight: INPUT_HEIGHT,
              height: INPUT_HEIGHT,
              maxHeight: 100,
              overflowY: 'auto',
              resize: 'none'
            }
          }}
        />
        <Fluent.IconButton
          data-test={`${model.name}-submit`}
          iconProps={{ iconName: 'Send' }}
          onClick={submit}
          disabled={!userInput.trim() || model.generating}
          styles={{
            root: { position: 'absolute', bottom: 16, right: 20, height: INPUT_HEIGHT },
            rootHovered: { backgroundColor: 'transparent' },
            rootDisabled: { position: 'absolute', bottom: 16, right: 20, height: INPUT_HEIGHT, backgroundColor: 'transparent' },
            icon: { height: 'auto' } // Makes icon vertically centered.
          }} />
      </div>
    </div>
  )
}

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
interface State {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires cyclic buffer. */
  data: Rec
  /** Chat input box placeholder. Use for prompt examples. */
  placeholder?: S
  /** The events to capture on this chatbot. One of 'stop'. */
  events?: S[]
  /** True to show a button to stop the text generation. Defaults to False. */
  generating?: B
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => (
      <div data-test={name} style={{ display: 'flex', flexDirection: 'column' }}>
        <XChatbot model={{ name: state.name, data: unpack<ChatMessage[]>(state.data), placeholder: state.placeholder, generating: state.generating, events: state.events }} />
      </div>
    )
    return { render, changed }
  })

cards.register('chatbot', View)