import random
from h2o_wave import site, ui, graphics as g

# Define a function to convert a list of values to float
def to_float(lst): # for example, [1, 2, 3] -> [1.0, 2.0, 3.0]
    return [float(v) for v in lst]

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
    g.spline(x=to_float(x), y=to_float(y), curve='basis', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='basis-closed', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='basis-open', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='cardinal', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='cardinal-closed', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='cardinal-open', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='smooth', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='smooth-closed', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='smooth-open', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='linear-closed', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='monotone-x', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='monotone-y', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='natural', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='step', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='step-after', style=line_style),
    g.spline(x=to_float(x), y=to_float(y), curve='step-before', style=line_style),
    # Areas
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='linear', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='basis', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=[], curve='basis', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='basis-open', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='cardinal', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=[], curve='cardinal', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='cardinal-open', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='smooth', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=[], curve='smooth', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='smooth-open', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='linear', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=[], curve='linear', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='monotone-x', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='monotone-y', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='natural', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='step', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='step-after', style=area_style),
    g.spline(x=to_float(x), y=to_float(y), y0=to_float(y0), curve='step-before', style=area_style),
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
