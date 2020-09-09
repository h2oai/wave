source("../core.R") 

test_page <- page("/page_demo")

test_page <- page.add(test_page,"/page_demo","test",ui_small_stat_card(box="1 1 1 1",title="test",value="$55.05"))

page.save(test_page,"/page_demo")

