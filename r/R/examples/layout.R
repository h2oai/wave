
source("../core.R") 
source("../ui.R")

rm(test_page)
test_page <- page("/page_demo")

columns = 12
rows = 10

for(column in 1:columns){
        for(row in 1:rows){
               box = paste0(column," ",row," 1 1") 
        test_page <- page.add(test_page,"/page_demo",paste0("card_",column,"_",row),
                              ui_markdown_card(box=box,title=box,content=''))
        }}
page.save(test_page,"/page_demo")
