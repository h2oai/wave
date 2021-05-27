# Meta / Inline Script
# Execute arbitrary Javascript.
# ---
from h2o_wave import site, ui

# This example displays a clock using Javascript.

page = site['/demo']

# Add a placeholder for the clock.
page['example'] = ui.markup_card(
    box='1 1 2 1',
    title='Time',
    content='<div id="clock"/>',
)

# Specify the Javascript code to display the clock.
clock_script = '''
// Locate the placeholder 'div' element in our markup_card.
const clock = document.getElementById("clock");
const displayTime = () => { clock.innerText = (new Date()).toLocaleString(); };

// Display the time every second (1000ms).
window.setInterval(displayTime, 1000);
'''

# Add the script to the page.
page['meta'] = ui.meta_card(box='', script=ui.inline_script(
    # The Javascript code for this script.
    content=clock_script,
    # Execute this script only if the 'clock' element is available.
    targets=['clock'],
))

page.save()
