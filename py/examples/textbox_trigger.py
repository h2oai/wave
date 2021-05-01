# Form / Textbox / Trigger
# To handle live changes to a #textbox, enable the `trigger` attribute.
# #form #trigger
# ---
from h2o_wave import main, app, Q, ui


def to_pig_latin(text: str):
    if not text:
        return '*Type in some text above to translate to Pig Latin!*'
    words = text.lower().strip().split(' ')
    texts = []
    for word in words:
        if word[0] in 'aeiou':
            texts.append(f'{word}yay')
        else:
            for letter in word:
                if letter in 'aeiou':
                    texts.append(f'{word[word.index(letter):]}{word[:word.index(letter)]}ay')
                    break
    return ' '.join(texts)


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.textbox(name='text', label='English', multiline=True, trigger=True),
            ui.label('Pig Latin'),
            ui.text('*Type in some text above to translate to Pig Latin!*'),
        ])
        q.client.initialized = True
    if q.args.text is not None:
        q.page['example'].items[2].text.content = to_pig_latin(q.args.text)
    await q.page.save()
