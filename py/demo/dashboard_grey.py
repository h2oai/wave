from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_grey_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            min_width='800px',
            zones=[
                ui.zone('header'),
                ui.zone('body', size='1000px', zones=[
                    ui.zone('title', size='0'),
                    ui.zone('top', direction=ui.ZoneDirection.ROW, size='25%'),
                    ui.zone('middle', direction=ui.ZoneDirection.ROW, size='25%'),
                    ui.zone('middle2', direction=ui.ZoneDirection.ROW, size='25%'),
                    ui.zone('bottom', direction=ui.ZoneDirection.ROW, size='20%'),
                ]),
                ui.zone('footer'),
            ]
        )
    ])

    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Grey Dashboard',
                                      nav=global_nav)
    q.page['section'] = ui.section_card(
        box='title',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.label(label='Start:'),
            ui.date_picker(name='target_date', label='', value='2020-12-20'),
            ui.label(label='End:'),
            ui.date_picker(name='target_date', label='', value='2020-12-25'),
        ],
    )

    stock_dates = generate_time_series(10000)
    stock_prices = generate_random_walk()

    q.page['small'] = ui.small_stat_card(
        box=ui.box('top', order=1),
        title=next(sample_term),
        value=next(sample_dollars),
    )
    q.page['small_series'] = ui.small_series_stat_card(
        box=ui.box('top', order=2),
        title=next(sample_term),
        value=next(sample_dollars),
        plot_category='date',
        plot_value='price',
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['small_series_interval'] = ui.small_series_stat_card(
        box=ui.box('top', order=3),
        title=next(sample_term),
        value=next(sample_dollars),
        plot_category='date',
        plot_value='price',
        plot_type=ui.SmallSeriesStatCardPlotType.INTERVAL,
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['wide_series'] = ui.wide_series_stat_card(
        box=ui.box('middle', order=1),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        plot_category='date',
        plot_value='price',
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['wide_bar'] = ui.wide_bar_stat_card(
        box=ui.box('middle', order=2),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        progress=random.random(),
    )
    q.page['wide_gauge'] = ui.wide_gauge_stat_card(
        box=ui.box('middle', order=3),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        progress=random.random(),
    )
    q.page['tall_series'] = ui.tall_series_stat_card(
        box=ui.box('middle2', order=1),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        plot_category='date',
        plot_value='price',
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['tall_gauge'] = ui.tall_gauge_stat_card(
        box=ui.box('middle2', order=2),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        progress=random.random(),
    )
    q.page['large'] = ui.large_stat_card(
        box=ui.box('bottom', order=1),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        caption=next(sample_caption),
    )
    q.page['large_bar'] = ui.large_bar_stat_card(
        box=ui.box('bottom', order=2),
        title=next(sample_term),
        value=next(sample_dollars),
        value_caption=next(sample_term),
        aux_value=next(sample_dollars),
        aux_value_caption=next(sample_term),
        progress=random.random(),
        caption=next(sample_caption),
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
