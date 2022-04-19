from h2o_wave import main, Q, ui, app


@app('/demo')
async def serve(q: Q):

    q.page['form1'] = ui.form_card(box='1 1 3 3', title='justify start (default)', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form2'] = ui.form_card(box='4 1 3 3', justify='center', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form3'] = ui.form_card(box='7 1 3 3', title='justify end', justify='end', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form4'] = ui.form_card(box='1 4 3 3', title='justify start + align center', align='center', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form5'] = ui.form_card(box='4 4 3 3', title='justify center + align center', justify='center', align='center', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form6'] = ui.form_card(box='7 4 3 3', title='justify end + align center', justify='end', align='center', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form7'] = ui.form_card(box='1 7 3 3', title='justify start + align end', align='end', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form8'] = ui.form_card(box='4 7 3 3', title='justify center + align end', justify='center', align='end', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form9'] = ui.form_card(box='7 7 3 3', title='justify end + align end', justify='end', align='end', items=[
        ui.text_xl(content='Text'),
        ui.button(name='btn', label='click me')
    ])

    q.page['form10'] = ui.form_card(box='1 10 3 3', justify='center', items=[
        ui.inline(justify='center', items=[
            ui.text_xl(content='Text'),
        ]),
        ui.column(justify='end', items=[
            ui.inline(justify='around', items=[
                ui.button(name='btn1', label='click me'),
                ui.button(name='btn2', label='click me'),
                ui.button(name='btn3', label='click me'),
            ]),
        ]),
    ])

    await q.page.save()
