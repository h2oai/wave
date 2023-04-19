# Form / Progress / Updating
# Update a #progress bar's completion status periodically.
# #form
# ---
import time

from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 7',
    items=[
        ui.progress(name='progress', label='Basic Progress'),
    ]
)
page.save()

for i in range(1, 11):
    time.sleep(1)
    page['example'].items = [
        ui.progress(name='progress', label='Basic Progress', caption=f'{i * 10}% complete', value=i / 10),
    ]

    # This will work, too:
    # page['example'].progress.value = i/10

    page.save()
