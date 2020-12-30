# Graphics / Primitives
# Use the #graphics module to render and update shapes.
# ---

from h2o_wave import site, ui, graphics as g

# Create some shapes
arc = g.arc(r1=25, r2=50, a1=90, a2=180)
circle = g.circle(cx=25, cy=25, r=25)
ellipse = g.ellipse(cx=25, cy=25, rx=25, ry=20)
image = g.image(width=50, height=50, href='https://www.python.org/static/community_logos/python-powered-h-140x182.png')
line = g.line(x1=0, y1=0, x2=50, y2=50)
path = g.path(d='M 0,0 L 50,50 L 50,0 L 0,50 z')
path2 = g.path(d=g.p().M(0, 0).L(50, 50).L(50, 0).L(0, 50).z().d())  # same effect as above, but programmable.
path3 = g.p().M(0, 0).L(50, 50).L(50, 0).L(0, 50).z().path()  # same effect as above, but a tad more concise.
polygon = g.polygon(points='0,0 50,50 50,0 0,50')
polyline = g.polyline(points='0,0 50,50 50,0 0,50')
rect = g.rect(x=0, y=0, width=50, height=50)
rounded_rect = g.rect(x=0, y=0, width=50, height=50, rx=10)
text = g.text(x=0, y=48, text='Z', font_size='4em')

# Collect 'em all
shapes = [arc, circle, ellipse, image, line, path, path2, path3, polygon, polyline, rect, rounded_rect, text]

# Apply fill/stroke for each shape
for shape in shapes:
    shape.fill = 'none' if g.type_of(shape) == 'polyline' else 'crimson'
    shape.stroke = 'darkred'
    shape.stroke_width = 5

# Lay out shapes vertically
y = 10
for shape in shapes:
    shape.transform = f'translate(10,{y})'
    y += 60

# Add shapes to the graphics card
page = site['/demo']
page['example'] = ui.graphics_card(
    box='1 1 1 10', view_box='0 0 70 800', width='100%', height='100%',
    stage=g.stage(
        arc=arc,
        circle=circle,
        ellipse=ellipse,
        image=image,
        line=line,
        path=path,
        path2=path2,
        path3=path3,
        polygon=polygon,
        polyline=polyline,
        rect=rect,
        rounded_rect=rounded_rect,
        text=text,
    ),
)

page.save()
