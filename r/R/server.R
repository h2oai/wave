# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#' @title Create an \code{Auth} object 
#' 
#' @import R6 stringr jsonlite httr httpuv     
#' 
#' @description The \code{Auth} object stores credentials. 
#' 
#' @details The \code{Auth} object stores session, and user credentials. 
#' This information can be used to create custom behaviour for users. 
#' 
#' @return A \code{Auth} object. 
#' 
.Auth <- R6::R6Class(".Auth",
                    ,public = list(
#' @field username - The username of the user
                                   username = NULL
#' @field subject - Unique identifier for the user
                                   ,subject = NULL
#' @field access_token - The access token of the user                                   
                                   ,access_token = NULL
#' @field refresh_token - The refresh token of the user                                   
                                   ,refresh_token = NULL
                                   ))


#' @title Create a \code{Query} object 
#' 
#' @import R6 stringr jsonlite httr httpuv     
#' 
#' @description The \code{Query} object stores query information. 
#' 
#' @details The \code{Query} object stores information about the query. 
#' It also stores the \code{args} information, along with \code{client}
#' and \code{user}. It also provides \code{auth} information via an \code{auth} object. 
#' 
#' @return A \code{Query} object. 
#' 
.Query <- R6::R6Class(".Query"
                 ,private = list(
#' @field .client - A list that holds client specific information
                                 .client = NULL
#' @field .user - A list that holds user specific information
                                 ,.user = NULL
                 )

                 ,public = list(
#' @field route - The request \code{route} currented being served
                                route = NULL
#' @field auth - The R6 \code{Auth} object 
                                ,auth = NULL
#' @field args - The argument holds query arguments
                                ,args = NULL
#' @field app - The app parameter holds app specific query arguments
                                ,app = NULL


#' @description Initialize a \code{Query} Object
#' 
#' @details The intialize function setup the private and public variables in the \code{Query} object. 
#' These objects are the \code{route}, \code{args}, \code{app}, \code{auth}, \code{.client}, and 
#' \code{.user}.                                 
#' 
#' @return An initialized \code{Query} object.
#'
                                ,initialize = function() {
                                    self$route <- NULL
                                    self$args <- list()
                                    self$app <- list()
                                    self$auth <- .Auth$new()
                                    private$.client <- list()
                                    private$.user <- list()
                                }


#' @description Check and Append \code{client} and \code{user} arguments
#' 
#' @param route - The route that is being served. 
#'                                 
#' @details The \code{check_n_append} function creates a unique argument list for each user or client depending on 
#' mode of the application. It first checks if the list for the specific \code{client} and \code{user} exists. 
#' If it does it passes the same list. If it does not then it appends a unique list. 
#' 
#' @return A \code{user} or \code{client} argument list.
#'
                                ,check_n_append = function(route) if(route %in% names(private$.client)) {} else {
                                    private$.client[[route]] <- list()
                                    private$.user[[route]] <- list()}
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

q <- .Query$new()

## set route
#' @export 
route <- "/demo"

#' @export
## serve page
serve <- function(route){
}

#' @export 
## Initial the App
app <- function(route
                ,mode=.config$app_mode
                ,server_address = 'http://localhost'
                ,server_port = 15555)
{
    print("app")
    print(environment())
    print(parent.env(environment()))
    ## setup server
    s <- startServer(host = "0.0.0.0", port = server_port,
                     app = list(
                                call = function(req) {
                                    ## get the wave-client-id
                                    #                                    print(as.list(req))
                                    if(tolower(mode) == 'unicast'){
                                        route <- paste0("/",as.list(req)$HTTP_WAVE_CLIENT_ID)
                                    }
                                    else if(tolower(mode) == 'multicast'){
                                        route <- paste0("/",as.list(req)$HTTP_WAVE_SUBJECT_ID)
                                    }
                                    else {
                                        route <- route
                                    }
                                    #                                    route <- paste0("/",as.list(req)$HTTP_WAVE_CLIENT_ID)
                                    q$route <- route
                                    q$check_n_append(route)
                                    print(paste0("route-now :",route))
                                    #                                    print(paste0("private-user ",names(q$.__enclos_env__$private$.user)))
                                    #                                    print(paste0("private-client ",q$.__enclos_env__$private$.client))
                                    q$args <- fromJSON(rawToChar(as.list(req)$rook.input$read(-1)))
                                    print(paste0("qargs ",q$args))
                                    #                                    print(req)
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
                                            address = paste0(server_address,":",as.character(server_port))
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
