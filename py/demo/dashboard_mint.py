from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_mint_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('main_section'),
                ui.zone('overview', direction=ui.ZoneDirection.ROW, size='425px'),
                ui.zone('tickers', direction=ui.ZoneDirection.ROW, size='175px'),
                ui.zone('transactions_section'),
                ui.zone('transactions', direction=ui.ZoneDirection.ROW, size='400px'),
                ui.zone('footer'),
            ]
        )
    ])
    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Mint Dashboard',
                                      nav=global_nav)
    q.page['main_section'] = ui.section_card(
        box='main_section',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.tabs(
                name='currency',
                value='option0',
                items=[ui.tab(name=f'option{i}', label=next(sample_term)) for i in range(4)],
            )
        ],
    )
    trend_date = generate_time_series(60)
    trend_price = generate_random_walk(2000, 8000, 0.2)
    q.page['trends'] = ui.form_card(
        box=ui.box('overview', order=1, size=4),
        title=next(sample_title),
        items=[
            ui.inline(inset=True, items=[
                ui.checkbox(name='sent', label=next(sample_term), value=True),
                ui.checkbox(name='received', label=next(sample_term)),
                ui.dropdown(name='distribution', label='', value='option0', choices=[
                    ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
                ]),
            ]),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='line', x_scale='time', x='=date', y='=price', color='$mint', curve=ui.MarkCurve.STEP),
                ]),
                data=data(
                    fields=['date', 'price'],
                    rows=[(next(trend_date), next(trend_price)) for i in range(60)],
                    pack=True
                ),
                height='215px',
            ),
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_amount)),
                ui.stat(label=next(sample_term), value=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
            ], justify='between', inset=True),
        ])

    stock_dates = generate_time_series(300)
    stock_prices = generate_random_walk()

    q.page['exchange_rate'] = ui.tall_series_stat_card(
        box=ui.box('overview', order=2),
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_amount),
        plot_type=ui.TallSeriesStatCardPlotType.AREA,
        plot_color='$mint',
        plot_category='date',
        plot_value='price',
        plot_curve=ui.TallSeriesStatCardPlotCurve.STEP,
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )

    q.page['symbol1'] = ui.tall_series_stat_card(
        box=ui.box('tickers', order=1),
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_percent),
        plot_type=ui.TallSeriesStatCardPlotType.AREA,
        plot_color='$mint',
        plot_category='date',
        plot_value='price',
        plot_curve=ui.TallSeriesStatCardPlotCurve.STEP,
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )

    q.page['symbol2'] = ui.tall_series_stat_card(
        box=ui.box('tickers', order=2),
        title=next(sample_title),
        value=next(sample_percent),
        aux_value=next(sample_title),
        plot_type=ui.TallSeriesStatCardPlotType.AREA,
        plot_color='$green',
        plot_category='date',
        plot_value='price',
        plot_curve=ui.TallSeriesStatCardPlotCurve.STEP,
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )

    q.page['symbol3'] = ui.tall_series_stat_card(
        box=ui.box('tickers', order=3),
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        plot_type=ui.TallSeriesStatCardPlotType.AREA,
        plot_color='$mint',
        plot_category='date',
        plot_value='price',
        plot_curve=ui.TallSeriesStatCardPlotCurve.STEP,
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'price'],
            rows=[(next(stock_dates), next(stock_prices)) for i in range(30)],
            pack=True,
        ),
    )

    q.page['transactions_section'] = ui.section_card(
        box='transactions_section',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.tabs(
                name='time_period',
                value='option0',
                items=[ui.tab(name=f'option{i}', label=next(sample_term)) for i in range(6)],
                link=True,
            ),
        ],
    )

    q.page['transactions'] = ui.stat_table_card(
        box=ui.box('transactions', order=1, size=2),
        title=next(sample_title),
        subtitle=next(sample_caption),
        columns=[next(sample_term) for i in range(4)],
        items=[
            ui.stat_table_item(
                label=next(sample_title),
                caption=f'{random.randint(1, 5)} hours ago',
                values=[next(sample_percent), next(sample_amount), next(sample_dollars)],
                icon=next(sample_icon), icon_color='$mint') for i in range(6)
        ]
    )

    q.page['market'] = ui.stat_list_card(
        box=ui.box('transactions', order=2),
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.stat_list_item(label=next(sample_term), caption=next(sample_title), value=next(sample_dollars),
                              aux_value=next(sample_percent), value_color=next(sample_color)) for i in range(5)
        ],
    )
    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
