---
title: "Tutorial: Beer Wall"
---

In this tutorial, we'll learn how to update a web page periodically and observe our changes live in the browser. Completing this tutorial should improve your understanding of how easy it is to use Wave to publish information in realtime.

The program we'll be writing is a verse generator for the runaway mid-20th century smash hit, [99 Bottles of Beer](https://en.wikipedia.org/wiki/99_Bottles_of_Beer), which looks something like this:

> 99 bottles of beer on the wall, 99 bottles of beer.<br/>
> Take one down, pass it around, 98 bottles of beer on the wall...
>
> 98 bottles of beer on the wall, 98 bottles of beer.<br/>
> Take one down, pass it around, 97 bottles of beer on the wall...
>
> ...

<video autoPlay='autoplay' loop='loop' muted='muted'><source src={require('./assets/tutorial-beer__demo.mp4').default} type='video/mp4'/></video>

Our program will be analogous to [our "Hello, World!" program](tutorial-hello.mdx), with the addition of a loop. We'll generate a verse every second, and observe the verse change in the browser in realtime. After that, we'll take a stab at making our program a bit more efficient, introducing how [expressions](expressions.md) work.

(Incidentally, Donald Knuth proved that this song has a complexity of `O(log N)` in ["The Complexity of Songs"](http://www.cs.bme.hu/~friedl/alg/knuth_song_complexity.pdf), but we won't let that little detail deter us for now.)

## Prerequisites

This tutorial assumes your Wave server is up and running, and you have a working directory for authoring programs. If not, head over to the [Hello World tutorial](tutorial-hello.mdx) and complete steps 1 and 2.

## Step 1: Write your program

Our program looks like this. It's mostly similar to the one in the  [Hello World tutorial](tutorial-hello.mdx), with one exception: we're setting the markdown card's content inside a `for` loop.

```py {13-18} title="$HOME/wave-apps/beer_wall.py"
import time
from h2o_wave import site, ui

page = site['/beer']

beer_card = page.add('wall', ui.markdown_card(
    box='1 1 4 2',
    title='99 Bottles of Beer',
    content='',
))

for i in range(99, 0, -1):
    beer_card.content = f"""
{i} bottles of beer on the wall, {i} bottles of beer.

Take one down, pass it around, {i - 1} bottles of beer on the wall...
"""
    page.save()
    time.sleep(1)
```

## Step 2: Run your program

```shell
cd $HOME/wave-apps
./venv/bin/python beer_wall.py
```

## Step 3: Watch updates live

Point your browser to [http://localhost:10101/beer](http://localhost:10101/beer), and watch the verses fly by.

<video autoPlay='autoplay' loop='loop' muted='muted'><source src={require('./assets/tutorial-beer__demo.mp4').default} type='video/mp4'/></video>

## Step 4: Make it more efficient

Our program is accurate, but not necessarily efficient. Every second, it sends the entire verse in its entirety to the Wave server, with only minuscule changes (`i` and `i-1`). You can observe this in the Wave server's log (switch to the terminal window running the Wave server to view the log):  

```
2020/10/02 12:13:43 * /beer {"d":[{"k":"wall content","v":"\n98 bottles of beer on the wall, 98 bottles of beer.\n\nTake one down, pass it around, 97 bottles of beer on the wall...\n"}]}
2020/10/02 12:13:44 * /beer {"d":[{"k":"wall content","v":"\n97 bottles of beer on the wall, 97 bottles of beer.\n\nTake one down, pass it around, 96 bottles of beer on the wall...\n"}]}
2020/10/02 12:13:46 * /beer {"d":[{"k":"wall content","v":"\n96 bottles of beer on the wall, 96 bottles of beer.\n\nTake one down, pass it around, 95 bottles of beer on the wall...\n"}]}
2020/10/02 12:13:47 * /beer {"d":[{"k":"wall content","v":"\n95 bottles of beer on the wall, 95 bottles of beer.\n\nTake one down, pass it around, 94 bottles of beer on the wall...\n"}]}
2020/10/02 12:13:48 * /beer {"d":[{"k":"wall content","v":"\n94 bottles of beer on the wall, 94 bottles of beer.\n\nTake one down, pass it around, 93 bottles of beer on the wall...\n"}]}
```

We can do better. Instead of sending the verse over and over again, we can send the verse once with placeholders for `i` and `i-1`, and then send only `i` and `i-1` during subsequent updates. That will keep network traffic down to a minimum and allow the Wave server to perform less work while sending your updates to your website's bajillion visitors.

Here's how we approach this. First, when we create our markdown card, we set the content to an *expression* (or *formula*). An expression is a string that starts with `=` (similar to formulae in spreadsheet software). Our expression looks like this:

```py
beer_verse = '''={{before}} bottles of beer on the wall, {{before}} bottles of beer.

Take one down, pass it around, {{after}} bottles of beer on the wall...
'''
```

We've used a triple-quoted multi-line string here, but you can use single- or double-quoted strings as well. The tokens inside the `{{` and `}}` are placeholders. Note how the verse string starts with a `=`, indicating that this is an expression.

Next, we create the markdown card as usual using our verse as the `content`. But more importantly, we set the card's `data` attribute to a Python dictionary containing values for the placeholders `before` and `after`:

```py {4-5}
beer_card = page.add('wall', ui.markdown_card(
    box='1 1 4 2',
    title='99 Bottles of Beer',
    content=beer_verse,
    data=dict(before='99', after='98'),
))
```

Finally, instead of updating the entire verse every second, we update only the `.data.before` and `.data.after` attributes of the markdown card:

```py {2-3}
for i in range(99, 0, -1):
    beer_card.data.before = str(i)
    beer_card.data.after = str(i - 1)
    page.save()
    time.sleep(1)
```

Our final program looks like the listing below. You'll notice that the size of our program is mostly unchanged from before.

```py
import time
from h2o_wave import site, ui

page = site['/beer']

beer_verse = '''={{before}} bottles of beer on the wall, {{before}} bottles of beer.

Take one down, pass it around, {{after}} bottles of beer on the wall...
'''

beer_card = page.add('wall', ui.markdown_card(
    box='1 1 4 2',
    title='99 Bottles of Beer',
    content=beer_verse,
    data=dict(before='99', after='98'),
))

for i in range(99, 0, -1):
    beer_card.data.before = str(i)
    beer_card.data.after = str(i - 1)
    page.save()
    time.sleep(1)
```

Run your program again. You should see the same results in your browser as before, but you'll notice that the information flowing through the Wave server is significantly less than before:

```
2020/10/02 13:53:11 * /beer {"d":[{"k":"wall data before","v":"98"},{"k":"wall data after","v":"97"}]}
2020/10/02 13:53:12 * /beer {"d":[{"k":"wall data before","v":"97"},{"k":"wall data after","v":"96"}]}
2020/10/02 13:53:13 * /beer {"d":[{"k":"wall data before","v":"96"},{"k":"wall data after","v":"95"}]}
2020/10/02 13:53:14 * /beer {"d":[{"k":"wall data before","v":"95"},{"k":"wall data after","v":"94"}]}
2020/10/02 13:53:15 * /beer {"d":[{"k":"wall data before","v":"94"},{"k":"wall data after","v":"93"}]}
2020/10/02 13:53:16 * /beer {"d":[{"k":"wall data before","v":"93"},{"k":"wall data after","v":"92"}]}
```

## Summary

In this tutorial, we learned how to send periodic updates to the Wave server and observe changes in realtime.

In the next tutorial, we'll put these principles to real-world use, popping up charts for a song instead of chart topping pop songs.
