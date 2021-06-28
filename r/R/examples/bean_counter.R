#library(h2owave)

app("/demo")
serve <- function(route)
{
    print(paste0("route ",route))
    print(paste0("from beancounter ",q$client))
#    q$client$test <- runif(1)
#    ifelse(q$client$test <- q$client$test + 1
    print(paste0("from client test ", is.null(q$client$test)))
    q$client$test <- ifelse(is.null(q$client$test),0, q$client$test)
#    print(q)
#    print(paste0("private-client ",q$.__enclos_env__$private$.client))
    ifelse(q$args$increment == TRUE,q$client$test <- q$client$test + 1,q$client$test <- 0)
    print("within serve")
    print(environment())
    print(parent.env(environment()))
    print(paste0("envlist ",ls()))
#    q$test <- q$test + 1
    print(paste0("q-value: ",q$test))
    page <- Site(route)
    count = 0
    page$add_card("example",ui_form_card(
                                         box='2 2 12 10'
                                         ,items = list(
                                                       ui_button(
                                                                 name='increment'
                                                                 ,label=paste0('Count=',q$client$test)
                                                       )
                                         )
                                         ))
    page$save()
    print("we exited")
}
