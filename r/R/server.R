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
#' @param route - The \code{route} (page) that is currently being served
                                route = NULL
#' @field auth - The R6 \code{Auth} object 
                                ,auth = NULL
#' @field args - The argument holds query arguments
                                ,args = NULL
#' @field app - The app holds app specific query arguments
                                ,app = NULL
#' @field events - The events holds events specific query arguments
                                ,events = NULL

#' @description Initialize a \code{Query} Object
#' 
#' @details The intialize function setup the private and public variables in the \code{Query} object. 
#' These objects are the \code{route}, \code{args}, \code{app}, \code{auth}, \code{events}, \code{.client}, and 
#' \code{.user}.                                 
#' 
#' @return An initialized \code{Query} object.
#'
                                ,initialize = function() {
                                    self$route <- NULL
                                    self$args <- list()
                                    self$app <- list()
                                    self$events <- list()
                                    self$auth <- .Auth$new()
                                    private$.client <- list()
                                    private$.user <- list()
                                }


#' @description Check and Append \code{client} and \code{user} arguments
#' 
#' @param route - The \code{route} (page) that is currently being served
#'                                 
#' @details The \code{check_n_append} function creates a unique argument list for each user or client depending on 
#' mode of the application. It first checks if the list for the specific \code{client} and \code{user} exists. 
#' If the list exists then it does nothing, if it does not then it appends a unique list. 
#' 
                                ,check_n_append = function(route) {
                                    if(route %in% names(private$.client)) {} else {
                                    private$.client[[route]] <- list()
                                    private$.user[[route]] <- list()}
                                }


#' @description Make Events Variable
#' 
#' @details The \code{make_events} checks for the existence of a \code{''} key in \code{args}.
#' The existence of \code{''} indicates that events are available for the consumption of the
#' user. If it is present it then creates a new variable \code{events} and appends the value
#' of the \code{''} key to the \code{events} variable. 
#'
                                ,make_events = function() {
                                    if(length(which(names(self$args) =="")) == 1){
                                        self$events <- self$args[[which(names(self$args) == "")]]
                                    }
                                    else self$events <- NULL
                                }


#' @description Clear Route
#' 
#' @details The \code{clear_route} clears the route variable once the route has been served. 
#'
                                ,clear_route = function() {
                                    self$route <- NULL
                                }
                                )


                 ,active = list(
#' @field - client variable gets or sets the arguments in the \code{client} list                                
                                client = function(value) {if(missing(value)) {
                                    return(private$.client[[self$route]]) }
                                else {private$.client[[self$route]] <- value}}
#' @field - user variable gets or sets the arguments in the \code{user} list                                
                                ,user = function(value) {if(missing(value)) {
                                    return(private$.user[[self$route]]) }
                                else {private$.user[[self$route]] <- value}}
                 )
)


q <- .Query$new()

## set route
#' @export 
route <- "/demo"

#' @title Serve Page
#' 
#' @param route - The route (page) that is being served
#' 
#' @description The function is a place holder for the application written by the developer in \code{serve}.
#' 
#' @export
#'
#Vassign_events <- function(){
#    cal_length <- length(which(names()))
#}

#' @title Serve Page
#' 
#' @param route - The route (page) that is being served
#' 
#' @description The function is a place holder for the application written by the developer in \code{serve}.
#' 
#' @export
#'
serve <- function(route){
}


#' @title Run Application
#' 
#' @param route - The route (page) that is being served
#' @param mode - Is the app set to 'broadcast', 'multicast', or 'unicast'
#' @param server_address - The domain address or the IP address of the application
#' @param server_port - The port of the application
#' 
#' @description The function collects the parameters to run an application webserver.
#' The \code{route}, \code{mode}, \code{server_address}, and \code{server_port} are 
#' passed to the app function. \code{app} function then uses the provided parameters
#' to initialize and control the logic flow of the application. It also uses these parameters
#' to set and get \code{Query} objects. 
#' 
#' @export
#'
app <- function(route
                ,mode=.config$app_mode
                ,server_address = 'http://127.0.0.1'
                ,server_port = 15555)
{

#' @title Run Application
#' 
#' @param route - The route (page) that is being served
#' @param mode - Is the app set to 'broadcast', 'multicast', or 'unicast'
#' @param server_address - The domain address or the IP address of the application
#' @param server_port - The port of the application
#' 
#' @description The function collects the parameters to run an application webserver.
#' The \code{route}, \code{mode}, \code{server_address}, and \code{server_port} are 
#' passed to the app function. \code{app} function then uses the provided parameters
#' to initialize and control the logic flow of the application. It also uses these parameters
#' to set and get \code{Query} objects. 
#' 
#' @export
#'
    httpuv::startServer(host = "127.0.0.1", port = server_port,
                     app = list(
                                call = function(req) {
                                    if(tolower(mode) == 'unicast'){
                                        route <- paste0("/",as.list(req)$HTTP_WAVE_CLIENT_ID)
                                    }
                                    else if(tolower(mode) == 'multicast'){
                                        route <- paste0("/",as.list(req)$HTTP_WAVE_SUBJECT_ID)
                                    }
                                    else {
                                        route <- route
                                    }
                                    q$route <- route
                                    q$check_n_append(route)
                                    q$args <- fromJSON(rawToChar(as.list(req)$rook.input$read(-1)))
                                    q$make_events()
                                    if ("serve" %in% ls(envir = .GlobalEnv)) {
                                        get("serve", envir = .GlobalEnv)
                                        serve(route)
                                    } else {
                                        serve(route)
                                    }
                                    q$clear_route() 
                                    body <- paste0("Time: ", Sys.time(), "<br>Path requested: ", req$PATH_INFO)
                                    list(
                                         status = 200L,
                                         headers = list('Content-Type' = 'text/html'),
                                         body = body
                                    )
                                }
                     )
    )

    ## Generate the App registration
    register_body <- list(
                          register_app=list(
                                            address = paste0(server_address,":",as.character(server_port))
                                            ,mode = mode
                                            ,route = route
                          )
    )

    ## POST the App registration to the Wave server
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