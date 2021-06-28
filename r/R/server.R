#library(httpuv)
#print("library")
#print(environment())
Q <- R6::R6Class("Q"
,private = list(
    .client = NULL
    ,.user = NULL
)
,public = list(
    route = NULL
    ,test = 0
    ,args = NULL
    ,app = NULL
    ,initialize = function() {
        self$route <- NULL
        self$args <- list()
        self$app <- list(x=1)
        private$.client <- list(test=list(a=1,b=2,c=3))
        private$.user <- list()
    }
    ,check_n_append = function(route) if(route %in% names(private$.client)) {} else {
        private$.client[[route]] <- list(a=1,b=2)
        private$.user[[route]] <- list(a=1,b=2)}
),
,active = list(
    client = function(value) {if(missing(value)) {
        return(private$.client[[self$route]]) }
        else {private$.client[[self$route]] <- value}}
    ,user = function(value) {if(missing(value)) {
        return(private$.user[[self$route]]) }
        else {private$.user[[self$route]] <- value}}
    ,ctest = function(value) {if(missing(value)) return(private$.client[[1]]) else private$.client[[1]] <- value}
    )
)
q <- Q$new()
qtest <- q$test
#print(q)
#print(paste0("global-list: ",ls()))
## set route
#' @export 
route <- "/demo"

#' @export
## serve page
serve <- function(route){
#    print("serve")
#    print(environment())
#    print(parent.env(environment()))
}

#' @export 
## Initial the App
app <- function(route
                ,mode='unicast')
{
    print("app")
    print(environment())
    print(parent.env(environment()))
    ## setup server
    s <- startServer(host = "0.0.0.0", port = 15555,
                     app = list(
                                call = function(req) {
                                    ## get the wave-client-id
                                    route <- paste0("/",as.list(req)$HTTP_WAVE_CLIENT_ID)
                                    q$route <- route
                                    q$check_n_append(route)
                                    print(paste0("route-now :",route))
#                                    print(paste0("private-user ",names(q$.__enclos_env__$private$.user)))
#                                    print(paste0("private-client ",q$.__enclos_env__$private$.client))
                                    q$args <- fromJSON(rawToChar(as.list(req)$rook.input$read(-1)))
                                    print(paste0("qargs ",q$args))
#                                    print(resp)
                                    print("call")
                                    print(environment())
                                    print(parent.env(environment()))
                                    print(paste0("envlist ",ls()))
                                    print(paste0("qclient ",q$client))
                                    ## create a page with route
                                    if ("serve" %in% ls(envir = .GlobalEnv)) {
                                        get("serve", envir = .GlobalEnv)
                                        serve(route)
                                    } else {
                                        serve(route)
                                    }
#                                    print(as.list(req)))
                                    body <- paste0("Time: ", Sys.time(), "<br>Path requested: ", req$PATH_INFO)
                                    list(
                                         status = 200L,
                                         headers = list('Content-Type' = 'text/html'),
                                         body = body
                                    )
#                                    q$route <- NULL
                                }
                     )
    )

    #register the app server with wave
    register_body <- list(
                          register_app=list(
                                            address = 'http://localhost:15555'
                                            ,mode = mode
                                            ,route = route
                          )
    )
    # push register
    httr::POST(
               .config$hub_address
               ,body=jsonlite::toJSON(register_body,auto_unbox=T)
               ,httr::authenticate(
                                   user=.config$hub_access_key_id
                                   ,password=.config$hub_access_key_secret
               )
               ,content_type_json()
    )

}
#.app_register()
##' @title Basic Auth HTTP POST
##' 
##' @param body - The body of the HTTP POST message. 
##' 
##' @description The function posts a message to the Wave server
##' 
#.app_register <- function(body=NULL
#                          ,headers=NULL
#                          ,username=.config$hub_access_key_id
#                          ,password=.config$hub_access_key_secret
#                          ,address=address
#                          ,mode=mode
#                          ,route=route)
#{
#    register_body <- list(register_app=list(
#                                            address=address
#                                            ,mode=mode
#                                            ,route=route
#                                            ))
#
#    .BAclient_post(
#                   body=jsonlite::toJSON(register_body,auto_unbox=T)
#                   ,username = .config$hub_access_key_id
#                   ,password = .config$hub_access_key_secret
#    )
#}
#
#' @title Basic Auth HTTP POST
#' 
#' @param body - The body of the HTTP POST message. 
#' 
#' @description The function posts a message to the Wave server
#' 
#.BAclient_post <- function(
#                           body=NULL
#                           , username = NULL
#                           , password = NULL
#                           ) {
#    resp <- httr::POST(.config$hub_address
#                       ,body = body
#                       ,httr::authenticate(
#                                           user = username
#                                           ,password = password
#                       )
#                       ,content_type_json()
#    )
#    if (resp$status_code != 200) {
#        stop(
#             sprintf(
#                     "POST failed with error code %s and message %s",
#                     resp$status_code,
#                     ifelse(rawToChar(resp$content), rawToChar(resp$content), NULL)
#             )
#        )
#    }
#    else{
#        return(jsonlite::fromJSON(rawToChar(resp$content)))
#    }
#}