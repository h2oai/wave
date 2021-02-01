library(h2owave)

captions <- list("Our Constitution begins with those three simple words."
                 ,"Words we've come to recognize mean all the people, not just some."
                 ,"Words that insist we rise and fall together"
                 , "That that's how we might perfect our Union."
                 )

card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_pc <- as.integer(runif(1,1,100))

test_page <- page("/page_demo")
test_page <- page.add(test_page,"/page_demo","test",ui_large_bar_stat_card(box="1 1 2 2"
                                                                          ,title=card_title
                                                                          ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                          ,value_caption='This Month'
                                                                          ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                          ,aux_value_caption='Previous Month'
                                                                          ,plot_color='$red'
                                                                          ,data=list(foo=card_value,bar=card_pc/100)
                                                                          ,progress = card_pc/100
                                                                          ,caption=sample(1,captions)[[1]]
))

page.save(test_page,"/page_demo")

while(TRUE){
  Sys.sleep(3)
  card_pc <- as.integer(runif(1,1,100))
  card_value <- as.character(sample(mtcars[['mpg']],1))
  test_page[[1]]$value$data$foo <- card_value
  test_page[[1]]$value$data$bar <- card_pc/100
  test_page[[1]]$value$progress <- card_pc/100
  page.save(test_page,"/page_demo")
}
