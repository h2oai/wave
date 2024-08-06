# Graphics / Background Image
# Set a background image behind your #graphics.
# Original example: https://docs.python.org/3/library/turtle.html
# ---
from h2o_wave import site, ui, graphics as g

t = g.turtle().f(100).r(90).pd()
for _ in range(36):
    t.f(200).l(170)
spirograph = t.pu(1).path(stroke='red', fill='yellow')

page = site['/demo']
page['example'] = ui.graphics_card(
    box='1 1 3 4', view_box='0 0 220 220', width='100%', height='100%',
    scene=g.scene(foo=spirograph), 
    path='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
)

page.save()
