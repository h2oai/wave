# Graphics / Spline
# Use the #graphics module to render splines.
# ---

import random
from h2o_wave import site, ui, graphics as g

x = [i * 20 for i in range(50)]
y = [
    88, 100, 116, 128, 126, 128, 118, 108, 121, 120, 99, 113, 117, 103, 98, 90, 104, 98, 82, 102, 104, 89, 87, 69,
    88, 97, 91, 105, 98, 86, 90, 107, 97, 107, 108, 128, 144, 148, 126, 106, 89, 99, 78, 70, 69, 64, 45, 29, 27, 38
]
y0 = [v - random.randint(5, min(y)) for v in y]

line_style = dict(fill='none', stroke='crimson', stroke_width=4)
area_style = dict(fill='crimson')

splines = [
    # Lines
    g.spline(x=x, y=y, **line_style),  # same as curve='linear'
    g.spline(x=x, y=y, curve='basis', **line_style),
    g.spline(x=x, y=y, curve='basis-closed', **line_style),
    g.spline(x=x, y=y, curve='basis-open', **line_style),
    g.spline(x=x, y=y, curve='cardinal', **line_style),
    g.spline(x=x, y=y, curve='cardinal-closed', **line_style),
    g.spline(x=x, y=y, curve='cardinal-open', **line_style),
    g.spline(x=x, y=y, curve='smooth', **line_style),
    g.spline(x=x, y=y, curve='smooth-closed', **line_style),
    g.spline(x=x, y=y, curve='smooth-open', **line_style),
    g.spline(x=x, y=y, curve='linear', **line_style),
    g.spline(x=x, y=y, curve='linear-closed', **line_style),
    g.spline(x=x, y=y, curve='monotone-x', **line_style),
    g.spline(x=x, y=y, curve='monotone-y', **line_style),
    g.spline(x=x, y=y, curve='natural', **line_style),
    g.spline(x=x, y=y, curve='step', **line_style),
    g.spline(x=x, y=y, curve='step-after', **line_style),
    g.spline(x=x, y=y, curve='step-before', **line_style),
    # Areas
    g.spline(x=x, y=y, y0=y0, **area_style),  # same as curve='linear'
    g.spline(x=x, y=y, y0=y0, curve='basis', **area_style),
    g.spline(x=x, y=y, y0=[], curve='basis', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='basis-open', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='cardinal', **area_style),
    g.spline(x=x, y=y, y0=[], curve='cardinal', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='cardinal-open', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='smooth', **area_style),
    g.spline(x=x, y=y, y0=[], curve='smooth', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='smooth-open', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='linear', **area_style),
    g.spline(x=x, y=y, y0=[], curve='linear', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='monotone-x', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='monotone-y', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='natural', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='step', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='step-after', **area_style),
    g.spline(x=x, y=y, y0=y0, curve='step-before', **area_style),
]

page = site['/demo']
row, col = 1, 1
for spline in splines:
    page[f'spline_{col}_{row}'] = ui.graphics_card(
        box=f'{col} {row} 3 1', view_box='0 0 1000 150', width='100%', height='100%',
        stage=g.stage(
            text=g.text(text=spline.curve or '', y=40, font_size=40),
            spline=spline,
        ),
    )
    col += 3
    if col > 11:
        row, col = row + 1, 1

page.save()
