library(h2owave)

serve <- function(qo)
{
    qo$app$test <- ifelse(is.null(qo$app$test),0, qo$app$test)
    ifelse(qo$args$increment == TRUE,qo$app$test <- qo$app$test + 1,qo$app$test <- 0)
    if(length(qo$args) == 0 || qo$args$increment == FALSE){
        qo$page$add_card("example",ui_form_card(
                                                box='1 1 12 10'
                                                ,items = list(
                                                              ui_button(
                                                                        name='increment'
                                                                        ,label=paste0('Count= ',qo$app$test)
                                                                        ,primary = TRUE
                                                              )
                                                )
                                                ))
    }
    else {
        qo$page$set("example","items","0","button","label",paste0("Count=",qo$app$test))
    }
    qo$page$save()
}
app("/demo",mode='broadcast')
