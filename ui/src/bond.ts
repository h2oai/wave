import * as React from 'react';
import { boxed, Disposable, on } from './dataflow';

interface Renderable {
  render(): JSX.Element
  init?(): void
  dispose?(): void
}

export default function bond<TProps, TState extends Renderable>(ctor: (props: TProps) => TState) {
  return class extends React.Component<TProps> {
    private readonly model: TState
    private readonly arrows: Disposable[]
    constructor(props: TProps) {
      super(props)

      const
        self = this,
        model = ctor(props),
        arrows: Disposable[] = []

      Object.keys(model).forEach(k => {
        if (k === 'render' || k === 'dispose' || k === 'init') return
        const v = (model as any)[k]
        if (boxed(v)) arrows.push(on(v, _ => self.setState({})))
      })

      this.model = model
      this.arrows = arrows
      this.state = {}
    }
    public componentDidMount() {
      if (this.model.init) this.model.init()
    }
    public componentWillUnmount() {
      if (this.model.dispose) this.model.dispose()
      for (const a of this.arrows) a.dispose()
    }
    public render() {
      return this.model.render()
    }
  }
}
