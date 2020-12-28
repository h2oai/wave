# Graphics / Turtle
# Use turtle #graphics to draw paths.
# Original example: https://docs.python.org/3/library/turtle.html
# ---
from h2o_wave import site, ui, graphics as g

t = g.turtle().f(100).r(90).pd()
for _ in range(36):
    t.f(200).l(170)
spirograph = t.pu(1).path(stroke='red', fill='yellow')

page = site['/demo']
page['example'] = ui.graphics_card(
    box='1 1 2 3', view_box='0 0 220 220', width='100%', height='100%',
    scene=g.scene(foo=spirograph),
)

page.save()
