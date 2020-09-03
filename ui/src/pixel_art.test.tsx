import React from 'react';
import { render } from '@testing-library/react';
import { View } from './pixel_art';
import * as T from './qd';

const
  name = 'pixel_art',
  pixelArtProps: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  }

describe('PixelArt.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...pixelArtProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})