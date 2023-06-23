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
import { B, Id, Model, Rec, S, isBuf, unpack, xid } from 'h2o-wave'
import React from 'react'
import { cards } from './layout'
import { Markdown } from './markdown'
import InfiniteScrollList from './parts/infiniteScroll'
import { clas, cssVar, getContrast, important, margin, px, rem } from './theme'
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
      padding: margin(0, 15),
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
      '& p': {
        whiteSpace: 'pre-wrap'
      },
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
      // Vertically centers the stop button between message container and text input container (textInput padding / 2).
      marginBottom: 7.5,
      transform: 'translateX(-50%)',
      width: 180
    }
  })

type Message = ChatbotMessage & { id?: S }

/* Chatbot message entity. */
interface ChatbotMessage {
  /* Text of the message. */
  content: S
  /* True if the message is from the user. */
  from_user: B
}

/** Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** Chat messages data. Requires list or cyclic buffer. */
  data: Rec
  /** Chat input box placeholder. Use for prompt examples. */
  placeholder?: S
  /** The events to capture on this chatbot. One of 'stop' | 'scroll_up'. */
  events?: S[]
  /** True to show a button to stop the text generation. Defaults to False. */
  generating?: B
  /** The previous messages to show as the user scrolls up. */
  prev_items?: ChatbotMessage[]
}

const processData = (data: Rec) => unpack<ChatbotMessage[]>(data).map(({ content, from_user }) => ({ content, from_user }))

export const XChatbot = (props: Chatbot) => {
  const
    [msgs, setMsgs] = React.useState<Message[]>(props.data ? processData(props.data) : []),
    [userInput, setUserInput] = React.useState(''),
    [isInfiniteLoading, setIsInfiniteLoading] = React.useState(false),
    theme = Fluent.useTheme(),
    botTextColor = React.useMemo(() => getContrast(theme.palette.neutralLighter), [theme.palette.neutralLighter]),
    msgContainerRef = React.useRef<HTMLDivElement>(null),
    skipNextBottomScroll = React.useRef(false),
    onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
      e.preventDefault()
      wave.args[props.name] = newVal
      setUserInput(newVal)
    },
    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault() // Do not add an extra newline to the input text box after submission.
        submit()
      }
    },
    submit = () => {
      if (!userInput.trim()) return
      setMsgs([...msgs, { content: userInput, from_user: true }])
      wave.push()
      setUserInput('')
    },
    stopGenerating = () => { if (props.events?.includes('stop')) wave.emit(props.name, 'stop', true) },
    onLoad = React.useCallback(() => {
      if (props.events?.includes('scroll_up')) {
        wave.emit(props.name, 'scroll_up', true)
        setIsInfiniteLoading(true)
      }
    }, [props.events, props.name]),
    onDataChange = React.useCallback(() => { if (props.data) setMsgs(processData(props.data)) }, [props.data])

  React.useEffect(() => {
    if (isBuf(props.data)) props.data.registerOnChange(onDataChange)
  }, [props.data, onDataChange])
  React.useEffect(() => {
    if (!props.prev_items) return
    // Perf: Assign stable ID to prevent React from recreating the entire list.
    // Currently for prev_items only, needs to be done for the rest as well.
    const newMsgs = props.prev_items.map(i => ({ ...i, id: xid() }))
    setMsgs(prev => [...newMsgs, ...prev])
    setIsInfiniteLoading(false)
    skipNextBottomScroll.current = true
  }, [props.prev_items])
  React.useLayoutEffect(() => {
    if (!msgContainerRef.current) return
    if (skipNextBottomScroll.current) {
      skipNextBottomScroll.current = false
      return
    }
    const topOffset = msgContainerRef.current.scrollHeight
    msgContainerRef.current?.scrollTo
      ? msgContainerRef.current.scrollTo({ top: topOffset, behavior: 'smooth' })
      : msgContainerRef.current.scrollTop = topOffset
  }, [msgs])

  return (
    <div className={css.chatWindow}>
      <InfiniteScrollList
        forwardedRef={msgContainerRef}
        className={css.msgContainer}
        // Height of input box + padding (+ height of stop button).
        style={{ bottom: props.generating ? 94 : 62 }}
        hasMore={props.prev_items?.length !== 0}
        onInfiniteLoad={onLoad}
        isInfiniteLoading={isInfiniteLoading}
      >
        {msgs.map(({ from_user, content, id }, idx) => (
          <div
            key={id ?? idx}
            className={clas(css.msgWrapper, from_user ? '' : css.botMsg)}
            style={{
              paddingTop: msgs[idx - 1]?.from_user !== from_user ? rem(0.8) : 0,
              paddingBottom: msgs?.[idx + 1]?.from_user !== from_user ? rem(0.8) : 0,
              color: from_user ? '$text' : botTextColor
            }} >
            <span className={clas(css.msg, 'wave-s14')} style={{ padding: content?.includes('\n') ? 12 : 6 }}>
              <Markdown source={content || ''} />
            </span>
          </div>
        ))}
      </InfiniteScrollList>
      <div className={css.textInput}>
        {props.generating &&
          <Fluent.DefaultButton className={css.stopButton} onClick={stopGenerating} iconProps={{ iconName: 'Stop' }}>
            Stop generating
          </Fluent.DefaultButton>
        }
        <Fluent.TextField
          data-test={props.name}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete='off'
          multiline
          autoAdjustHeight
          placeholder={props.placeholder || 'Type your message'}
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
          data-test={`${props.name}-submit`}
          iconProps={{ iconName: 'Send' }}
          onClick={submit}
          disabled={!userInput.trim() || props.generating}
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

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => (
    <div data-test={name} style={{ display: 'flex', flexDirection: 'column' }}>
      <XChatbot {...state} />
    </div>
  )

  return { render, changed }
})

cards.register('chatbot', View)