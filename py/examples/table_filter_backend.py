# Table / Filter / Backend
# Filter table using Python.
# #table
# ---
import pandas as pd
from faker import Faker
from h2o_wave import main, app, Q, ui

fake = Faker()

N = 50  # number of rows

# Make a synthetic data frame
addresses = pd.DataFrame(dict(
    ID=[i + 1 for i in range(N)],
    Name=[fake.name() for _ in range(N)],
    Language=[fake.language_name() for _ in range(N)],
    Job=[fake.job() for _ in range(N)],
    Address=[fake.address() for _ in range(N)],
    City=[fake.city() for _ in range(N)],
))

column_names = ['ID', 'Name', 'Language', 'Job', 'Address', 'City']


def df_to_rows(df: pd.DataFrame):
    return [ui.table_row(str(row['ID']), [str(row[name]) for name in column_names]) for i, row in df.iterrows()]


def search_df(df: pd.DataFrame, term: str):
    str_cols = df.select_dtypes(include=[object])
    return df[str_cols.apply(lambda column: column.str.contains(term, case=False, na=False)).any(axis=1)]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 11', items=[
            ui.textbox(name='search', label='Search', placeholder='Enter a keyword...', trigger=True),
            ui.table(
                name='issues',
                columns=[ui.table_column(name=name, label=name) for name in column_names],
                rows=df_to_rows(addresses)
            )
        ])
        q.client.initialized = True
    else:
        items = q.page['form'].items
        search_box = items[0].textbox
        table = items[1].table
        term: str = q.args.search
        term = term.strip() if term else ''
        search_box.value = term
        table.rows = df_to_rows(search_df(addresses, term) if len(term) else addresses)

    await q.page.save()
