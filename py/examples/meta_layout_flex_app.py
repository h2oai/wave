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
from h2o_q import site, ui, data
from faker import Faker

from synth import FakePercent
from synth import FakeMultiCategoricalSeries
from synth import FakeScatter

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
  header=ui.side_nav_header(title='My app', subtitle='Try it, you will not regret')
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
    data=data('country product price', n * k),
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
    data=data('product price performance', n * 3),
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


page.save()
