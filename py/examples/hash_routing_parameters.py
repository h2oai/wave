# Routing / Hash / Parameters
# Use the browser's [location hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)
# for #routing using URLs, with parameters.
# ---
from h2o_wave import main, app, Q, ui, on, handle_on

air_passengers_fields = ['Year', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
air_passengers_rows = [
    ['1949', '112', '118', '132', '129', '121', '135'],
    ['1950', '115', '126', '141', '135', '125', '149'],
    ['1951', '145', '150', '178', '163', '172', '178'],
    ['1952', '171', '180', '193', '181', '183', '218'],
    ['1953', '196', '196', '236', '235', '229', '243'],
    ['1954', '204', '188', '235', '227', '234', '264'],
    ['1955', '242', '233', '267', '269', '270', '315'],
    ['1956', '284', '277', '317', '313', '318', '374'],
    ['1957', '315', '301', '356', '348', '355', '422'],
    ['1958', '340', '318', '362', '348', '363', '435'],
    ['1959', '360', '342', '406', '396', '420', '472'],
    ['1960', '417', '391', '419', '461', '472', '535'],
]


def make_markdown_row(values):
    return f"| {' | '.join([str(x) for x in values])} |"


def make_markdown_table(fields, rows):
    return '\n'.join([
        make_markdown_row(fields),
        make_markdown_row('---' * len(fields)),
        '\n'.join([make_markdown_row(row) for row in rows]),
    ])


def add_links_to_cells(rows):
    return [[f'[{cell}](#row{i + 1}/col{j + 1})' for j, cell in enumerate(row)] for i, row in enumerate(rows)]


@on('#row{row:int}/col{col:int}')
async def print_clicked_cell(q: Q, row: int, col: int):
    q.page['message'].content = f'You clicked on row {row}, column {col}!'


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.page['table'] = ui.form_card(
            box='1 1 4 7',
            items=[
                ui.text_l('Airline Passenger Counts'),
                ui.text(make_markdown_table(
                    fields=air_passengers_fields,
                    rows=add_links_to_cells(air_passengers_rows),
                )),
            ],
        )
        q.page['message'] = ui.markdown_card(
            box='1 8 4 1',
            title='',
            content='Click on a cell in the table above!',
        )

    await handle_on(q)

    await q.page.save()
