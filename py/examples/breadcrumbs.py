# Breadcrumbs
# Breadcrumbs should be used as a navigational aid in your app or site.
# They indicate the current page’s location within a hierarchy and help
# the user understand where they are in relation to the rest of that hierarchy.
# They also afford one-click access to higher levels of that hierarchy. 
# Breadcrumbs are typically placed, in horizontal form, under the masthead 
# or navigation of an experience, above the primary content area.
# ---
from h2o_q import site, ui

page = site['/demo']

page['breadcrumbs'] = ui.breadcrumbs_card(
    box='1 1 4 -1',
    items=[
        ui.breadcrumb_item(name='#menu1', label='Menu 1'),
        ui.breadcrumb_item(name='#menu2', label='Menu 2'),
        ui.breadcrumb_item(name='#menu3', label='Menu 3'),
    ],
)

page.save()
