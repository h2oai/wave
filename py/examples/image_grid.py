import random
from unicodedata import name
from h2o_wave import app, main, Q, ui

path = "https://images.unsplash.com/photo-1664136535720-ce2cd0087987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"


@app("/demo")
async def serve(q: Q) -> None:
    q.page["grid"] = ui.image_grid_card(box="1 1 5 6", height="100px", images=[
        ui.grid_image(title="hello", path=f"https://source.unsplash.com/random/sig={i}") for i in range(100)
    ])

    await q.page.save()