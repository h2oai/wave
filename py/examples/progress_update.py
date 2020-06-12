# Form / Progress / Updating
# No description available.
# ---
import time

from telesync import Site, ui

site = Site()
page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.progress(label='Basic Progress'),
    ]
)
page.sync()

for i in range(1, 11):
    time.sleep(1)
    page['example'].items = [
        ui.progress(label='Basic Progress', caption=f'{i * 10}% complete', value=i / 10),
    ]

    # This will work, too:
    # page['example'].items[0].progress.value = i/10

    page.sync()
