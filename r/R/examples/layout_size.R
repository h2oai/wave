source("../core.R") 
source("../ui.R")

rm(test_page)
test_page <- page("/page_demo")

boxes <- c("1 1 1 1",
	"2 1 2 1",
	"4 1 3 1",
	"7 1 4 1",
	"11 1 2 2",
	"1 2 1 9",
	"2 2 1 4",
	"3 2 1 2",
	"2 6 1 5",
	"3 4 1 7",
	"4 2 7 9",
	"11 9 2 2",
	"11 3 2 6"
    )

for(box in boxes){
        test_page <- page.add(test_page,"/page_demo",paste0("card_",gsub(" ","_",box)),
                              ui_markdown_card(box=box,title=box,content='')
                              )
}
page.save(test_page,"/page_demo")
