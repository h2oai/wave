# Plot / Vega
# Place Vegalite plots in a flexible layout.
# ---
from h2o_wave import site, ui, data

page = site['/demo']
page.drop()

page['meta'] = ui.meta_card(box='', layouts=[
    ui.layout(
        breakpoint='xs',
        width='100%',
        zones=[
            ui.zone('top', size='300px', direction=ui.ZoneDirection.ROW, zones=[
                ui.zone('top_left', size='75%'),
                ui.zone('top_right', size='1'),
            ]),
            ui.zone('bottom', size='500px', direction=ui.ZoneDirection.ROW, zones=[
                ui.zone('bottom_left', size='1'),
                ui.zone('bottom_center', size='2'),
                ui.zone('bottom_right', size='3'),
            ]),
        ]
    )
])

plot_spec = '''
{
  "description": "A simple bar plot with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''

plot_data = data(fields=["a", "b"], rows=[
    ["A", 28], ["B", 55], ["C", 43],
    ["D", 91], ["E", 81], ["F", 53],
    ["G", 19], ["H", 87], ["I", 52]
], pack=True)

page.add('top_left', ui.vega_card(
    box='top_left',
    title='Plot',
    specification=plot_spec,
    data=plot_data,
))
page.add('top_right', ui.vega_card(
    box='top_right',
    title='Plot',
    specification=plot_spec,
    data=plot_data,
))
page.add('bottom_left', ui.vega_card(
    box='bottom_left',
    title='Plot',
    specification=plot_spec,
    data=plot_data,
))
page.add('bottom_center', ui.vega_card(
    box='bottom_center',
    title='Plot',
    specification=plot_spec,
    data=plot_data,
))
page.add('bottom_right', ui.vega_card(
    box='bottom_right',
    title='Plot',
    specification=plot_spec,
    data=plot_data,
))

page.save()
