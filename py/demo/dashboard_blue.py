from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_blue_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('title'),
                ui.zone('top', direction=ui.ZoneDirection.ROW, size='200px'),
                ui.zone('middle', direction=ui.ZoneDirection.ROW, size='385px'),
                ui.zone('bottom', direction=ui.ZoneDirection.ROW, size='385px'),
                ui.zone('footer'),
            ]
        )
    ])

    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Blue Dashboard',
                                      nav=global_nav)

    q.page['title'] = ui.section_card(
        box='title',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.toggle(name='search', label=next(sample_term), value=True),
            ui.dropdown(name='distribution', label='', value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.date_picker(name='target_date', label='', value='2020-12-25'),
        ],
    )

    sales_dates = generate_time_series(1000)
    sales_values = generate_random_walk()

    q.page['total_quantity'] = ui.tall_series_stat_card(
        box=ui.box('top', order=1),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_title),
        plot_type='area',
        plot_color='$blue',
        plot_category='date',
        plot_value='quantity',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'quantity'],
            rows=[(next(sales_dates), next(sales_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['total_cost'] = ui.tall_series_stat_card(
        box=ui.box('top', order=2),
        title=next(sample_term),
        value=next(sample_amount),
        aux_value=next(sample_percent),
        plot_type='area',
        plot_color='$blue',
        plot_category='date',
        plot_value='cost',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'cost'],
            rows=[(next(sales_dates), next(sales_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['total_revenue'] = ui.tall_series_stat_card(
        box=ui.box('top', order=3),
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_title),
        plot_type='area',
        plot_color='$blue',
        plot_category='date',
        plot_value='revenue',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'revenue'],
            rows=[(next(sales_dates), next(sales_values)) for i in range(30)],
            pack=True,
        ),
    )
    q.page['total_profit'] = ui.tall_series_stat_card(
        box=ui.box('top', order=4),
        title=next(sample_term),
        value=next(sample_amount),
        aux_value=next(sample_title),
        plot_type='area',
        plot_color='$blue',
        plot_category='date',
        plot_value='profit',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'profit'],
            rows=[(next(sales_dates), next(sales_values)) for i in range(30)],
            pack=True,
        ),
    )

    ytd_revenue = generate_random_walk(0, 10000, 0.5)

    q.page['revenue_by_customer'] = ui.plot_card(
        box='middle',
        title=next(sample_title),
        data=data(
            fields=['channel', 'sessions'],
            rows=[(next(sample_term), next(ytd_revenue)) for i in range(10)],
            pack=True,
        ),
        plot=ui.plot([
            ui.mark(type='interval', x='=sessions', y='=channel', y_min=0, color='$blue')
        ])
    )

    months = generate_sequence(['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])

    q.page['ytd_revenue'] = ui.plot_card(
        box=ui.box(zone='middle', width='66%', order=2),
        title=next(sample_title),
        data=data(
            fields=['month', 'channel', 'revenue'],
            rows=[(next(months), 'Online', next(ytd_revenue)) for i in range(6)] + [
                (next(months), 'In-store', next(ytd_revenue)) for i in range(6)],
            pack=True),
        plot=ui.plot([ui.mark(type='interval', x='=month', y='=revenue', color='=channel', dodge='auto', y_min=0,
                              color_range='$cyan $blue')])
    )

    q.page['top_products'] = ui.stat_list_card(
        box='bottom',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.stat_list_item(label=next(sample_term), caption=next(sample_title), value=next(sample_dollars),
                              icon=next(sample_icon), icon_color=next(sample_color)) for i in range(5)
        ],
    )

    q.page['recent_earnings'] = ui.stat_table_card(
        box=ui.box(zone='bottom', width='66%', order=2),
        title=next(sample_title),
        subtitle=next(sample_caption),
        columns=['Date', 'Sales', 'Earnings', 'Taxes'],
        items=[
            ui.stat_table_item(
                label=next(sample_title), values=[next(sample_dollars), next(sample_percent), next(sample_amount)]
            ) for i in range(8)
        ]
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
