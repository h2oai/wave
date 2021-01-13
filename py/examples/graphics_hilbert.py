# Graphics / Hilbert
# Use turtle #graphics recursively to draw Hilbert curves.
# ---
from h2o_wave import ui, main, app, Q, graphics as g


def hilbert(t: g.Turtle, width: float, depth: int, reverse=False):  # recursive
    angle = -90 if reverse else 90

    if depth == 0:
        t.f(width).r(angle).f(width).r(angle).f(width)
        return

    side = width * ((2 ** depth) - 1) / float((2 ** (depth + 1)) - 1)
    edge = width - 2 * side

    t.r(angle)
    hilbert(t, side, depth - 1, not reverse)
    t.r(angle).f(edge)
    hilbert(t, side, depth - 1, reverse)
    t.l(angle).f(edge).l(angle)
    hilbert(t, side, depth - 1, reverse)
    t.f(edge).r(angle)
    hilbert(t, side, depth - 1, not reverse)
    t.r(angle)


def make_hilbert_curve(width: float, depth: int):
    t = g.turtle().f(0).pd()
    hilbert(t, width, depth)
    return t.d()


@app('/demo')
async def serve(q: Q):
    hilbert_curve = make_hilbert_curve(300, q.args.depth or 5)

    if not q.client.initialized:
        q.page['curve'] = ui.graphics_card(
            box='1 1 4 6', view_box='0 0 300 300', width='100%', height='100%',
            scene=g.scene(
                hilbert_curve=g.path(d=hilbert_curve, fill='none', stroke='#333')
            ),
        )
        q.page['form'] = ui.form_card(
            box='1 7 4 1', items=[
                ui.slider(name='depth', label='Play with this Hilbert curve!', min=1, max=6, value=5, trigger=True),
            ],
        )
        q.client.initialized = True
    else:
        g.draw(q.page['curve'].scene.hilbert_curve, d=hilbert_curve)

    await q.page.save()
