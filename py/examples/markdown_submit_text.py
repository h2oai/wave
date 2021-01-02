# Markdown / Submit / Text
# Use "?" to prefix the desired q.args.key that you want to have submitted after clicking a phrase.
# ---
from h2o_wave import site, ui, main

page = site['/demo']

page['example'] = ui.markdown_card(
    box='1 1 3 -1',
    title='I was made using markdown!',
    content='The quick brown [fox](?fox) jumps over the lazy [dog](?dog).'
)
page.save()
