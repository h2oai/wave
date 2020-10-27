# Background Tasks / Executor
# Use q.exec() to execute background functions using a thread-pool or process-pool.
# ---
import time
import random
import concurrent.futures
from h2o_wave import ui, Q, app, main


def blocking_function(secs) -> str:
    time.sleep(secs)  # Blocks!
    return f'Done waiting for {secs} seconds!'


@app(route='/demo')
async def serve(q: Q):
    if q.args.start:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[ui.progress('Running...')])
        await q.page.save()

        seconds = random.randint(1, 6)

        # DON'T DO THIS!
        # This will make your app unresponsive for some time:
        # message = blocking_function(seconds)

        # Do this instead:
        with concurrent.futures.ThreadPoolExecutor() as pool:
            message = await q.exec(pool, blocking_function, seconds)

        # You can also pass a ProcessPoolExecutor, like this:
        # with concurrent.futures.ProcessPoolExecutor() as pool:
        #    message = await q.exec(pool, blocking_function, seconds)

        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[ui.message_bar('info', message)])
        await q.page.save()
    else:
        q.args.start = True
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[ui.button(name='start', label='Start')])
        await q.page.save()
