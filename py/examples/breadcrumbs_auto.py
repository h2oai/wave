# Breadcrumbs / Auto
# This example shows automatic breadcrumbs change in respect to hash URL.
#
# Use "/" as a separator between hierarchy sections (e.g. localhost:3000/demo#parent/child/grandchild).
#
# For multi word url parts, use "-" (e.g. localhost:3000/demo#my/really-long-word).
# ---

from h2o_wave import Q, listen, ui


async def serve(q: Q):
    hash = q.args['#']
    if hash:
        blurb = q.page['blurb']
        if hash == 'basic-change':
            blurb.content = "Notice how breadcrumbs automatically changed."
        elif hash == 'manual/url':
            blurb.content = 'Change URL to **localhost:3000/demo#your/really/long/multi-word/hash**.'
        elif hash == 'navigate/to/anything/you/like':
            blurb.content = "Click on a breadcrumb to navigate."
    else:
        q.page['nav'] = ui.tab_card(
            box='1 1 4 1',
            items=[
                ui.tab(name='#', label='Intro'),
                ui.tab(name='#basic-change', label='Basic change'),
                ui.tab(name='#manual/url', label='Manual URL'),
                ui.tab(name='#navigate/to/anything/you/like', label='Navigate'),
            ],
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 2 4 2',
            title='Store',
            content='Go to **localhost:3000/demo** to see the full demo.',
        )
        q.page['breadcrumbs'] = ui.breadcrumbs_card(
            box='1 4 4 2',
            items=[],
            auto=True
        )
    await q.page.save()


listen('/demo', serve)
