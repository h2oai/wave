from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_red_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('title'),
                ui.zone('top', direction=ui.ZoneDirection.ROW, size='385px', zones=[
                    ui.zone('top_left'),
                    ui.zone('top_right', zones=[
                        ui.zone('top_right_top', direction=ui.ZoneDirection.ROW, size='1'),
                        ui.zone('top_right_bottom', size='1'),
                    ]),
                ]),
                ui.zone('middle', direction=ui.ZoneDirection.ROW, size='385px'),
                ui.zone('bottom', direction=ui.ZoneDirection.ROW, size='385px', zones=[
                    ui.zone('bottom_left'),
                    ui.zone('bottom_right', size='66%'),
                ]),
                ui.zone('footer'),
            ]
        )
    ])

    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Red Dashboard',
                                      nav=global_nav)
    q.page['title'] = ui.section_card(
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

    audience_days1 = generate_time_series(60)
    audience_days2 = generate_time_series(60)
    audience_hits1 = generate_random_walk(10000, 20000, 0.2)
    audience_hits2 = generate_random_walk(8000, 15000)

    q.page['audience_metrics'] = ui.form_card(
        box='top_left',
        title=next(sample_title),
        items=[
            ui.text(next(sample_caption)),
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_amount)),
                ui.stat(label=next(sample_term), value=next(sample_amount)),
            ]),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='area', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$red $tangerine'),
                    ui.mark(type='line', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$red $tangerine'),
                ]),
                data=data(
                    fields=['site', 'date', 'visitors'],
                    rows=[('A', next(audience_days1), next(audience_hits1)) for i in range(60)] + [
                        ('B', next(audience_days2), next(audience_hits2)) for i in range(60)],
                    pack=True
                ),
                height='210px',
            )
        ],
    )

    bounce_days = generate_time_series(30)
    bounce_rates = generate_random_walk()
    q.page['bounce_rate'] = ui.tall_series_stat_card(
        box='top_right_top',
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_term),
        plot_type='area',
        plot_color='$red',
        plot_category='date',
        plot_value='bounce_rate',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'bounce_rate'],
            rows=[(next(bounce_days), next(bounce_rates)) for i in range(30)],
            pack=True,
        ),
    )

    user_days = generate_time_series(30)
    user_counts = generate_random_walk()
    q.page['total_users'] = ui.tall_series_stat_card(
        box='top_right_top',
        title=next(sample_term),
        value=next(sample_dollars),
        aux_value=next(sample_term),
        plot_type='interval',
        plot_color='$tangerine',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(20)],
            pack=True,
        ),
    )

    session_days = generate_time_series(60)
    session_counts = generate_random_walk()
    q.page['all_sessions'] = ui.tall_series_stat_card(
        box='top_right_bottom',
        title=next(sample_title),
        value='18,976 Unique',
        aux_value=next(sample_caption),
        plot_type='interval',
        plot_color='$red',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(session_days), next(session_counts)) for i in range(60)],
            pack=True,
        ),
    )

    q.page['page_views'] = ui.stat_list_card(
        box='middle',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.stat_list_item(label=next(sample_title), caption=next(sample_caption), value=next(sample_dollars),
                              aux_value=next(sample_term), value_color=next(sample_color)) for i in range(5)
        ],
    )

    session_count = generate_random_walk(1000, 8000)
    session_source = generate_sequence(['Search', 'Email', 'Referral', 'Social', 'Other'])

    q.page['dist_by_channel'] = ui.plot_card(
        box='middle',
        title=next(sample_title),
        data=data(
            fields=['site', 'channel', 'sessions'],
            rows=[('A', next(session_source), next(session_count)) for i in range(5)] + [
                ('B', next(session_source), next(session_count)) for i in range(5)],
            pack=True,
        ),
        plot=ui.plot([
            ui.mark(coord='theta', type='interval', x='=site', y='=sessions', color='=channel', stack='auto', y_min=0,
                    color_range='$amber $orange $tangerine $red $pink')
        ])
    )
    q.page['sessions_by_channel'] = ui.plot_card(
        box='middle',
        title=next(sample_title),
        data=data(
            fields=['channel', 'sessions'],
            rows=[(next(sample_term), next(session_count)) for i in range(10)],
            pack=True,
        ),
        plot=ui.plot([
            ui.mark(type='interval', x='=sessions', y='=channel', y_min=0, color='$red')
        ])
    )

    q.page['acquisitions'] = ui.form_card(
        box='bottom_left',
        title=next(sample_title),
        items=[
            ui.text(next(sample_caption)),
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_percent), icon=next(sample_icon),
                        icon_color=next(sample_color)),
                ui.stat(label=next(sample_term), value=next(sample_percent), icon=next(sample_icon),
                        icon_color=next(sample_color)),
            ]),
        ],
    )
    q.page['sessions'] = ui.form_card(
        box='bottom_left',
        title=next(sample_title),
        items=[
            ui.text(next(sample_caption)),
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_percent), icon=next(sample_icon),
                        icon_color=next(sample_color)),
                ui.stat(label=next(sample_term), value=next(sample_percent), icon=next(sample_icon),
                        icon_color=next(sample_color)),
            ]),
        ],
    )
    q.page['pages'] = ui.stat_table_card(
        box='bottom_right',
        title=next(sample_title),
        subtitle=next(sample_caption),
        columns=[next(sample_term), next(sample_term), next(sample_term), next(sample_term)],
        items=[
            ui.stat_table_item(label=next(sample_term), caption=next(sample_title),
                               values=[next(sample_dollars), next(sample_percent), next(sample_percent)],
                               icon=next(sample_icon), icon_color=next(sample_color)) for i in range(5)
        ]
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
