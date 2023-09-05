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

import { registerIcons } from '@fluentui/react'
import * as Icons from '@fluentui/react-icons-mdl2'
import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import React from 'react'

configure({ testIdAttribute: 'data-test' })

// TODO: Remove once we have a proper solution for mocking d3.
jest.mock('d3', () => ({
  extent: () => '',
  scaleOrdinal: () => ({ domain: () => ({ range: () => '' }) }),
  arc: () => '',
  pie: () => ({ value: () => () => [] }),
}))
jest.mock('d3-interpolate', () => ({ extent: () => '' }))

const icons = Object.entries(Icons).reduce((acc, [iconName, iconComponent]) => {
  if ('displayName' in iconComponent) acc[iconName.slice(0, -4)] = React.createElement(iconComponent as React.FC)
  return acc
}, {} as { [key: string]: JSX.Element })
registerIcons({ icons })