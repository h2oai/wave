source("../core.R") 
source("../ui.R")

value_list = c("$85.00","$100","$343.43","$1.00","$10","$30","$54")
test_page <- page("/page_demo")

test_page <- page.add(test_page,"/page_demo","test",ui_small_stat_card(box="1 1 1 1",title="test",value="$55.05"))

page.save(test_page,"/page_demo")


while(TRUE)
{
        Sys.sleep(3)
        test_page[[1]]$value$value <- sample(value_list,1)
        page.save(test_page,"/page_demo")
}

