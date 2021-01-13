# Form
# Use a #form to collect data or show textual information.
# ---
from .synth import FakeCategoricalSeries
from h2o_wave import main, app, Q, ui, pack, data
import random

html = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''
menu = '''
<ol>
{{#each dishes}}
<li><strong>{{name}}</strong> costs {{price}}</li>
{{/each}}
</ol
'''
spec = '''
{
  "description": "A simple bar plot with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
'''
f = FakeCategoricalSeries()
n = 20


# Generate random datum between 1 and 100
def rnd():
    return random.randint(1, 100)


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 4 10', items=[
        ui.text_xl(content='Extra-large text, for headings.'),
        ui.text_l(content='Large text, for sub-headings.'),
        ui.text_m(content='Body text, for paragraphs and other content.'),
        ui.text_s(content='Small text, for small print.'),
        ui.text_xs(content='Extra-small text, for really small print.'),
        ui.separator(label='A separator sections forms'),
        ui.progress(label='A progress bar'),
        ui.progress(label='A progress bar'),
        ui.message_bar(type='success', text='Message bar'),
        ui.textbox(name='textbox', label='Textbox'),
        ui.label(label='Checkboxes'),
        ui.checkbox(name='checkbox1', label='A checkbox'),
        ui.checkbox(name='checkbox1', label='Another checkbox'),
        ui.checkbox(name='checkbox1', label='Yet another checkbox'),
        ui.toggle(name='toggle', label='Toggle'),
        ui.choice_group(name='choice_group', label='Choice group', choices=[
            ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
        ]),
        ui.checklist(name='checklist', label='Checklist', choices=[
            ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
        ]),
        ui.dropdown(name='dropdown', label='Dropdown', choices=[
            ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
        ]),
        ui.dropdown(name='dropdown', label='Multi-valued Dropdown', values=[], choices=[
            ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
        ]),
        ui.combobox(name='combobox', label='Combobox', choices=['Choice 1', 'Choice 2', 'Choice 3']),
        ui.slider(name='slider', label='Slider'),
        ui.range_slider(name='range_slider', label='Range slider', max=99),
        ui.spinbox(name='spinbox', label='Spinbox'),
        ui.date_picker(name='date_picker', label='Date picker'),
        ui.color_picker(name='color_picker', label='Color picker'),
        ui.buttons([
            ui.button(name='primary_button', label='Primary', primary=True),
            ui.button(name='standard_button', label='Standard'),
            ui.button(name='standard_disabled_button', label='Standard', disabled=True),
        ]),
        ui.file_upload(name='file_upload', label='File upload'),
        ui.table(name='table', columns=[
            ui.table_column(name='col1', label='Column 1'),
            ui.table_column(name='col2', label='Column 2'),
        ], rows=[
            ui.table_row(name='row1', cells=['Text A', 'Text B']),
            ui.table_row(name='row2', cells=['Text C', 'Text D']),
            ui.table_row(name='row3', cells=['Text E', 'Text F']),
        ]),
        ui.link(label='Link'),
        ui.tabs(name='tabs', items=[
            ui.tab(name='email', label='Mail', icon='Mail'),
            ui.tab(name='events', label='Events', icon='Calendar'),
            ui.tab(name='spam', label='Spam'),
        ]),
        ui.expander(name='expander', label='Expander', items=[
            ui.combobox(name='combobox', label='Combobox', choices=['Choice 1', 'Choice 2', 'Choice 3']),
            ui.slider(name='slider', label='Slider'),
            ui.range_slider(name='range_slider', label='Range slider', max=99),
            ui.spinbox(name='spinbox', label='Spinbox'),
        ]),
        ui.frame(path='https://example.com'),
        ui.markup(content=html),
        ui.template(
            content=menu,
            data=pack(dict(dishes=[
                dict(name='Spam', price='$2.00'),
                dict(name='Ham', price='$3.45'),
                dict(name='Eggs', price='$1.75'),
            ]))
        ),
        ui.picker(name='picker', label='Picker', choices=[
            ui.choice('choice1', label='Choice 1'),
            ui.choice('choice2', label='Choice 2'),
            ui.choice('choice3', label='Choice 3'),
        ]),
        ui.stepper(name='stepper', items=[
            ui.step(label='Step 1', icon='MailLowImportance'),
            ui.step(label='Step 2', icon='TaskManagerMirrored'),
            ui.step(label='Step 3', icon='Cafe'),
        ]),
        ui.visualization(
            plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', y_min=0)]),
            data=data(fields='product price', rows=[(c, x) for c, x, _ in [f.next() for _ in range(n)]], pack=True),
        ),
        ui.vega_visualization(
            specification=spec,
            data=data(fields=["a", "b"], rows=[
                ["A", rnd()], ["B", rnd()], ["C", rnd()],
                ["D", rnd()], ["E", rnd()], ["F", rnd()],
                ["G", rnd()], ["H", rnd()], ["I", rnd()]
            ], pack=True),
        ),
        ui.button(name='show_inputs', label='Submit', primary=True),
    ])
    await q.page.save()
