# Table / Pagination / H2O-3 Dataframe
# Use a paginated #table to display large (100m+ rows) tabular data using a H2O-3 dataframe.
# #form #table #pagination #h2o3
# ---

import os
from time import time

import h2o
from h2o_wave import Q, app, main, ui
from loguru import logger

# This example requires H2O-3 to be running.


@app("/demo")
async def serve(q: Q):
    logger.info(q.args)
    logger.info(q.events)

    if not q.app.initialized:
        # This is called the first time our app runs
        # Variables created here will be the same of all users of the app
        # Save a direct link to our H2O Dataframe for all users to use throughout the app
        try:
            h2o.connect(url="http://127.0.0.1:54321")
        except:
            q.page['err'] = ui.form_card(box='1 1 4 2', items=[
                ui.message_bar(type='error', text='Could not connect to H2O3. Please ensure H2O3 is running.'),
            ])
            await q.page.save()
            logger.error("H2O-3 is not running")
            return
        q.app.h2o_df = h2o.get_frame("py_6_sid_aff3")

        # EXAMPLE OF CREATING A LARGE DATAFRAME
        # h2o_df = h2o.create_frame(
        #     rows=1000000,
        #     cols=5,
        #     categorical_fraction=0.6,
        #     integer_fraction=0,
        #     binary_fraction=0,
        #     real_range=100,
        #     integer_range=100,
        #     missing_fraction=0,
        #     seed=1234,
        # )

        q.app.rows_per_page = 10  # TODO: How many rows do you want to show users at a time

        # A list of booleans for if a column is sortable or not, by default
        # we allow all and only numeric columns to be sorted based on H2O-3 functionality
        # TODO: You may want to make a hardcoded list of [True, False] for your own use cases
        q.app.column_sortable = q.app.h2o_df.isnumeric()

        # A list of booleans for if a column is filterable or not, by default,
        # we allow all and only categorical columns to be sorted based on H2O-3 functionality
        # TODO: You may want to make a hardcoded list of [True, False] for your own use cases
        q.app.column_filterable = q.app.h2o_df.isfactor()

        # A list of booleans for if a column is searchable or not, by default,
        # we allow all and only categorical and string columns to be sorted based on H2O-3 functionality
        # TODO: You may want to make a hardcoded list of [True, False] for your own use cases
        q.app.column_searchable = q.app.h2o_df.isfactor() + q.app.h2o_df.isstring()

        q.app.initialized = True

    if not q.client.initialized:
        # This is called for each new browser that visits the app
        # Multiple users can interact with the table at the same time without interrupting each other
        # Users can make multiple changes to the table such as sorting and filtering

        q.client.search = None
        q.client.sort = None
        q.client.filters = None
        q.client.page_offset = 0
        q.client.total_rows = len(q.app.h2o_df)

        # Create the default UI for this user
        q.page["meta"] = ui.meta_card(box="")
        q.page["table_card"] = ui.form_card(
            box="1 1 -1 -1",
            items=[
                ui.table(
                    name="h2o_table",  # TODO: if you change this, you need to remember to update the serve function
                    columns=[
                        ui.table_column(
                            name=q.app.h2o_df.columns[i],
                            label=q.app.h2o_df.columns[i],
                            sortable=q.app.column_sortable[i],
                            filterable=q.app.column_filterable[i],
                            searchable=q.app.column_searchable[i],
                        )
                        for i in range(len(q.app.h2o_df.columns))
                    ],
                    rows=get_table_rows(q),
                    resettable=True,
                    downloadable=True,
                    pagination=ui.table_pagination(
                        total_rows=q.client.total_rows,
                        rows_per_page=q.app.rows_per_page,
                    ),
                    events=[
                        "page_change",
                        "sort",
                        "filter",
                        "search",
                        "reset",
                        "download",
                    ],
                )
            ],
        )
        q.client.initialized = True

    # Check if user triggered any table action and save it to local state for allowing multiple
    # actions to be performed on the data at the same time, e.g. sort the filtered data etc.
    if q.events.h2o_table:
        logger.info("table event occurred")

        if q.events.h2o_table.page_change:
            logger.info(f"table page change: {q.events.h2o_table.page_change}")
            q.client.page_offset = q.events.h2o_table.page_change.get("offset", 0)

        if q.events.h2o_table.sort:
            logger.info(f"table sort: {q.events.h2o_table.sort}")
            q.client.sort = q.events.h2o_table.sort
            q.client.page_offset = 0

        if q.events.h2o_table.filter:
            logger.info(f"table filter: {q.events.h2o_table.filter}")
            q.client.filters = q.events.h2o_table.filter
            q.client.page_offset = 0

        if q.events.h2o_table.search is not None:
            logger.info(f"table search: {q.events.h2o_table.search}")
            q.client.search = q.events.h2o_table.search
            q.client.page_offset = 0

        if q.events.h2o_table.download:
            await download_h2o_table(q)

        if q.events.h2o_table.reset:
            logger.info("table reset")
            q.client.search = None
            q.client.sort = None
            q.client.filters = None
            q.client.page_offset = 0
            q.client.total_rows = len(q.app.h2o_df)

        # Update the rows in our UI
        # TODO: if you change where your table is located, this needs updating
        q.page["table_card"].items[0].table.rows = get_table_rows(q)
        q.page["table_card"].items[0].table.pagination.total_rows = q.client.total_rows

    await q.page.save()


def get_table_rows(q: Q):
    logger.info(
        f"Creating new table for rows: {q.client.page_offset} to {q.client.page_offset + q.app.rows_per_page}"
    )

    working_frame = prepare_h2o_data(q)

    # Bring our limited UI rows locally to pandas to prepare for our ui.table
    local_df = working_frame[
        q.client.page_offset:q.client.page_offset + q.app.rows_per_page, :
    ].as_data_frame()
    q.client.total_rows = len(working_frame)

    table_rows = [
        ui.table_row(
            name=str(
                q.client.page_offset + i
            ),  # name is the index on the h2o dataframe for appropriate lookup
            cells=[str(local_df[col].values[i]) for col in local_df.columns.to_list()],
        )
        for i in range(len(local_df))
    ]

    h2o.remove(working_frame)  # remove our duplicate work

    return table_rows


async def download_h2o_table(q: Q):
    # Create a unique file name as this is a multi-user app
    local_file_path = f"h2o3_data_{str(int(time()))}.csv"
    working_frame = prepare_h2o_data(q)

    h2o.download_csv(working_frame, local_file_path)
    (wave_file_path,) = await q.site.upload([local_file_path])
    os.remove(local_file_path)

    q.page["meta"].script = ui.inline_script(f'window.open("{wave_file_path}")')


def prepare_h2o_data(q: Q):

    # This is used to prep the data we want to show on the screen or download, so it gets its own function
    # If you have 5 users at the same time, there will be 6 large dataframes in h2o3 - ensure proper cluster size
    working_frame = h2o.deep_copy(q.app.h2o_df, "working_df")

    if q.client.sort is not None:
        # H2O-3 can only sort numeric values - if the developer allows users to sort
        # string columns the end users will see unexpected results

        working_frame = working_frame.sort(
            by=list(q.client.sort.keys()), ascending=list(q.client.sort.values())
        )

    if q.client.filters is not None:

        for key in q.client.filters.keys():
            working_frame = working_frame[
                working_frame[key].match(q.client.filters[key])
            ]

    if q.client.search is not None:
        # We check if our search term is in any of the searchable columns
        # Start with and index of 0s and then filter to only keep rows with index > 0

        index = h2o.create_frame(
            rows=len(working_frame), cols=1, integer_fraction=1, integer_range=1
        )
        index["C1"] = 0
        for i in range(len(q.app.h2o_df.columns)):
            if q.app.column_searchable[i]:
                index = index + working_frame[q.app.h2o_df.columns[i]].grep(
                    pattern=q.client.search, ignore_case=True, output_logical=True
                )

        working_frame = working_frame[index]
    return working_frame
