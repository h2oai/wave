# Form
# Use a form to collect data or show textual information.
# ---
from synth import FakeCategoricalSeries
from h2o_q import Q, listen, ui, pack, data
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
def rnd(): return random.randint(1, 100)


async def main(q: Q):
    q.page['example'] = ui.form_card(box='1 1 4 10', items=[
        ui.text_xl(content='Text XL'),
        ui.text_l(content='Text L'),
        ui.text_m(content='Text M'),
        ui.text_s(content='Text S'),
        ui.text_xs(content='Text XS'),
        ui.label(label='Label'),
        ui.separator(label='Separator'),
        ui.progress(label='Progress'),
        ui.message_bar(text='Message bar'),
        ui.textbox(name='textbox', label='Textbox'),
        ui.checkbox(name='checkbox', label='Checkbox'),
        ui.toggle(name='toggle', label='Toggle'),
        ui.choice_group(name='choice_group', label='Choice group', choices=[
          ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']]
        ),
        ui.checklist(name='checklist', label='Checklist', choices=[
          ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']]
        ),
        ui.dropdown(name='dropdown', label='Dropdown', choices=[
          ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']]
        ),
        ui.combobox(name='combobox', label='Combobox', choices=['Choice 1', 'Choice 2', 'Choice 3']),
        ui.slider(name='slider', label='Slider'),
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
        ui.expander(name='expander', label='Expander'),
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
        ui.range_slider(name='range_slider', label='Range slider', max=99),
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


if __name__ == '__main__':
    listen('/demo', main)
