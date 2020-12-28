# Graphics / Clock
# Use the #graphics API to make a clock.
# Source: https://codepen.io/dudleystorey/pen/HLBki
# ---
import time
import datetime
from h2o_wave import site, ui, graphics as g

page = site['/demo']
page['example'] = ui.graphics_card(
    box='1 1 2 3', view_box='0 0 100 100', width='100%', height='100%',
    stage=g.stage(
        face=g.circle(cx='50', cy='50', r='45', fill='#111', stroke_width='2px', stroke='#f55'),
    ),
    scene=g.scene(
        hour=g.rect(x='47.5', y='12.5', width='5', height='40', rx='2.5', fill='#333', stroke='#555'),
        min=g.rect(x='48.5', y='12.5', width='3', height='40', rx='2', fill='#333', stroke='#555'),
        sec=g.line(x1='50', y1='50', x2='50', y2='16', stroke='#f55', stroke_width='1px'),
    ),
)

page.save()


def rotate(deg):
    return f'rotate({deg} 50 50)'


scene = page['example'].scene
while True:
    time.sleep(1)
    now = datetime.datetime.now()
    g.draw(scene.hour, transform=rotate(30 * (now.hour % 12) + now.minute / 2))
    g.draw(scene.min, transform=rotate(6 * now.minute))
    g.draw(scene.sec, transform=rotate(6 * now.second))
    page.save()
