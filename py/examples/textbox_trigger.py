# Form / Textbox / trigger
# Use a textbox with a trigger flag to allow users to sync user input after typing.
# ---
from h2o_q import Q, listen, ui

def convert_to_piglatin(pigLatin: str):
  if pigLatin is None:
    return ''
  wordList = pigLatin.lower().strip().split(" ")
  pigLatin = []
  for word in wordList:
      if word[0] in 'aeiou':
          pigLatin.append(f'{word}yay')
      else:
          for letter in word:
              if letter in 'aeiou':
                  pigLatin.append(f'{word[word.index(letter):]}{word[:word.index(letter)]}ay')
                  break
  return " ".join(pigLatin)


async def main(q: Q):
    q.page['example'] = ui.form_card(box='1 1 4 10', items=[
        ui.text(f'Pig latin translation={convert_to_piglatin(q.args.translation)}'),
        ui.textbox(name='translation', label='Text for translation', multiline=True, trigger=True),
    ])
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
