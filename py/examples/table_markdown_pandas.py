# Table / Markdown / Pandas
# Display a #pandas #dataframe as a #markdown #table.
# ---
from h2o_wave import site, ui
import pandas as pd

df = pd.DataFrame({'A': 1.,
                   'B': pd.Timestamp('20130102'),
                   'C': pd.Series(1, index=list(range(4)), dtype='float32'),
                   'D': pd.np.array([3] * 4, dtype='int32'),
                   'E': pd.Categorical(["test", "train", "test", "train"]),
                   'F': 'foo'})


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
            fields=df.columns.tolist(),
            rows=df.values.tolist(),
        )),
    ],
))

page.save()
