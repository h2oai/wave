# Tabs / Navigation
# Navigate between two or more tabs.
# Delete the cards when switching between tabs.
# #tabs #navigation
# ---
from h2o_wave import main, app, Q, ui

TABS = 'abcde'


async def display_tab(q):
    q.page[f'example_{q.client.tab}'] = ui.markup_card(
        box='1 2 4 3',
        title=q.client.tab.upper(),
        content='\n'.join([''.join([q.client.tab] * 10) for _ in range(50)])
    )
    await q.page.save()


async def remove_cards(q: Q):
    for tab in TABS:
        del q.page[f'example_{tab}']
    await q.page.save()


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.tab = 'a'
        q.page['tabs'] = ui.tab_card(  # Initialize once
            box='1 1 4 1',
            items=[ui.tab(name=f'#{t}', label=t.upper()) for t in TABS]
        )
        q.client.initialized = True

    if q.args['#']:
        q.client.tab = str(q.args['#'])

    await remove_cards(q)
    await display_tab(q)
    await q.page.save()
