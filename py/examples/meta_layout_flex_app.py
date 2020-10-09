# Meta / Layout / Flex / App
#
# Allows building responsive layouts.
#
# Specify layout prop as flex and use card's box prop as a min width setter. Card's box prop
# now takes valid percentage value in range [0,1]. Please note that box will have no effect
# when card's content is longer that width specified.
#
# When no value is specified for box prop, card takes whole row.
# ---
from h2o_q import site, ui, data as base_data, graphics as g
from faker import Faker

from synth import FakePercent
from synth import FakeMultiCategoricalSeries
from synth import FakeScatter

import numpy as np
from bokeh.models import HoverTool
from bokeh.plotting import figure
from bokeh.resources import CDN
from bokeh.embed import file_html

from plotly import graph_objects as go
from plotly import io as pio

import altair
from vega_datasets import data

page = site['/demo']

page['meta'] = ui.meta_card(box='', layout='flex')

page['nav'] = ui.top_nav_card(
    box='',
    header=ui.top_nav_header(title='My app', subtitle='Try it, you will not regret'),
    items=[
        ui.command(name='#menu/spam', label='Spam', icon='Inbox'),
        ui.command(name='#menu/ham', label='Ham', icon='EatDrink'),
        ui.command(name='#menu/eggs', label='Eggs', icon='CollegeFootball'),
        ui.command(name='#menu/rum', label='Rum', icon='CollegeFootball'),
        ui.command(name='#menu/Gum', label='Gum', icon='CollegeFootball'),
        ui.command(name='#menu/salami', label='Salami', icon='CollegeFootball'),
        ui.command(name='#menu/pepper', label='Pepper', icon='CollegeFootball'),
        ui.command(name='#about', label='About', icon='FeedbackRequestSolid'),
    ]
)
page['side'] = ui.side_nav_card(box='', items=[
    ui.nav_group('Menu', items=[
          ui.nav_item(name='#menu/spam', label='Spam'),
          ui.nav_item(name='#menu/ham', label='Ham'),
          ui.nav_item(name='#menu/eggs', label='Eggs'),
    ]),
    ui.nav_group('Help', items=[
        ui.nav_item(name='#about', label='About'),
        ui.nav_item(name='#support', label='Support'),
    ])
  ],
  # header=ui.side_nav_header(title='My app', subtitle='Try it, you will not regret')
)

fake = Faker()
f = FakePercent()

# Gauges
val, pc = f.next()
page['gauge1'] = ui.wide_gauge_stat_card(
    box='1 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
)
val, pc = f.next()
page['gauge2'] = ui.wide_gauge_stat_card(
    box='2 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
)
val, pc = f.next()
page['gauge3'] = ui.wide_gauge_stat_card(
    box='3 1',
    title=fake.cryptocurrency_name(),
    value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    plot_color='$red',
    progress=pc,
    data=dict(foo=val, bar=pc),
)

# Plots
n = 10
k = 5
f = FakeMultiCategoricalSeries(groups=k)
v = page.add('plot1', ui.plot_card(
    box='1 2',
    title='Intervals, stacked',
    data=base_data('country product price', n * k),
    plot=ui.plot([ui.mark(type='interval', x='=price', y='=product', color='=country', stack='auto', y_min=0)])
))
v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]


def create_fake_row(g, f, n):
    return [(g, x, y) for x, y in [f.next() for _ in range(n)]]


n = 30
f1, f2, f3 = FakeScatter(), FakeScatter(), FakeScatter()
v = page.add('plot2', ui.plot_card(
    box='2 2',
    title='Point, groups',
    data=base_data('product price performance', n * 3),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', color='=product', shape='circle')])
))

v.data = create_fake_row('G1', f1, n) + create_fake_row('G2', f1, n) + create_fake_row('G3', f1, n)

# Table
_id = 0


class Issue:
    def __init__(self, text: str, status: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0


# Create some issues
issues = [Issue(text=fake.sentence(), status='Open') for i in range(12)]

columns = [
    ui.table_column(name='text', label='Issue'),
    ui.table_column(name='status', label='Status'),
    ui.table_column(name='views', label='Views'),
]

page['table'] = ui.form_card(box='1 3', items=[ui.table(
          name='issues',
          columns=columns,
          rows=[ui.table_row(name=issue.id, cells=[issue.text, issue.status, str(issue.views)]) for issue in issues],
          multiple=False)]
        )

# Form
page['form'] = ui.form_card(box='1 4', items=[
        ui.text_l(content='Sample form'),
        ui.stepper(name='stepper', items=[
            ui.step(label='Step 1', icon='MailLowImportance'),
            ui.step(label='Step 2', icon='TaskManagerMirrored'),
            ui.step(label='Step 3', icon='Cafe'),
        ]),
        ui.textbox(name='textbox', label='Textbox'),
        ui.file_upload(name='file_upload', label='File upload', height='200px'),
        ui.buttons(items=[ui.button(name='show_inputs', label='Submit', primary=True)], justify='end'),
])

n = 10
k = 5
f = FakeMultiCategoricalSeries(groups=k)
v = page.add('example', ui.plot_card(
    box='2 4',
    title='Intervals, theta, stacked',
    data=base_data('country product price', n * k),
    plot=ui.plot([
        ui.mark(coord='theta', type='interval', x='=product', y='=price', color='=country', stack='auto', y_min=0)])
))
v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]

page['graphics'] = ui.graphics_card(
    box='1 5 1', view_box='0 0 100 100', width='100%', height='100%',
    stage=g.stage(
        face=g.circle(cx='50', cy='50', r='45', fill='#111', stroke_width='2px', stroke='#f55'),
    ),
    scene=g.scene(
        hour=g.rect(x='47.5', y='12.5', width='5', height='40', rx='2.5', fill='#333', stroke='#555'),
        min=g.rect(x='48.5', y='12.5', width='3', height='40', rx='2', fill='#333', stroke='#555'),
        sec=g.line(x1='50', y1='50', x2='50', y2='16', stroke='#f55', stroke_width='1px'),
    )
)

n = 500
x = 2 + 2 * np.random.standard_normal(n)
y = 2 + 2 * np.random.standard_normal(n)
p = figure(
    match_aspect=True,
    tools="wheel_zoom,reset",
    background_fill_color='#440154',
    sizing_mode='stretch_both'
)
p.grid.visible = False
r, bins = p.hexbin(x, y, size=0.5, hover_color="pink", hover_alpha=0.8)
p.circle(x, y, color="white", size=1)
p.add_tools(HoverTool(
    tooltips=[("count", "@c"), ("(q,r)", "(@q, @r)")],
    mode="mouse",
    point_policy="follow_mouse",
    renderers=[r]
))

# Bokeh example
# Export html for our frame card
html = file_html(p, CDN, "plot")

page['bokeh'] = ui.frame_card(
    box='2 5',
    title='Hexbin for 500 points',
    content=html,
)

# Altair example
spec = altair.Chart(data.cars()).mark_circle(size=60).encode(
    x='Horsepower',
    y='Miles_per_Gallon',
    color='Origin',
    tooltip=['Name', 'Origin', 'Horsepower', 'Miles_per_Gallon']
).properties(width='container', height='container').interactive().to_json()

page['altair'] = ui.vega_card(
    box='3 5',
    title='Altair Example',
    specification=spec,
)

# Plotly
fig = go.Figure(data=go.Scatter(
        x=np.random.rand(n),
        y=np.random.rand(n),
        mode='markers',
        marker=dict(size=(8 * np.random.rand(n)) ** 2,
                    color=np.random.rand(n)),
        opacity=0.8,
    ))
_ = fig.update_layout(
    margin=dict(l=10, r=10, t=10, b=10),
    paper_bgcolor='rgb(255, 255, 255)',
    plot_bgcolor='rgb(255, 255, 255)',
)
config = {'scrollZoom': True,
          'showLink': True,
          'displayModeBar': True,
          }
html = pio.to_html(fig, validate=False, include_plotlyjs='cdn', config=config)

page['plotly'] = ui.frame_card(box='1 6', title='', content=html)

page.save()
