# Lesson 9: State
# # What about stateful apps?
# Every app out there needs to remember what preferences user picked, what config options
# they chose etc.
# 
# Wave comes with 3 types of state which make developer's lives so much easier:
# * client state - State that is specific to a browser tab.
# * user state - State that is specific to a user, shared across all their tabs.
# * app state - State that is specific to the app as a whole, shared across all users.
# 
# See [docs](https://wave.h2o.ai/docs/state) for more info.
# ## Simple example
# Let's create a minimal counter app that stores and displays the current counter value.
# ## Your task
# Try to use different state types, open multiple tabs at "/demo" route and see how the counter
# behaves for each state type.
# 
# Note that if your app is not publicly exposed, you will be the only user
# thus user and app level state will appear the same.
# ---

from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    # Initialize our counter.
    if q.client.count is None:
        q.client.count = 0

    # Handle increment click.
    if q.args.increment:
        q.client.count += 1

    q.page['example'] = ui.form_card(box='1 1 2 1', items=[
        ui.button(name='increment', label=f'Count={q.client.count}')
    ])

    await q.page.save()
