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

import { CompoundButton } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { wave } from './ui'

const
  css = stylesheet({
    login: {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  })

const
  Login = () => {
    const
      action = `${wave.initURL}${window.location.search}`

    return (
      <div className={css.login}>
        <form action={action} method="POST">
          <CompoundButton type="default" secondaryText="using OpenID Connect.">
            Log In
          </CompoundButton>
        </form>
      </div>
    )
  }

export default Login
