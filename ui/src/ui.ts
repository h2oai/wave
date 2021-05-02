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

import * as React from 'react'
import { boxed, Disposable, on } from './qd'

//
// React Component + Dataflow
//

interface Renderable {
  render(): JSX.Element
  init?(): void
  update?(): void
  dispose?(): void
}

export function bond<TProps, TState extends Renderable>(ctor: (props: TProps) => TState) {
  return class extends React.Component<TProps> {
    private readonly model: TState
    private readonly arrows: Disposable[]
    constructor(props: TProps) {
      super(props)

      const
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        self = this,
        model = ctor(props),
        arrows: Disposable[] = []

      Object.keys(model).forEach(k => {
        if (k === 'render' || k === 'dispose' || k === 'init' || k === 'update') return
        const v = (model as any)[k]
        if (boxed(v)) arrows.push(on(v, _ => self.setState({})))
      })

      this.model = model
      this.arrows = arrows
      this.state = {}
    }
    componentDidMount() {
      if (this.model.init) this.model.init()
    }
    componentDidUpdate() {
      if (this.model.update) this.model.update()
    }
    componentWillUnmount() {
      if (this.model.dispose) this.model.dispose()
      for (const a of this.arrows) a.dispose()
    }
    render() {
      return this.model.render()
    }
  }
}


