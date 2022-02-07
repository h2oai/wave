from h2o_wave import Q


def func(q: Q):
    q.client.from_import = ''
    q.app.from_import = ''
    q.user.from_import = ''
		ui.button(name='from_import')
    ui.plot_card(events=['from_import'])
    ui.zone(name='from_import')
