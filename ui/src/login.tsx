import React from 'react'
import { stylesheet } from 'typestyle'
import { bond } from './qd'
import { CompoundButton } from '@fluentui/react'

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
  Login = bond(() => {
    const
      render = () => (
        <div className={css.login}>
          <form action="/auth/init" method="POST">
            <CompoundButton type="default" secondaryText="using OpenID Connect.">
              Log In
            </CompoundButton>
          </form>
        </div>
      )

    return { render }
  })

export default Login
