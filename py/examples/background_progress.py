# Background Tasks / Progress
# Execute background functions while incrementing a #progress bar.
# #background_tasks
# ---
import asyncio
import time
import concurrent.futures
from threading import Event
from h2o_wave import main, app, Q, ui


# This takes a lot of time (compute heavy).
def blocking_function(q: Q, loop: asyncio.AbstractEventLoop):
    count = 0
    total = 10
    future = None
    while count < total:
        # Check if cancelled.
        if q.client.event.is_set():
            asyncio.ensure_future(show_cancel(q), loop=loop)
            return
            # This blocks the main thread and prevents any other execution.
        # This would be the compute in the real world.
        time.sleep(1)
        count += 1
        # If future is not done yet, skip the update to keep the correct order.
        if not future or future.done():
            # Assume you are able to emit some kind of progress.
            future = asyncio.ensure_future(update_ui(q, count / total), loop=loop)


async def show_cancel(q: Q):
    q.page['form'].progress.caption = 'Cancelled'
    await q.page.save()


async def update_ui(q: Q, value: int):
    q.page['form'].progress.value = value
    await q.page.save()


@app('/demo')
async def serve(q: Q):
    # Unimportant, draw initial UI.
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 3 2', items=[
            ui.inline([
                ui.button(name='start_job', label='Start job'),
                ui.button(name='cancel', label='Cancel')
            ]),
            ui.progress(name='progress', label='Progress', value=0),
        ])
        q.client.initialized = True

    # Handle start job button click.
    if q.args.start_job:
        # Do not run like this - will block the whole thread - freeze the app.
        # blocking_function(q, loop)

        # Get the current event loop - will be used for
        # running async functions within the blocking.
        loop = asyncio.get_event_loop()
        # Create an event to use for cancellation.
        q.client.event = Event()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            await q.exec(pool, blocking_function, q, loop)

    if q.args.cancel:
        q.client.event.set()

    await q.page.save()
