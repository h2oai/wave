# Meta / Redirect
# #Redirect the page to a new URL or hash. #meta
# ---
import time

from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Redirect a page',
    content='This page should redirect to Wikipedia in a few seconds. Wait for it...',
)
page.save()

time.sleep(3)
# Redirect to a hash.
page['meta'].redirect = '#widgets'
page.save()

time.sleep(3)
# Redirect to a URL.
page['meta'].redirect = 'https://www.wikipedia.org'
page.save()
