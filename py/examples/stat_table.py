# Stat / Table
# Create a card displaying title, subtitle, and tabular data.
# #stat_card #table
# ---

from h2o_wave import site, ui

from faker import Faker

fake = Faker()

page = site['/demo']

page.add('example', ui.stat_table_card(
    box='1 1 4 8',
    title='Contacts',
    subtitle=f'Last updated: {fake.date()}',
    columns=['Name', 'Job', 'City'],
    items=[
          ui.stat_table_item(
              label=fake.name(),
              values=[fake.job(), fake.city()],
              colors=['darkblue', '$amber']
          ) for i in range(10)
    ]
))

page.save()
