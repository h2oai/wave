# App Template / Simple
#
# Responsive starter template for building a simple Q App.
#
# This layout suits best for apps that gather data, perform analysis and
# show resulting data visualizations.
#
# The template has 3 main parts: landing page, data collection, visualization.
#
# Feel free to add or remove anything that doesn't suit your needs.
# ---

from h2o_q import Q, listen, ui, data
from synth import FakeMultiCategoricalSeries, FakeScatter


home_page = ui.landing_page_card(
    header='AI like never before',
    box='1 1',
    subheader='''
    Times when you needed a dedicated team of web developersm, DevOps people and who knows who else
    are finally over. Build a professionally looking web with your data visualizations in a few hours
    instead of months. Qd is finally here!
    ''',
    image='/app.png',
    call_to_action_button=ui.call_to_action_button(name='#new-analysis', label='Let\'s get started!'),
    features=[
      ui.feature(
        icon='SpeedHigh',
        title='Develop Quickly',
        description='''
        Take advantage of fast prototyping using Python or R
        language and create beautiful web dashboards in a few hours!
        '''),
      ui.feature(
        icon='People',
        title='Collaborate easily',
        description='''
        Instant control over every connected web browser using a simple and intuitive programming model.
        '''
        ),
      ui.feature(
        icon='Rocket',
        title='Deploy Instantly',
        description='Easily share your apps with end-users, get feedback, improve and iterate.'
        ),
    ]
)
tab_card = ui.tab_card(
  box='1 1',
  chromeless=True,
  value='tab_intervals',
  items=[
      ui.tab(name='tab_intervals', label='Intervals', icon='StackedLineChart'),
      ui.tab(name='tab_point_groups', label='Point Groups', icon='DiagnosticDataBarTooltip')
  ],
)


def init_app(q: Q):
    q.page['meta'] = ui.meta_card(box='', layout='flex', title='My App')
    q.page['nav'] = ui.top_nav_card(
      box='',
      header=ui.top_nav_header(title='My app', subtitle='Try it, you will not regret'),
      items=[
        ui.command(name='#home', label='Home', icon='Home'),
        ui.command(name='#new-analysis', label='New Analysis', icon='AnalyticsView'),
      ]
    )


# Plots
def create_fake_plot1(q: Q, box: str, key: str):
    n = 10
    k = 5
    f = FakeMultiCategoricalSeries(groups=k)
    v = q.page.add(key, ui.plot_card(
        box=box,
        title='Intervals, stacked',
        data=data('country product price', n * k),
        plot=ui.plot([ui.mark(type='interval', x='=price', y='=product', color='=country', stack='auto', y_min=0)])
    ))
    v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]


def create_fake_row(g, f, n):
    return [(g, x, y) for x, y in [f.next() for _ in range(n)]]


def create_fake_plot2(q: Q, box: str, key: str):
    n = 30
    f1 = FakeScatter()
    v = q.page.add(key, ui.plot_card(
        box=box,
        title='Point, groups',
        data=data('product price performance', n * 3),
        plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', color='=product', shape='circle')])
    ))

    v.data = create_fake_row('G1', f1, n) + create_fake_row('G2', f1, n) + create_fake_row('G3', f1, n)


def get_tab_content(q: Q):
    if q.args.tab_point_groups:
        create_fake_plot2(q, '1 2', 'plot4')
        create_fake_plot2(q, '2 2', 'plot2')
        tab_card.value = 'tab_intervals'
    else:
        create_fake_plot1(q, '1 2', 'plot1')
        create_fake_plot1(q, '2 2', 'plot3')
        tab_card.value = 'tab_point_groups'


async def main(q: Q):
    if not q.client.initialized:
        init_app(q)
        q.client.initialized = True

    # TODO: Find a better way how to tear down all cards and draw new ones.
    del q.page['main-content']
    del q.page['tabs']
    del q.page['plot1']
    del q.page['plot2']
    del q.page['plot3']
    del q.page['plot4']

    hash = q.args['#']
    if hash == 'home':
        q.page['main-content'] = home_page
    elif hash == 'new-analysis':
        q.page['main-content'] = ui.form_card(box='1 1 800px', items=[
          ui.stepper(
            name='icon-stepper',
            items=[
                ui.step(label='Title', icon='MailLowImportance'),
                ui.step(label='Name', icon='TaskManagerMirrored'),
                ui.step(label='Surname', icon='Cafe'),
            ]),
          ui.textbox(name='title', label='My title is...'),
          ui.buttons(justify='end', items=[
            ui.button(name='wizard_step_2', label='Next', primary=True)
          ])
        ])
    elif q.args.wizard_step_2:
        q.page['main-content'] = ui.form_card(box='1 1 800px', items=[
          ui.stepper(
            name='icon-stepper',
            items=[
                ui.step(label='Title', icon='MailLowImportance', done=True),
                ui.step(label='Name', icon='TaskManagerMirrored'),
                ui.step(label='Surname', icon='Cafe'),
            ]),
          ui.textbox(name='nickname', label='My name is...'),
          ui.buttons(justify='end', items=[
            ui.button(name='wizard_step_2', label='Previous'),
            ui.button(name='wizard_step_3', label='Next', primary=True)
          ])
          ])
    elif q.args.wizard_step_3:
        q.page['main-content'] = ui.form_card(box='1 1 800px', items=[
          ui.stepper(
            name='icon-stepper',
            items=[
                ui.step(label='Title', icon='MailLowImportance', done=True),
                ui.step(label='Name', icon='TaskManagerMirrored', done=True),
                ui.step(label='Surname', icon='Cafe')
            ]),
          ui.textbox(name='surname', label='My surname is...'),
          ui.buttons(justify='end', items=[
            ui.button(name='#new-analysis/step2', label='Previous'),
            ui.button(name='#results', label='Finish', primary=True)
          ])
          ])
    elif hash == 'results' or q.args.tab_intervals or q.args.tab_point_groups:
        q.page['tabs'] = tab_card
        get_tab_content(q)
    else:
        q.page['main-content'] = home_page
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
