# Checkpoint
# Set the H2O_WAVE_CHECKPOINT_DIR environment variable to enable saving and reloading application and session state.
# For example, run `checkpoint.py` using `$ H2O_WAVE_CHECKPOINT_DIR=./temp wave run examples.checkpoint`.
# You will observe that every time you stop and restart the application, the counts are preserved.
# #checkpoint
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.increment_app:
        q.app.count = (q.app.count or 0) + 1
    elif q.args.increment_user:
        q.user.count = (q.user.count or 0) + 1
    elif q.args.increment_client:
        q.client.count = (q.client.count or 0) + 1

    q.page['example'] = ui.form_card(box='1 1 12 10', items=[
        ui.button(name='increment_app', label=f'App Count={q.app.count or 0}'),
        ui.button(name='increment_user', label=f'User Count={q.user.count or 0}'),
        ui.button(name='increment_client', label=f'Client Count={q.client.count or 0}'),
    ])

    await q.page.save()
