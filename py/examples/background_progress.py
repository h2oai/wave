# Background Tasks / Progress
# Execute background functions while incrementing a #progress bar.
# #background_tasks
# ---
import time
import asyncio
import concurrent.futures
from h2o_wave import main, app, Q, ui


# A long-running that performs a blocking operation, in this case time.sleep()
def blocking_function(secs) -> str:
    time.sleep(secs)  # Blocks!
    return 'Download completed!'


# An async function that displays a progress bar
async def display_progress_bar(q: Q, form, seconds: int):
    for i in range(seconds):
        progress_value = (i + 1.0) / seconds
        form.items = [
            ui.progress(
                label='Downloading the interwebs...',
                caption=f'{int(progress_value * 100)}%',
                value=progress_value,
            )
        ]
        await q.page.save()
        await q.sleep(1)


@app('/demo')
async def serve(q: Q):
    if q.args.start:  # The button named 'start' was clicked
        seconds = 5

        # Grab a reference to the form
        form = q.page['form']

        # Start incrementing the progress bar in the background
        future = asyncio.ensure_future(display_progress_bar(q, form, seconds))

        # Execute our long-running function in the background
        with concurrent.futures.ThreadPoolExecutor() as pool:
            message = await q.exec(pool, blocking_function, seconds)

        # Stop the progress bar (optional unless we used a infinite while loop in display_progress_bar()).
        future.cancel()

        # At this point, we're done with the long-running function; so display a completion message
        form.items = [ui.message_bar('info', message)]
        await q.page.save()
    else:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[ui.button(name='start', label='Start')])
        await q.page.save()
