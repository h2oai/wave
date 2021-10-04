// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
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
import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { cards } from './layout'
import { border, cssVar } from './theme'
import { Command, toCommands } from './toolbar'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      $nest: {
        '+div': {
          display: 'none' // HACK: Hide page-wide command menu.
        }
      }
    },
    content: {
      padding: 24
    },
    img: {
      flexGrow: 1,
      minHeight: 150,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    },
    persona: {
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 16
    },
    items: {
      marginTop: 16
    }
  }),
  commandBarPrimarySetStyles: Fluent.IStyle = {
    justifyContent: 'center',
    background: `${cssVar('$card')}`,
    '.ms-Button:not(:hover)': { background: `${cssVar('$card')} !important` }
  }

/** Create a profile card to display information about a user. */
interface State {
  /** The card's title, displayed under the main image. */
  title: S
  /** The card's subtitle, displayed under the title. */
  subtitle?: S
  /** 
   * The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`)
   * or a path to an image hosted on the Wave daemon (starting with `/`).
. */
  image?: S
  /** 
   * The avatar’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`)
   * or a path to an image hosted on the Wave daemon (starting with `/`).
. */
  profile_image?: S
  /** Initials, if `profile_image` is not specified. */
  initials?: S
  /** Components in this card displayed below toolbar / image. */
  items?: Component[]
}

export const View = bond(({ name, state, changed }: Model<State & { commands: Command[] }>) => {
  const render = () => {
    const { title, subtitle, image, profile_image, initials, commands, items } = state
    return (
      <div data-test={name} className={css.card}>
        {image && <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>}
        <div className={css.content}>
          <div className={css.persona}>
            <Fluent.Persona
              text={title}
              secondaryText={subtitle}
              imageUrl={profile_image}
              imageInitials={initials}
              size={Fluent.PersonaSize.size100}
              styles={{
                root: {
                  flexDirection: 'column', height: 'auto', marginTop: image ? -74 : 0,
                  '.ms-Persona-image': { border: border(2, cssVar('$neutralTertiary')) }
                },
                details: { alignItems: 'center', padding: 0 },
                primaryText: { fontWeight: 500, marginTop: 12, color: cssVar('$neutralPrimary') },
              }}
            />
          </div>
          {commands && <Fluent.CommandBar items={toCommands(commands)} styles={{ root: { padding: 0, height: 24 }, primarySet: commandBarPrimarySetStyles }} />}
          {items && <div className={css.items}><XComponents items={items} /></div>}
        </div>
      </div>
    )
  }

  return { render, changed }
})

cards.register('profile', View)