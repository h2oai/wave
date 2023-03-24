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
import { Id, Rec } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { wave } from './ui'


const css = stylesheet({
  chatWindow: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    overflowY: 'scroll',
    flexGrow: 1,
  },
  message: {
    backgroundColor: '#f3f2f1',
    color: '#000',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    maxWidth: '60%',
  },
})

/** Create a wide plot card displaying a title, caption and a plot. */
export interface Chatbot {
  /** An identifying name for this component. */
  name: Id
  /** The card's plot data. */
  data: Rec
}

export const XChatbot = ({ model }: { model: Chatbot }) => {
  const
    [conversation, setConversation] = React.useState<any[]>([]),
    [userInput, setUserInput] = React.useState(''),
    onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
      e.preventDefault()
      wave.args[model.name] = newVal
      setUserInput(newVal)
    },
    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (e.key === 'Enter') submit() },
    submit = () => {
      setConversation([...conversation, { text: userInput, fromUser: true }])
      wave.push()
      setUserInput('')
    }

  return (
    <div className={css.chatWindow}>
      <div className={css.messageContainer}>
        {conversation.map((message, index) => (
          <div
            key={index}
            className={css.message}
            style={{ display: 'flex', flexDirection: message.fromUser ? 'row-reverse' : 'row', margin: 10 }}
          >
            {message.text}
          </div>
        ))}
        <div style={{ float: 'left', clear: 'both' }} ref={(el) => { if (el) { el.scrollIntoView({ behavior: 'smooth' }) } }} ></div>
      </div>
      <Fluent.Stack horizontal style={{ padding: 10 }}>
        <Fluent.TextField
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message"
          styles={{ root: { flexGrow: 1 } }}
        />
        <Fluent.PrimaryButton onClick={submit} iconProps={{ iconName: 'Send' }}>Send</Fluent.PrimaryButton>
      </Fluent.Stack>
    </div>

  )
}