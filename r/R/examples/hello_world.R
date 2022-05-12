# Hello World!
# A Hello World! program showing a simple message. 
# --

library(h2owave)

page <- Site("/demo")
page$drop()

page$add_card("hello",ui_markdown_card(box="1 1 2 2",
                    title="Hello World!"
                    ,content='And now for something completely different!'
                    ))

page$save()
