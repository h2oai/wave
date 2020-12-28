# Plot / D3.js
# Create custom plots using D3.js. #plot
# ---
import json
import os.path
from h2o_wave import site, ui

# The example D3 Javascript file is located in the same directory as this example; get its path
d3_js_script_filename = os.path.join(os.path.dirname(__file__), 'plot_d3.js')

# Upload the script to the server. Typically, you'd do this only once, when your app is installed.
d3_js_script_path, = site.upload([d3_js_script_filename])

html_template = '''
<!DOCTYPE html>
<html>
<head>
  <script src="https://d3js.org/d3.v5.min.js"></script>
</head>
<body style="margin:0; padding:0">
  <script src="{script_path}"></script>
  <script>render({data})</script>
</body>
</html>
'''

# This data is hard-coded here for simplicity.
# During production use, this data would be the output of some compute routine.
data = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
]

# Plug JSON-serialized data into our html template
html = html_template.format(script_path=d3_js_script_path, data=json.dumps(data))

page = site['/demo']
page['example'] = ui.frame_card(
    box='1 1 5 8',
    title='D3 Chord Diagram',
    content=html,
)
page.save()
