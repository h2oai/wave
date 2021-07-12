#library(h2owave)

app("/demo",mode='multicast')
serve <- function(qo)
{
    qo$user$test <- ifelse(is.null(qo$user$test),0, qo$user$test)
    ifelse(qo$args$increment == TRUE,qo$user$test <- qo$user$test + 1,qo$user$test <- 0)
    if(length(qo$args) == 0 || qo$args$increment == FALSE){
        qo$page$add_card("example",ui_form_card(
                                                box='1 1 12 10'
                                                ,items = list(
                                                              ui_button(
                                                                        name='increment'
                                                                        ,label=paste0('Count= ',qo$user$test)
                                                                        ,primary = TRUE
                                                              )
                                                )
                                                ))
    }
    else {
        qo$page$set("example","items","0","button","label",paste0("Count=",qo$user$test))
    }
    qo$page$save()
}
