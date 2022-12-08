---
title: Frame
keywords:
  - frame
custom_edit_url: null
---

Use a frame card to display embed external HTML content on your page.

Check the full API at [ui.frame_card](/docs/api/ui#frame_card).

```py
html = '''
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
</body>
</html>
'''

q.page['example'] = ui.frame_card(box='1 1 2 2', title='Example', content=html)
```

You can specify the value of the parameter `compact` to True to remove the title and padding of a frame card. 

```py
html = '''
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
</body>
</html>
'''

q.page['example'] = ui.frame_card(box='1 1 2 2', title='Example', content=html, compact=True)
```