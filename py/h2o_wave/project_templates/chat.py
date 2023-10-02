from h2o_wave import main, app, Q, ui, on, run_on, data
from typing import Optional, List


# Use for page cards that should be removed when navigating away.
# For pages that should be always present on screen use q.page[key] = ...
def add_card(q, name, card) -> None:
    q.client.cards.add(name)
    q.page[name] = card


# Remove all the cards related to navigation.
def clear_cards(q, ignore: Optional[List[str]] = []) -> None:
    if not q.client.cards:
        return

    for name in q.client.cards.copy():
        if name not in ignore:
            del q.page[name]
            q.client.cards.remove(name)


@on('prompt1')
async def prompt1(q: Q):
    q.page['chatbot'].data += ['What is the weather in London?', True]
    # TODO: Call the model to get the response.
    q.page['chatbot'].data += ['I am a fake chatbot. Sorry, my author needs to plug me onto a real model.', False]


@on('prompt2')
async def prompt2(q: Q):
    q.page['chatbot'].data += ['How many people live in New York?', True]
    # TODO: Call the model to get the response.
    q.page['chatbot'].data += ['I am a fake chatbot. Sorry, my author needs to plug me onto a real model.', False]


@on('prompt3')
async def prompt3(q: Q):
    q.page['chatbot'].data += ['What is the population of San Francisco?', True]
    # TODO: Call the model to get the response.
    q.page['chatbot'].data += ['I am a fake chatbot. Sorry, my author needs to plug me onto a real model.', False]


@on('chatbot')
async def chatbot(q: Q):
    del q.page['main-section']
    q.page['chatbot'].data += [q.args.chatbot, True]
    # TODO: Call the model to get the response.
    q.page['chatbot'].data += ['I am a fake chatbot. Sorry, my author needs to plug me onto a real model.', False]


@on('#chat')
async def chat_page(q: Q):
    q.page['sidebar'].value = '#chat'
    clear_cards(q)  # When routing, drop all the cards except of the main ones (header, sidebar, meta).

    add_card(q, 'main-section', ui.form_card(box='vertical', items=[
        ui.text_xl('<center>Ask me anything</center>'),
        ui.frame(content='<span></span>', height='10px'),
        ui.text('<center>I am able to answer any question that can be extracted from the uploaded documents. Here are some examples to get you started</center>'),
        ui.frame(content='<span></span>', height='30px'),
        ui.inline(items=[
            ui.button(name='prompt1', caption='What is the weather like in London?'),
            ui.button(name='prompt2', caption='How many people live in New York?'),
            ui.button(name='prompt3', caption='What is the population of San Francisco?'),
        ], justify='around'),
    ]))

    add_card(q, 'chatbot', ui.chatbot_card(
        box=ui.box('vertical', size=5),
        data=data('content from_user', t='list'), name='chatbot')
    )


@on('#upload')
async def upload_page(q: Q):
    q.page['sidebar'].value = '#upload'
    clear_cards(q)  # When routing, drop all the cards except of the main ones (header, sidebar, meta).

    add_card(q, 'form', ui.form_card(box='vertical', items=[
        ui.file_upload(name='file_upload', label='Upload your documents', multiple=True),
        ui.table(
            name='uploaded_files',
            height='300px',
            columns=[ui.table_column(name='name', label='File name', min_width='500px', link=False)],
            rows=[ui.table_row(name=f'row{i}', cells=[file]) for i, file in enumerate(q.client.uploaded_files)]
        )
    ]))


@on('file_upload')
async def file_upload(q: Q):
    # TODO: Upload files to the model if necessary.
    for f in q.args.file_upload:
        q.client.uploaded_files.append(f.split('/')[-1])
    rows = [ui.table_row(name=f'row{i}', cells=[file]) for i, file in enumerate(q.client.uploaded_files)]
    q.page['form'].uploaded_files.rows = rows


async def init(q: Q) -> None:
    q.page['meta'] = ui.meta_card(box='', layouts=[ui.layout(breakpoint='xs', min_height='100vh', zones=[
        ui.zone('main', size='1', direction=ui.ZoneDirection.ROW, zones=[
            ui.zone('sidebar', size='250px'),
            ui.zone('body', zones=[
                ui.zone('vertical', size='100vh'),
            ]),
        ])
    ])])
    q.page['sidebar'] = ui.nav_card(
        box='sidebar', color='primary', title='My App', subtitle="Let's conquer the world!",
        value=f'#{q.args["#"]}' if q.args['#'] else '#chat',
        image='https://wave.h2o.ai/img/h2o-logo.svg', items=[
            ui.nav_group('Menu', items=[
                ui.nav_item(name='#chat', label='Chat'),
                ui.nav_item(name='#upload', label='Upload files'),
            ]),
        ],
        secondary_items=[
            ui.persona(title='John Doe', subtitle='Developer', size='s',
                       image='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'),
        ]
    )

    # If no active hash present, render chat page.
    if q.args['#'] is None:
        await chat_page(q)


@app('/')
async def serve(q: Q):
    # Run only once per client connection.
    if not q.client.initialized:
        q.client.cards = set()
        q.client.uploaded_files = []
        await init(q)
        q.client.initialized = True

    # Handle routing.
    await run_on(q)
    await q.page.save()
