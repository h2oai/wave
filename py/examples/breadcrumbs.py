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
    blurb_items = [ui.button(name='#submenu', label='Go to submenu', link=True)]
    blurb_title = 'Welcome to Menu'
    breadcrumbs = [ui.breadcrumb(name='#menu', label='Menu')]

    if q.args['#'] == 'menu':
        blurb_items = [ui.button(name='#submenu', label='Go to submenu', link=True)]
        blurb_title = 'Welcome to Menu!'
        breadcrumbs = [
            ui.breadcrumb(name='#menu', label='Menu'),
        ]
    elif q.args['#'] == 'submenu':
        blurb_items = [ui.button(name='#subsubmenu', label='Go to subsubmenu', link=True)]
        blurb_title = 'Welcome to Submenu!'
        breadcrumbs = [
            ui.breadcrumb(name='#menu', label='Menu'),
            ui.breadcrumb(name='#submenu', label='Submenu'),
        ]
    elif q.args['#'] == 'subsubmenu':
        blurb_items = [ui.text('You cannot go deeper, click on Breadcrumbs above to navigate back')]
        blurb_title = 'Welcome to Subsubmenu!'
        breadcrumbs = [
            ui.breadcrumb(name='#menu', label='Menu'),
            ui.breadcrumb(name='#submenu', label='Submenu'),
            ui.breadcrumb(name='#subsubmenu', label='Subsubmenu'),
        ]

    q.page['blurb'] = ui.form_card(box='1 2 3 2', title=blurb_title, items=blurb_items)
    q.page['breadcrumbs'] = ui.breadcrumbs_card(box='1 1 3 1', items=breadcrumbs)

    await q.page.save()
