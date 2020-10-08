source("../core.R") 
source("../ui.R") 

card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
test_page <- page("/page_demo")

test_page <- page.add(test_page,"/page_demo","test",ui_small_stat_card(box="1 1 1 1",title=card_title,value=card_value))

page.save(test_page,"/page_demo")

