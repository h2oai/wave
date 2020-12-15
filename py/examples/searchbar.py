# SearchBar
# SearchBar is used to align textbox and button components horizontally.
# searchbar_card can be used to horizontally align textbox and button on the requirement.
# ---
from h2o_wave import site, ui

page = site['/demo']


page["search_bar"] = ui.searchbar_card(
    box="1 1 -1 1", items=[
        ui.textbox(name='text', label='', placeholder='#wave', multiline=False, trigger=False),
        ui.button(name="search", label="search", primary=True),
    ], direction=ui.SearchBarDirection.ROW, justify=ui.SearchBarJustify.CENTER)

page.save()
