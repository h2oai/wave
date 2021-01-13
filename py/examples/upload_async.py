# Uploads / Async
# Upload files from an interactive app.
# #upload
# ---


import os
from h2o_wave import main, app, Q, ui


def write_csv(filename, rows):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join([','.join([str(x) for x in row]) for row in rows]))


@app('/demo')
async def serve(q: Q):
    if q.args.generate_csv:
        # Generate
        write_csv('squares.csv', [[x, x * x] for x in range(1, 1 + q.args.row_count)])
        # Upload
        download_path, = await q.site.upload(['squares.csv'])
        # Clean up
        os.remove('squares.csv')

        # Display link
        q.page['example'].items = [
            ui.text_xl('Squares Generated!'),
            ui.text(f'[Download my {q.args.row_count} squares!]({download_path})'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        # Accept a row count from the user
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_xl('Square Generator'),
            ui.slider(name='row_count', label='Squares to generate', min=0, max=100, step=10, value=30),
            ui.button(name='generate_csv', label='Generate', primary=True),
        ])
    await q.page.save()
