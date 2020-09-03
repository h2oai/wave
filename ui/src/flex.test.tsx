import React from 'react';
import { render } from '@testing-library/react';
import { View } from './flex';
import * as T from './qd';

const
  name = 'flex',
  flexProps: T.Card<any> = {
    name,
    state: {
      data: [],
      itemView: 'template',
      itemProps: "data:{\"content\":\"<div style=\\\"width:15px; height:15px; border-radius: 50%; background-color:{{#if loss}}red{{else}}green{{/if}}\\\" title=\\\"{{code}}\\\"/>\"}"
    },
    changed: T.box(false)
  }

describe('Flex.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...flexProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})