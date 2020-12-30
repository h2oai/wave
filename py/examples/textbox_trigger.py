# Form / Textbox / Trigger
# To handle live changes to a #textbox, enable the `trigger` attribute.
# #form #trigger
# ---
from h2o_wave import main, app, Q, ui


def to_pig_latin(text: str):
    if text is None:
        return ''
    words = text.lower().strip().split(" ")
    text = []
    for word in words:
        if word[0] in 'aeiou':
            text.append(f'{word}yay')
        else:
            for letter in word:
                if letter in 'aeiou':
                    text.append(f'{word[word.index(letter):]}{word[:word.index(letter)]}ay')
                    break
    return " ".join(text)


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 4 10', items=[
        ui.textbox(name='text', label='English', value=q.args.text or '', multiline=True, trigger=True),
        ui.label('Pig Latin'),
        ui.text(to_pig_latin(q.args.text) or '*Type in some text above to translate to Pig Latin!*'),
    ])
    await q.page.save()
