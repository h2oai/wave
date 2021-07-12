# Meta / Inline Script / Callback
# Handle events from arbitrary Javascript
# ---
from h2o_wave import main, app, Q, ui

# Define a function that emits an event from Javascript to Python
counter_onclick = '''
function increment() {
  // Emit an event to the app.
  // All three arguments are arbitrary.
  // Here, we use:
  // - 'counter' to indicate the source of the event.
  // - 'clicked' to indicate the type of event.
  // - the third argument can be a string, number, boolean or any complex structure, like { foo: 'bar', qux: 42 }
  // In Python, q.events.counter.clicked will be set to True.
  wave.emit('counter', 'clicked', true);
}
'''

# The HTML and CSS to create a custom button.
# Note that we've named the element 'counter',
#   and called the increment() Javascript function when clicked.
counter_html = '''
<style>
#counter {
  cursor: pointer; 
  user-select: none;
  background: #ff784f; 
  color: #fff;
  padding: 0.25em 1em;
  text-align: center;
}
#counter:hover {
  background: #ff8965; 
}
</style>
<h2 id="counter" onclick="increment()">Click Me!</h2>
'''


@app('/demo')
async def serve(q: Q):
    # Track how many times the button has been clicked.
    if q.client.count is None:
        q.client.count = 0

    if not q.client.initialized:
        # Add our script to the page.
        q.page['meta'] = ui.meta_card(
            box='',
            script=ui.inline_script(
                # The Javascript code for this script.
                content=counter_onclick,
                # Execute this script only if the 'counter' element is available.
                targets=['counter'],
            )
        )
        q.page['form'] = ui.form_card(
            box='1 1 2 2',
            title='Counter',
            items=[
                # Display our custom button.
                ui.markup(content=counter_html),
                ui.text(''),
            ],
        )
        q.client.initialized = True
    else:
        # Do we have an event from the counter?
        if q.events.counter:
            # Is 'clicked' True?
            if q.events.counter.clicked:
                # Increment the count.
                q.client.count += 1
                # Display the latest count.
                q.page['form'].items[1].text.content = f'You clicked {q.client.count} times.'

    await q.page.save()
