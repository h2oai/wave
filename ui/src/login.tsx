import React from 'react'
import { stylesheet } from 'typestyle'
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
  Login = () => {
    const
      queryString = window.location.search,
      action = `/_auth/init${queryString}`
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
