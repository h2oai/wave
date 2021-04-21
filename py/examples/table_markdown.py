# Table / Markdown
# Display a #table using #markdown.
# ---
from h2o_wave import site, ui

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


page = site['/demo']

v = page.add('example', ui.form_card(
    box='1 1 4 5',
    items=[
        ui.text(make_markdown_table(
            fields=air_passengers_fields,
            rows=air_passengers_rows,
        )),
    ],
))

page.save()
