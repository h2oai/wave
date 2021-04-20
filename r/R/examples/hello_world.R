# Hello World!
# A Hello World! program showing a simple message. 
# --

library(h2owave)

page <- Site("/demo")

page$add_card("hello",ui_markdown_card(box="1 1 2 2",
                    title="Hello World!"
                    ,content='And now for something complete different!'
                    ))

page$save()