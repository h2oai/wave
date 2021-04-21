# Uploads
# #Upload files to the Wave server.
# ---
import os
from h2o_wave import site, ui


def write_csv(filename, rows):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join([','.join([str(x) for x in row]) for row in rows]))


# Create a couple of fake CSV files
write_csv('squares.csv', [[x, x * x] for x in range(1, 11)])
write_csv('cubes.csv', [[x, x * x * x] for x in range(1, 11)])

# Upload CSVs
squares_path, cubes_path = site.upload(['squares.csv', 'cubes.csv'])

# Delete local CSVs
os.remove('squares.csv')
os.remove('cubes.csv')

# Display links to these CSVs
page = site['/demo']
page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Download CSVs',
    content=f'[Squares]({squares_path}) [Cubes]({cubes_path})',
)
page.save()
