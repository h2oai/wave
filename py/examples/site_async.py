# Site / Async
# Update any page on a site from within an app using an `AsyncSite` instance.
# #site
# ---
from h2o_wave import Q, app, main, ui, AsyncSite

site = AsyncSite()

# Grab a reference to the /stats page
stats_page = site['/stats']

# A flag to indicate whether to pause or resume updating the page at '/stats'
update_stats = False

price_changes = [(62.54, 0.2345), (9.42, 0.4033), (26.73, 0.3065), (31.44, 0.10000), (52.90, 0.482),
                 (8.25, 0.2650), (17.12, 0.0328), (20.35, 0.4638), (48.76, 0.3756), (30.14, 0.1500), ]


def next_price_fluctuation():
    i = 0
    while True:
        yield price_changes[i % len(price_changes)]
        i += 1


price_change = next_price_fluctuation()


async def update_stats_page(q, page):
    card = page['example']
    while update_stats:
        await q.sleep(1)
        price, percent = next(price_change)
        card.data.price = price
        card.data.percent = percent
        card.progress = percent
        await page.save()


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Set up up the page at /stats
        stats_page.drop()  # Clear any existing page
        stats_page['example'] = ui.wide_gauge_stat_card(
            box='1 1 2 1',
            title='Stats',
            value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            aux_value='={{intl percent style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
            plot_color='$red',
            progress=0,
            data=dict(price=0, percent=0),
        )
        await stats_page.save()

        # Set up this app's UI
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.frame(path='/stats', height='110px'),
            ui.button(name='toggle', label='Start updates', primary=True),
        ])
        await q.page.save()

        q.client.initialized = True

    if q.args.toggle:
        global update_stats
        update_stats = not update_stats
        q.page['form'].items[1].button.label = 'Stop updates' if update_stats else 'Start updates'
        await q.page.save()
        await update_stats_page(q, stats_page)
