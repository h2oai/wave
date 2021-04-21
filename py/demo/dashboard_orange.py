from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_orange_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('control'),
                ui.zone('top', direction=ui.ZoneDirection.ROW, size='385px', zones=[
                    ui.zone('top_left', direction=ui.ZoneDirection.ROW, size='66%'),
                    ui.zone('top_right'),
                ]),
                ui.zone('middle', direction=ui.ZoneDirection.ROW, size='400px'),
                ui.zone('bottom', direction=ui.ZoneDirection.ROW, size='200px'),
                ui.zone('footer'),
            ]
        )
    ])

    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Orange Dashboard',
                                      nav=global_nav)

    q.page['section'] = ui.section_card(
        box='control',
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.checkbox(name='search', label=next(sample_title), value=True),
            ui.dropdown(name='distribution', label='', value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.dropdown(name='source', label='', value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.dropdown(name='range', label='', value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
        ],
    )

    user_days = generate_time_series(30)
    user_counts = generate_random_walk()

    q.page['unique_impressions'] = ui.tall_series_stat_card(
        box='top_left',
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_percent),
        plot_type='interval',
        plot_color='$orange',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(60)],
            pack=True,
        ),
    )

    q.page['unique_clicks'] = ui.tall_series_stat_card(
        box='top_left',
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_title),
        plot_type='interval',
        plot_color='$amber',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(60)],
            pack=True,
        ),
    )

    q.page['popularity'] = ui.wide_series_stat_card(
        box='top_right',
        title=next(sample_term),
        value=next(sample_percent),
        aux_value=next(sample_amount),
        plot_type='area',
        plot_color='$tangerine',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(60)],
            pack=True,
        ),
    )
    q.page['search_traffic'] = ui.wide_series_stat_card(
        box='top_right',
        title=next(sample_term),
        value=next(sample_percent),
        aux_value=next(sample_dollars),
        plot_type='interval',
        plot_color='$tangerine',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(60)],
            pack=True,
        ),
    )
    q.page['social_media_traffic'] = ui.wide_series_stat_card(
        box='top_right',
        title=next(sample_title),
        value='68K',
        aux_value='Down 6%',
        plot_type='area',
        plot_color='$tangerine',
        plot_category='date',
        plot_value='users',
        plot_zero_value=0,
        plot_data=data(
            fields=['date', 'users'],
            rows=[(next(user_days), next(user_counts)) for i in range(60)],
            pack=True,
        ),
    )

    audience_days1 = generate_time_series(60)
    audience_days2 = generate_time_series(60)
    audience_hits1 = generate_random_walk(10000, 20000, 0.2)
    audience_hits2 = generate_random_walk(8000, 15000)

    q.page['stats'] = ui.form_card(
        box='middle',
        title=next(sample_title),
        items=[
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_amount)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_amount)),
                ui.stat(label=next(sample_term), value=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_percent)),
            ], justify=ui.StatsJustify.BETWEEN, inset=True),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='area', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$orange $amber', curve=ui.MarkCurve.SMOOTH),
                    ui.mark(type='line', x_scale='time', x='=date', y='=visitors', color='=site',
                            color_range='$orange $amber', curve=ui.MarkCurve.SMOOTH),
                ]),
                data=data(
                    fields=['site', 'date', 'visitors'],
                    rows=[('Online', next(audience_days1), next(audience_hits1)) for i in range(60)] + [
                        ('In-store', next(audience_days2), next(audience_hits2)) for i in range(60)],
                    pack=True
                ),
                height='240px',
            )
        ],
    )

    q.page['click_through'] = ui.large_stat_card(
        box='bottom',
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_dollars),
        caption=' '.join([next(sample_caption) for i in range(3)]),
    )

    q.page['view_through'] = ui.large_stat_card(
        box='bottom',
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_dollars),
        caption=' '.join([next(sample_caption) for i in range(3)]),
    )
    q.page['total_conversions'] = ui.large_stat_card(
        box='bottom',
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_dollars),
        caption=' '.join([next(sample_caption) for i in range(3)]),
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
