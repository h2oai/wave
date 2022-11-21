# Lesson 6: User interaction II
# # Triggering components
# Clicking the submit button is fine, but there can be cases, when you may want to have the data
# submitted without a button click. Typical scenario can be a searchbox.
# 
# That's the purpose of "trigger" attribute - submit data after user stops typing or picks
# a dropdown option for example.
# 
# Notice that the example provided is a bit clunky - the text you type disappears after it's submitted.
# We will demystify and fix this behavior later on (in [lesson10](#lesson10)) so no worries. For
# simplicity sake, the example is good enough as is currently.
# ## Your task
# There is not much to play around with here so give yourself a pat on shoulder for making it this far!
# ---

from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['hello'] = ui.markdown_card(box='1 1 3 1', title='Markdown card', content='Hello World!')
    q.page['form'] = ui.form_card(box='1 2 3 2', items=[
        ui.textbox(name='content', label='Content', trigger=True),
    ])

    # Handle the button click.
    if q.args.content:
        # Update existing card content.
        q.page['hello'].content = q.args.content

    await q.page.save()
