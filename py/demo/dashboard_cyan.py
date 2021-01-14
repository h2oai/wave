from h2o_wave import ui, data, Q
from .common import global_nav
from .synthetic_data import *


async def show_cyan_dashboard(q: Q):
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xl',
            width='1200px',
            zones=[
                ui.zone('header'),
                ui.zone('body', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('content', size='75%', zones=[
                        ui.zone('top', size='600px'),
                        ui.zone('middle', size='300px', direction=ui.ZoneDirection.ROW, zones=[
                            ui.zone('middle_left'),
                            ui.zone('middle_right'),
                        ]),
                        ui.zone('bottom', size='500px'),
                    ]),
                    ui.zone('sidebar', size='25%'),
                ]),
                ui.zone('footer'),
            ]
        )
    ])

    q.page['header'] = ui.header_card(box='header', title='H2O Wave Demo', subtitle='Cyan Dashboard',
                                      nav=global_nav)
    q.page['section'] = ui.section_card(
        box=ui.box('top', order=1, size=0),
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[
            ui.toggle(name='when', label=next(sample_term), value=False),
            ui.toggle(name='what', label=next(sample_term), value=True),
        ]
    )

    trend_date = generate_time_series(300)
    trend_price = generate_random_walk(2000, 8000, 0.2)
    q.page['sales_overview'] = ui.form_card(
        box=ui.box('top', order=2),
        title=next(sample_title),
        items=[
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_percent), caption=next(sample_dollars)),
                ui.stat(label=next(sample_term), value=next(sample_dollars), caption=next(sample_percent)),
                ui.stat(label=next(sample_term), value=next(sample_amount), caption=next(sample_percent)),
                ui.stat(label=next(sample_term), caption=next(sample_caption)),
            ], inset=True),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='area', x_scale='time', x='=date', y='=price', color='$cyan'),
                ]),
                data=data(
                    fields=['date', 'price'],
                    rows=[(next(trend_date), next(trend_price)) for i in range(120)],
                    pack=True
                ),
                height='350px',
            ),
        ],
    )

    q.page['ticket_sales'] = ui.form_card(
        box=ui.box('middle_left'),
        title=next(sample_title),
        items=[
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='interval', x_scale='time', x='=date', y='=price', color='$cyan'),
                ]),
                data=data(
                    fields=['date', 'price'],
                    rows=[(next(trend_date), next(trend_price)) for i in range(120)],
                    pack=True
                ),
                height='150px',
            ),
            ui.stats(items=[
                ui.stat(label=next(sample_term), value=next(sample_percent)) for i in range(4)
            ], justify='between', inset=True),
        ],
    )
    q.page['events_hosted'] = ui.wide_bar_stat_card(
        box=ui.box('middle_right', order=1),
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        progress=random.random(),
        plot_color='$cyan',
    )
    q.page['points_earned'] = ui.wide_bar_stat_card(
        box=ui.box('middle_right', order=2),
        title=next(sample_title),
        value=next(sample_amount),
        aux_value=next(sample_percent),
        progress=random.random(),
        plot_color='$cyan',
    )
    q.page['points_given'] = ui.wide_bar_stat_card(
        box=ui.box('middle_right', order=3),
        title=next(sample_title),
        value=next(sample_dollars),
        aux_value=next(sample_percent),
        progress=random.random(),
        plot_color='$cyan',
    )
    session_count = generate_random_walk(1000, 8000)
    q.page['event_poll'] = ui.form_card(
        box='bottom',
        title=next(sample_title),
        items=[
            ui.inline(items=[
                ui.dropdown(name='region', label=next(sample_term), value='option0', choices=[
                    ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
                ]),
                ui.dropdown(name='age', label=next(sample_term), value='option0', choices=[
                    ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
                ]),
                ui.dropdown(name='response', label=next(sample_term), value='option0', choices=[
                    ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
                ]),
            ]),
            ui.visualization(
                plot=ui.plot([
                    ui.mark(type='interval', x='=sessions', y='=channel', y_min=0, color='$cyan')
                ]),
                data=data(
                    fields=['channel', 'sessions'],
                    rows=[(next(sample_term), next(session_count)) for i in range(10)],
                    pack=True,
                ),
                height='350px',
            ),
        ],

    )
    q.page['sidebar_section'] = ui.section_card(
        box=ui.box('sidebar', order=1, size='0'),
        title=next(sample_title),
        subtitle=next(sample_caption),
    )
    q.page['filter'] = ui.form_card(
        box=ui.box('sidebar', height='335px', order=2),
        title=next(sample_title),
        items=[
            ui.dropdown(name='region', label=next(sample_term), value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.dropdown(name='age', label=next(sample_term), value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.dropdown(name='response', label=next(sample_term), value='option0', choices=[
                ui.choice(name=f'option{i}', label=next(sample_term)) for i in range(5)
            ]),
            ui.checkbox(name='plural', label=next(sample_title), value=True),
            ui.checkbox(name='annual', label=next(sample_title), value=True),
        ],
    )

    event_icon = generate_random_choice(['MusicInCollection', 'Video', 'TVMonitor'])

    q.page['upcoming_events'] = ui.stat_list_card(
        box=ui.box('sidebar', order=3),
        title=next(sample_title),
        subtitle=next(sample_caption),
        items=[ui.stat_list_item(label=next(sample_title), caption=next(sample_caption),
                                 aux_value=f'{random.randint(1, 59)}m',
                                 icon=next(event_icon)) for i in range(10)],
    )

    q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')

    await q.page.save()
