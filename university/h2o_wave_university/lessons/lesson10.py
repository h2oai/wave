# Lesson 10: State II
# # Create once, update afterwards
# Remember how the input we typed in [lesson5](#lesson5) disappeared after submit?
# It was because we recreated the markdown card by assigning q.page['form'] a new card reference
# after every submit instead of creating it just once.
# 
# For creating it just once, we would need to identify first render somehow. Luckily for us,
# it's very straightforward in Wave - just set a boolean client-scope variable initialized (or any other name)
# to True after the serve function runs for the first time.
# 
# The following example uses q.client for storage since we want to create the card once per every tab. However,
# the very same technique can be used with q.app if you want to make some action once per whole app lifecycle
# like training a small model or q.user to make something once per user session.
# 
# ## Simple example
# This app will do the exact same thing as [lesson5](#lesson5) did, but this time, the textbox input
# will keep the value.
# ## Your task
# Try to fix the example from [lesson6](#lesson6).
# ---

from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Create cards only once per browser.
        q.page['hello'] = ui.markdown_card(box='1 1 3 1', title='Markdown card', content='Hello World!')
        q.page['form'] = ui.form_card(box='1 2 3 3', items=[
            ui.textbox(name='content', label='Content'),
            ui.button(name='submit', label='Submit'),
        ])
        q.client.initialized = True

    # Handle the button click.
    if q.args.submit:
        # Update existing card content.
        q.page['hello'].content = q.args.content

    await q.page.save()
