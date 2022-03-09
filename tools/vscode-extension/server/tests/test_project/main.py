from h2o_wave import Q, ui, main, app, data
import utils, utils2
from module import func

# Test if dotted import will not break it.
from module.func import sth

local = 'local_ref'
@app('/')
async def serve(q: Q):
    ui.plot_card(name='current_file_name', events=['current_file'])
    ui.plot_card(name='current_file_name_multi_events', events=['current_file', 'event2'])
		# This comment might break it
    ui.zone('with_comment')
		# Nested zones
		ui.layout(
        # If the viewport width >= 768:
        breakpoint='m',
        zones=[
            # Use remaining space for body
            ui.zone('current_file', direction=ui.ZoneDirection.ROW, zones=[
                # 250px wide sidebar
                ui.zone('positional_arg', size='250px'),
            ]),
        ]
    ),
    ui.button(name='current_file')

    q.client.current_file = ''
    q.app.current_file = ''
    q.user.current_file = ''

    q.client['str_key']
    q.app['str_key']
    q.user['str_key']
    q.args.

    # These should not be included in completions.
    q.client
    q.client[q.client.aa]
    q.app
    q.app[q.app.aa]
    q.user
    q.user[q.user.aa]
    ui.plot_card(name=f'dont_include_name', events=[f'dont_include'])
    ui.zone(name=f'dont_include')
    ui.button(name=f'dont_include')
    ui.button(name='#dont_include')
    ui.plot_card(name='dont' + 'include' + 'name', events=['dont' + 'include'])
    ui.zone(name='dont' + 'include')
    ui.button(name='dont' + 'include')
    func(name='dont_include')
