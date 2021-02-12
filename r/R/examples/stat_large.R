#library(h2owave)


caption <- "The data was extracted from 1974 Motor Trend US magazine, and it compares fuel consumption along with 10 other variables from 32 automobiles." 
sample.row <- mtcars[sample(nrow(mtcars),1),]
card.title <- row.names(sample.row)
card.value <- sample.row$mpg
card.aux.value <- sample.row$hp

if("page.name" %in% names(page)) page$drop()
page <- Site("/demo")
page$add.card("mtcars",ui_large_stat_card(box="1 1 2 2"
                                        ,title=card.title
                                        ,value='=mpg:{{intl mpg minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                        ,aux_value='=hp:{{intl hp}}'
                                        ,data=list(mpg=card.value,cyl=card.aux.value)
                                        ,caption=caption
                                        ))
page$save()

while(TRUE)
{
        Sys.sleep(3)
        sample.row <- mtcars[sample(nrow(mtcars),1),]
        card.title <- row.names(sample.row)
        card.value <- sample.row$mpg
        card.aux.value <- sample.row$hp
        page$set("mtcars","title",card.title)
        page$set("mtcars","data","mpg",card.value)
        page$set("mtcars","data","hp",card.aux.value)
        page$set("mtcars","data","caption",caption)
        page$save()
}
