import random
from unicodedata import name
from h2o_wave import app, main, Q, ui

path = "https://images.unsplash.com/photo-1664136535720-ce2cd0087987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"


@app("/demo")
async def serve(q: Q) -> None:
    q.page["grid"] = ui.image_grid_card(box="1 1 8 12", height="100px", images=(
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig={i}") for i in range(3)] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig=110", width='100px')] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig={i}") for i in range(4)] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig=111", width='80px')] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig=112", width='450px')] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig={i}") for i in range(8)] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig=113", width='100px')] +
        [ui.image(title="hello-{i}", path=f"https://source.unsplash.com/random/sig={i}") for i in range(10)]
    ))

    await q.page.save()