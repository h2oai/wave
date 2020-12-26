# Uploads / Frame
# To display content > 2MB in #frame cards, first #upload the content and then use it in a frame card.
# ---
import os
import uuid
from h2o_wave import site, ui

html_content = '''
<!DOCTYPE html>
<html>
<head>
    <title>X</title>
</head>
<body>
    <h2>Hello World!</h2>
    <p>And now for something completely different...</p>
</body>
</html>
'''

# Create a random filename for our HTML file
# e.g. 6ad24c6f-54ed-41e0-8458-a2efd5e05952.html
html_filename = f'{str(uuid.uuid4())}.html'

# Save HTML content to file
with open(html_filename, 'w', encoding='utf-8') as f:
    f.write(html_content)

# Upload HTML file
html_path, = site.upload([html_filename])

# Clean up
os.remove(html_filename)

# Add a frame card to the page and point it to the HTML file we just uploaded.
# The path will look something like /_f/adb747ae-999f-460b-8050-3d636594d0cf/6ad24c6f-54ed-41e0-8458-a2efd5e05952.html
page = site['/demo']
page['example'] = ui.frame_card(
    box='1 1 2 3',
    title='An uploaded frame',
    path=html_path,
)
page.save()
