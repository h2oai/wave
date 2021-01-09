# Table / Filter / Backend
# Filter table using Python.
# #table
# ---
import pandas as pd
from h2o_wave import main, app, Q, ui


column_names = ['ID', 'Name', 'Language', 'Job', 'Address']

addresses = pd.DataFrame(
    [
        [1, 'Rick Fleming', 'German', 'Engineer, electronics', '4432 Alan Ridges Yangton, CA 33492'],
        [2, 'Rhonda Anderson', 'Cornish', 'Lexicographer', '55417 Mills Isle South Franklinville, ND 98866'],
        [3, 'Jared Lee', 'Swati', 'Printmaker', 'Unit 5860 Box 4474 DPO AA 66244'],
        [4, 'Matthew Jimenez', 'North Ndebele', 'Training and development officer', '636 East Brian, AL 81942'],
        [5, 'Mitchell Schmidt', 'Marshallese', 'Building services engineer', '366 Hernandez Port Davidshire, NY 86317'],
        [6, 'Katie Perez', 'Russian', 'Civil engineer, consulting', '3605 Brenda Cape Mosleyport, MA 76379'],
        [7, 'Jason Anderson', 'Sinhala', 'Veterinary surgeon', '24841 Jessica Meadows Suite 294 Ericabury, SC 38082'],
        [8, 'Susan Rogers', 'Amharic', 'Podiatrist', '43725 Luna Center Suite 540 Gambleville, NH 91245'],
        [9, 'Mary Molina', 'Japanese', 'Travel agency manager', '2515 Natalie Springs Apt. 666 Brownmouth, SC 22702'],
        [10, 'Phillip Collins', 'Chechen', 'Water engineer', '8426 Christian Port Apt. 910 South Jamesport, ME 37737']
    ],
    columns=column_names)


def df_to_rows(df: pd.DataFrame):
    return [ui.table_row(row['ID'], [row[name] for name in column_names]) for i, row in df.iterrows()]


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
