# Form / Template
# Use a template component to render dynamic content using a #HTML #template.
# #form
# ---
from h2o_wave import site, pack, ui

page = site['/demo']
page.drop()

menu = '''
<ol>
{{#each dishes}}
<li><strong>{{name}}</strong> costs {{price}}</li>
{{/each}}
</ol
'''

c = page.add('template_example', ui.form_card(
    box='1 1 2 2',
    items=[
        ui.template(
            content=menu,
            data=pack(dict(dishes=[
                dict(name='Spam', price='$2.00'),
                dict(name='Ham', price='$3.45'),
                dict(name='Eggs', price='$1.75'),
            ]))
        )
    ]))
page.save()
