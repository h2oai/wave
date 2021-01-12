#source("../core.R")
#source("../ui.R")
library(h2owave)
library(tokenizers)
base_url <- "https://programminghistorian.org/assets/basic-text-processing-in-r"
url <- sprintf("%s/sotu_text/236.txt", base_url)
text <- paste(readLines(url), collapse = "\n")
sentences <- tokenize_sentences(text)
captions <- sentences[[1]][sample(seq(1,length(sentences[[1]])),1)]

card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_pc <- as.integer(runif(1,1,100))

test_page <- page("/page_demo")
test_page <- page.add(test_page,"/page_demo","test",ui_large_stat_card(box="1 1 2 2"
                                                                       ,title=card_title
                                                                       ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                       ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                       ,data=list(foo=card_value,bar=card_pc/100)
                                                                       ,caption=captions
                                                                       ))

page.save(test_page,"/page_demo")

while(TRUE)
{
  Sys.sleep(3)
  card_pc <- as.integer(runif(1,1,100))
  card_value <- as.character(sample(mtcars[['mpg']],1))
  captions <- sentences[[1]][sample(seq(1,length(sentences[[1]])),1)]
  test_page[[1]]$value$data$foo <- card_value
  test_page[[1]]$value$data$bar <- card_pc/100
  test_page[[1]]$value$caption <- captions
  page.save(test_page,"/page_demo")
}
