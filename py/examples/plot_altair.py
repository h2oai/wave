# Plot / Altair
# Use #Altair to create #plot specifications for the #Vega card.
# ---
import altair
from vega_datasets import data
from h2o_wave import site, ui

spec = altair.Chart(data.cars()).mark_circle(size=60).encode(
    x='Horsepower',
    y='Miles_per_Gallon',
    color='Origin',
    tooltip=['Name', 'Origin', 'Horsepower', 'Miles_per_Gallon']
).properties(width='container', height='container').interactive().to_json()

page = site['/demo']

page['example'] = ui.vega_card(
    box='1 1 4 5',
    title='Altair Example',
    specification=spec,
)

page.save()
