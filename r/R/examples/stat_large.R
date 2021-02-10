#library(h2owave)


captions <- list("Our Constitution begins with those three simple words."
                 ,"Words we've come to recognize mean all the people, not just some."
                 ,"Words that insist we rise and fall together"
                 , "That that's how we might perfect our Union."
                 )

card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_pc <- as.integer(runif(1,1,100))

if("page.name" %in% names(page)) page$drop()
page <- Site("/demo")
page$add.card("test",ui_large_stat_card(box="1 1 2 2"
                                                                       ,title=card_title
                                                                       ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                       ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                       ,data=list(foo=card_value,bar=card_pc/100)
                                                                       ,caption=sample(captions,1)[[1]]
                                                                       ))
page$save()

while(TRUE)
{
  Sys.sleep(3)
  card_pc <- as.integer(runif(1,1,100))
  card_value <- as.character(sample(mtcars[['mpg']],1))
  caption <- sample(captions,1)[[1]]
  page$page[[1]]$value$data$foo <- card_value
  page$page[[1]]$value$data$bar <- card_pc/100
  page$page[[1]]$value$caption <- caption
  page$save()
}
