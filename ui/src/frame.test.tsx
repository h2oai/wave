import React from 'react'
import { render } from '@testing-library/react'
import { View, Frame, XFrame } from './frame'
import * as T from './qd'

const
  name = 'frame',
  frameProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  },
  xFrameProps: Frame = { name }

describe('Frame.tsx', () => {

  it('Renders data-test attr for Card', () => {
    const { queryByTestId } = render(<View {...frameProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not render data-test attr for XFrame', () => {
    const { container } = render(<XFrame model={{}} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr for XFrame', () => {
    const { queryByTestId } = render(<XFrame model={xFrameProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})