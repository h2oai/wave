#library(h2owave)

app("/demo")
serve <- function(qo)
{
    qo$client$test <- ifelse(is.null(qo$client$test),0, qo$client$test)
    ifelse(qo$args$increment == TRUE,qo$client$test <- qo$client$test + 1,qo$client$test <- 0)
    if(length(qo$args) == 0 || qo$args$increment == FALSE){
        qo$page$add_card("example",ui_form_card(
                                                box='1 1 12 10'
                                                ,items = list(
                                                              ui_button(
                                                                        name='increment'
                                                                        ,label=paste0('Count= ',qo$client$test)
                                                                        ,primary = TRUE
                                                              )
                                                )
                                                ))
    }
    else {
        qo$page$set("example","items","0","button","label",paste0("Count=",qo$client$test))
    }
    qo$page$save()
}
