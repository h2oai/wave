
from h2o_wave import site, ui
disable_animations = '''
* {
    -webkit-animation: none !important;
    -moz-animation: none !important;
    -o-animation: none !important;
    -ms-animation: none !important;
    animation: none !important
}
'''
page = site['/1']
page.drop() # Drop any previous pages.
page['meta'] = ui.meta_card(box='', stylesheet=ui.inline_stylesheet(disable_animations))
page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.choice_group(name='choice_group', label='Choice group', choices=[
        ui.choice('A', 'Option A'),
        ui.choice('B', 'Option B'),
        ui.choice('C', 'Option C'),
    ])
])

page.save()
    