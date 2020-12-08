# Breadcrumbs
# #Breadcrumbs should be used as a navigational aid in your app or site.
# They indicate the current page’s location within a hierarchy and help
# the user understand where they are in relation to the rest of that hierarchy.
# They also afford one-click access to higher levels of that hierarchy.
# Breadcrumbs are typically placed, in horizontal form, under the masthead
# or #navigation of an experience, above the primary content area.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if '#' in q.args:
        hash_ = q.args['#']
        q.page['breadcrumbs'] = ui.form_card(box='1 1 2 2', items=[
            ui.text(f'#={hash_}'),
            ui.button(name='show_breadcrumbs', label='Back', primary=True),
        ])
    else:
        q.page['breadcrumbs'] = ui.breadcrumbs_card(
            box='1 1 4 1',
            items=[
                ui.breadcrumb(name='#menu1', label='Menu 1'),
                ui.breadcrumb(name='#menu2', label='Menu 2'),
                ui.breadcrumb(name='#menu3', label='Menu 3'),
            ],
        )
    await q.page.save()
