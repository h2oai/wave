import React from 'react'
import { render } from '@testing-library/react'
import { View } from './header'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const
  name = 'header',
  headerProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Header.tsx', () => {
  beforeAll(() => initializeIcons())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...headerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})