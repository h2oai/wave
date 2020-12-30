# Graphics / Path
# Use the #graphics API to draw a red square.
# ---
from h2o_wave import site, ui, graphics as g

# Use relative coords to draw a square, sort of like Python's turtle package.
red_square = g.p().m(25, 25).h(50).v(50).h(-50).z().path(fill='red')

page = site['/demo']
page['example'] = ui.graphics_card(
    box='1 1 2 3', view_box='0 0 100 100', width='100%', height='100%',
    scene=g.scene(foo=red_square),
)

page.save()
