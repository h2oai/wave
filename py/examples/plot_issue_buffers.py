from h2o_wave import main, app, Q, ui, data


# Array buffer - rows
ar = data(fields='price low high', size=8, rows=[
        [8, 150, 200],
        [4, 50, 100],
        [6, 100, 150],
        [16, 350, 400],
        [18, 400, 450],
        [14, 300, 350],
        [10, 200, 250],
        [12, 250, 300],
    ], pack=False)

# Array buffer - columns
ac = data(fields='price low high', size=8, columns=[
        [4,6,8,16,18,10,12,14],
        [50,100,150,350,400,200,250,300],
        [100,150,200,400,450,250,300,350]
    ], pack=False)

# Cyclic buffer - rows
cr = data(fields='price low high', size=-8, rows=[
        [4, 50, 100],
        [6, 100, 150],
        [8, 150, 200],
        [16, 350, 400],
        [18, 400, 450],
        [10, 200, 250],
        [12, 250, 300],
        [14, 300, 350],
    ], pack=False) # pack=False not working

# Map buffer - rows
mr = data(fields='price low high', rows=dict(
        fst=[4, 50, 100],
        snd=[6, 100, 150],
        trd=[8, 150, 200],
        fth=[16, 350, 400],
        fih=[18, 400, 450],
        sth=[10, 200, 250],
        seh=[12, 250, 300],
        nth=[14, 300, 350],
))

# Map buffer - columns
# mc = data(fields='price low high', columns=dict(
#         fst=[4,6,8,16,18,10,12,14],
#         snd=[50,100,150,350,400,200,250,300],
#         trd=[100,150,200,400,450,250,300,350]
# ))

@app('/demo')
async def serve(q: Q):
        if not q.client.initialized:
            q.page['meta'] = ui.meta_card(box='')
            q.page['example'] = ui.plot_card(
                box='1 1 4 5',
                title='Histogram',
                data=cr,
                plot=ui.plot([ui.mark(type='interval', y='=price', x1='=low', x2='=high', y_min=0)]),
            )
            q.page['btn'] = ui.form_card(box='5 6 2 2', items=[ui.button(name='change_data', label='Change data', primary=True)])
            q.client.initialized = True
        elif q.args.change_data:
            q.page['example'].data[2] = [9,160,210]

        await q.page.save()