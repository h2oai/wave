# Stream Images
# Display an image and continuously update it in real time.
# ---
import io
import time
import uuid

import cv2
from h2o_wave import app, Q, ui, main
import numpy as np

frame_count = 240


def create_random_image():
    frame = (np.random.rand(100, 100, 3) * 255).astype(np.uint8)
    _, img = cv2.imencode('.jpg', frame)
    return io.BytesIO(img)


@app('/demo')
async def serve(q: Q):
    # Mint a unique name for our image stream
    stream_name = f'stream/demo/{uuid.uuid4()}.jpeg'

    # Send image
    endpoint = await q.site.uplink(stream_name, 'image/jpeg', create_random_image())

    # Display image
    q.page['qux'] = ui.form_card(box='1 1 5 5', items=[ui.image('Image Stream', path=endpoint)])
    await q.page.save()

    t0 = time.time()
    # Update image in a loop
    for i in range(frame_count):
        print('updating')
        await q.sleep(1.0 / 60)
        # Send image (use stream name as before).
        await q.site.uplink(stream_name, 'image/png', create_random_image())

    await q.site.unlink(stream_name)

    print(f'{frame_count / (time.time() - t0)}fps')
