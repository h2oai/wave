from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_purple_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xs',
            zones=[
                ui.zone('header'),
                ui.zone('title'),
                ui.zone('body'),
                ui.zone('footer'),
            ],
        ),
        ui.layout(
            breakpoint='m',
            zones=[
                ui.zone('header'),
                ui.zone('title'),
                ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('main', zones=[
                        ui.zone('overview'),
                        ui.zone('stats1', direction=ui.ZoneDirection.ROW, size='150px'),
                        ui.zone('stats2', direction=ui.ZoneDirection.ROW, size='150px'),
                        ui.zone('others'),
                    ]),
                    ui.zone('sidebar', size='30%'),
                ]),
                ui.zone('footer'),
            ],
        ),
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('title'),
                ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('main', size='3', zones=[
                        ui.zone('overview', direction=ui.ZoneDirection.ROW, size='200px'),
                        ui.zone('stats', direction=ui.ZoneDirection.ROW, size='150px'),
                        ui.zone('details', direction=ui.ZoneDirection.ROW, size='400px'),
                        ui.zone('reports', direction=ui.ZoneDirection.ROW, size='400px'),
                    ]),
                    ui.zone('sidebar', size='30%'),
                ]),
                ui.zone('footer'),
            ]
        )
    ])
    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Purple Dashboard',
                                      nav=global_nav)

    q.page['title'] = ui.section_card(
        box='title',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.date_picker(name='target_date', label='', value='2020-12-25'),
        ],
    )

    customers_overview_dates = generate_time_series(30)
    customers_overview_counts = generate_random_walk()
    q.page['customers_overview'] = ui.tall_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='200px', order=1),
            ui.box('overview', height='200px', order=1),
            ui.box('overview', order=1),
        ),
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_title),
        plot_type='area',
        plot_color='$red',
        plot_category='date',
        plot_value='customer_count',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'customer_count'],
            rows=[(next(customers_overview_dates), next(customers_overview_counts)) for i in range(30)],
            pack=True,
        ),
    )
    conversions_overview_dates = generate_time_series(30)
    conversions_overview_counts = generate_random_walk()
    q.page['conversions_overview'] = ui.tall_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='200px', order=2),
            ui.box('overview', height='200px', order=2),
            ui.box('overview', order=2),
        ),
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_dollars),
        plot_type='interval',
        plot_color='$pink',
        plot_category='date',
        plot_value='conversions',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'conversions'],
            rows=[(next(conversions_overview_dates), next(conversions_overview_counts)) for i in range(30)],
            pack=True,
        ),
    )
    revenue_overview_dates = generate_time_series(30)
    revenue_overview_counts = generate_random_walk()
    q.page['revenue_overview'] = ui.tall_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='200px', order=3),
            ui.box('overview', height='200px', order=3),
            ui.box('overview', order=3),
        ),
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_dollars),
        plot_type='area',
        plot_color='$purple',
        plot_category='date',
        plot_value='revenue',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'revenue'],
            rows=[(next(revenue_overview_dates), next(revenue_overview_counts)) for i in range(30)],
            pack=True,
        ),
    )

    metric_dates = generate_time_series(30)
    metric_values = generate_random_walk()
    q.page['conversion_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=4),
            ui.box('stats1', order=1),
            ui.box('stats', order=1),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='area',
        plot_color='$red',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['revenue_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=5),
            ui.box('stats1', order=2),
            ui.box('stats', order=2),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='interval',
        plot_color='$pink',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['purchases_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=6),
            ui.box('stats1', order=3),
            ui.box('stats', order=3),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='area',
        plot_color='$purple',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['transactions_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=7),
            ui.box('stats2', order=1),
            ui.box('stats', order=4),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='area',
        plot_color='$red',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['order_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=8),
            ui.box('stats2', order=2),
            ui.box('stats', order=5),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='interval',
        plot_color='$pink',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['quantity_stats'] = ui.small_series_stat_card(
        box=ui.boxes(
            ui.box('body', height='150px', order=6),
            ui.box('stats2', order=3),
            ui.box('stats', order=6),
        ),
        title=next(sample_term),
        value=next(sample_percent),
        plot_type='area',
        plot_color='$purple',
        plot_category='date',
        plot_value='metric',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'metric'],
            rows=[(next(metric_dates), next(metric_values)) for i in range(30)],
            pack=True,
        ),
    )

    sales_days_1 = generate_time_series(15)
    sales_days_2 = generate_time_series(15)
    sales_amounts_1 = generate_random_walk(8000, 15000)
    sales_amounts_2 = generate_random_walk(8000, 15000)
    q.page['sales_details'] = ui.form_card(
        box=ui.boxes(
            ui.box('body', height='400px', order=9),
            ui.box('others', height='400px', order=1),
            ui.box('details', order=1),
        ),
        title=next(sample_title),
        items=[
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
            ]),
            ui.visualization(
                plot=ui.plot(
                    [ui.mark(type='interval', x_scale='time', x='=date', y='=sales', color='=site', y_min=0,
                             color_range='$purple $red')]),
                data=data(
                    fields=['site', 'date', 'sales'],
                    rows=[('Online', next(sales_days_1), next(sales_amounts_1)) for i in range(15)] + [
                        ('In-store', next(sales_days_2), next(sales_amounts_2)) for i in range(15)],
                    pack=True
                ),
            )
        ],
    )

    audience_days1 = generate_time_series(60)
    audience_days2 = generate_time_series(60)
    audience_hits1 = generate_random_walk(10000, 20000, 0.2)
    audience_hits2 = generate_random_walk(8000, 15000)

    q.page['visitor_details'] = ui.form_card(
        box=ui.boxes(
            ui.box('body', height='400px', order=10),
            ui.box('others', height='400px', order=2),
            ui.box('details', order=2),
        ),
        title=next(sample_title),
        items=[
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_amount)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
            ]),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='area', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$purple $pink'),
                    ui.mark(type='line', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$purple $pink'),
                ]),
                data=data(
                    fields=['site', 'date', 'visitors'],
                    rows=[('Online', next(audience_days1), next(audience_hits1)) for i in range(60)] + [
                        ('In-store', next(audience_days2), next(audience_hits2)) for i in range(60)],
                    pack=True
                ),
            )
        ],
    )

    q.page['earnings_reports'] = ui.stat_table_card(
        box=ui.boxes(
            ui.box('body', order=11),
            ui.box('others', order=3),
            ui.box('reports', order=1, size=3),
        ),
        title=next(sample_title),
        subtitle=next(sample_caption),
        columns=[next(sample_term), next(sample_term), next(sample_term), next(sample_term)],
        items=[ui.stat_table_item(
            label=next(sample_title),
            values=[next(sample_dollars), next(sample_percent), next(sample_percent)]) for i in range(8)
        ]
    )
    q.page['products_reports'] = ui.stat_list_card(
        box=ui.boxes(
            ui.box('body', order=12),
            ui.box('others', order=4),
            ui.box('reports', order=2),
        ),
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[ui.stat_list_item(label=next(sample_term), caption=next(sample_title), value=next(sample_dollars),
                                 icon=next(sample_icon), icon_color=next(sample_color)) for i in range(5)],
    )
    q.page['activity'] = ui.stat_list_card(
        box=ui.boxes(
            ui.box('body', order=13),
            ui.box('sidebar', size='0'),
            ui.box('sidebar', size='0'),
        ),
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[ui.stat_list_item(label=next(sample_term), caption=f'Order #{random.randint(1111, 9999)}',
                                 aux_value=f'{random.randint(1, 9)}hr', icon=next(sample_icon)) for i in range(10)],
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
