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

import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { XPersona } from './persona'
import { bond } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  img: {
    flexGrow: 1,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  persona: {
    padding: 16
  }
})

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
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { title, subtitle, image, profile_image, initials } = state
    return (
      <div data-test={name} className={css.card}>
        <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
        <div className={css.persona}>
          <XPersona model={{ title, subtitle, image: profile_image, initials, size: 'xs' }} />
        </div>
      </div>
    )
  }

  return { render, changed }
})

cards.register('profile', View)