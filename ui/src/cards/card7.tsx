import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Data, decode, F, Rec, S } from '../delta';
import { cards, grid, Format, Rect } from '../grid';
import { MicroBars } from './microbars';
import { MicroArea } from './microline';
import { getTheme } from '../theme';

const
  theme = getTheme(),
  plotHeight = grid.unitInnerHeight - 10,
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    titleBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s12,
    },
    plot: {
      position: 'absolute',
      left: -grid.gap,
      bottom: -grid.gap,
      height: plotHeight,
    },
  })

interface Opts {
  rect: Rect
  title: string
  value: string
  data: Rec
  plot_type: 'area' | 'interval'
  plot_data: S | Data
  plot_color: S
  plot_category: S
  plot_value: S
  plot_zero_value: F
  plot_curve: S
}

type State = Partial<Opts>

const defaults: State = {
  title: 'Untitled',
  plot_type: 'area',
  plot_data: '',
  plot_color: theme.colors.gray,
  plot_curve: 'linear',
}

class View extends React.Component<Card<State>, State> {
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...props.data }
    props.changed.on(this.onChanged)
  }
  render() {
    const
      s = theme.merge(defaults, this.state),
      plotWidth = s.rect.width,
      data = decode(s.data),
      plot = s.plot_type === 'area'
        ? (
          <MicroArea
            width={plotWidth}
            height={plotHeight}
            data={decode(s.plot_data)}
            value={s.plot_value}
            color={s.plot_color}
            zeroValue={s.plot_zero_value}
            curve={s.plot_curve}
          />
        ) : (
          <MicroBars
            width={plotWidth}
            height={plotHeight}
            data={decode(s.plot_data)}
            category={s.plot_category}
            value={s.plot_value}
            color={s.plot_color}
            zeroValue={s.plot_zero_value}
          />
        )
    return (
      <div className={css.card}>
        <div className={css.titleBar}>
          <div className={css.title}>
            <Format data={data} format={s.title} />
          </div>
          <div className={css.value}>
            <Format data={data} format={s.value} />
          </div>
        </div>
        <div className={css.plot}>{plot}</div>
      </div>)
  }
}

cards.register('card7', View)
