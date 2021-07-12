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
                     public = list(
                                   #' @field username The username of the user
                                   username = NULL,
                                   #' @field subject Unique identifier for the user
                                   subject = NULL,
                                   #' @field access_token The access token of the user                                   
                                   access_token = NULL,
                                   #' @field refresh_token The refresh token of the user                                   
                                   refresh_token = NULL
                                   ))


#' @title Create an \code{App} object 
#' 
#' @import R6 stringr jsonlite httr httpuv     
#' 
#' @description The \code{App} object stores App level variables
#' 
#' @details The \code{App} object stores App level variables. 
#' These variables are available to all users connected to the App.
#' 
#' @return A \code{App} object. 
#' 
.App <- R6::R6Class(".App",
                     public = list(
                                   #' @field .lapp The list that stores App level variables
                                   .lapp = NULL,


#' @description Initialize an \code{App} Object
#' 
#' @details The initialize function sets up the public variable  \code{.lapp}.
#' 
#' @return An initialized \code{App} object.
#'
                                   initialize = function() .lapp <- list()
                                   ))


#' @title Create an \code{User} object 
#' 
#' @import R6 stringr jsonlite httr httpuv     
#' 
#' @description The \code{User} object stores User level variables
#' 
#' @details The \code{User} object stores User level variables. 
#' User specific set of variables are available to a user. 
#' 
#' @return A \code{User} object. 
#' 
.User <- R6::R6Class(".User",
                     public = list(
                                   #' @field .luser The list that stores User level variables
                                   .luser = NULL,


#' @description Initialize an \code{User} Object
#' 
#' @details The initialize function sets up the public variable  \code{.luser}.
#' 
#' @return An initialized \code{User} object.
#'
                                   initialize = function() .luser <- list()
                                   ))
                                   

#' @title Create an \code{Client} object 
#' 
#' @import R6 stringr jsonlite httr httpuv     
#' 
#' @description The \code{Client} object stores Client level variables
#' 
#' @details The \code{Client} object stores Client level variables. 
#' Client specific set of variables are available to a specific session.
#' 
#' @return A \code{Client} object. 
#' 
.Client <- R6::R6Class(".Client",
                     public = list(
                                   #' @field .lclient The list that stores Client level variables
                                   .lclient = NULL,
                                   

#' @description Initialize a \code{Client} Object
#' 
#' @details The initialize function sets up the public variable  \code{.lclient}.
#' 
#' @return An initialized \code{Client} object.
#'
                                   initialize = function() .lclient <- list()
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
.Query <- R6::R6Class(".Query",
                      public = list(
                                     #' @field auth The R6 \code{Auth} object 
                                     auth = NULL,
                                     #' @field args The argument holds query arguments
                                     args = NULL,
                                     #' @field events The events holds events specific query arguments
                                     events = NULL,
                                     #' @field page The page that is being served
                                     page = NULL,

#' @description Initialize a \code{Query} Object
#' 
#' @param route The \code{route} (page) that is currently being served
#' 
#' @details The initialize function sets up public variables in the \code{Query} object. 
#' These objects are the \code{route}, \code{args}, \code{app}, \code{auth}, and \code{events}.
#' 
#' @return An initialized \code{Query} object.
#'
                                     initialize = function(route) {
                                         self$args <- list()
                                         self$events <- list()
                                         self$page <- Site(route)
                                         self$auth <- .Auth$new()
                                     },


#' @description Check and Append \code{client} and \code{user} arguments
#' 
#' @param route The \code{route} (page) that is currently being served
#'                                 
#' @details The \code{check_n_append} function creates a unique argument list for each user or client depending on 
#' mode of the application. It first checks if the list for the specific \code{client} and \code{user} exists. 
#' If the list exists then it does nothing, if it does not then it appends a unique list. 
#' 
                                     check_n_append = function(route) {
                                         if(route %in% names(.client$.lclient)) {} else {
                                             .user$.luser[[route]] <- list()
                                             .client$.lclient[[route]] <- list()}
                                     },


#' @description Make Events Variable
#' 
#' @details The \code{make_events} checks for the existence of a \code{''} key in \code{args}.
#' The existence of \code{''} indicates that events are available for the consumption of the
#' user. If it is present it then creates a new variable \code{events} and appends the value
#' of the \code{''} key to the \code{events} variable. 
#'
                                     make_events = function() {
                                         if(length(which(names(self$args) =="")) == 1){
                                             self$events <- self$args[[which(names(self$args) == "")]]
                                         }
                                         else self$events <- NULL
                                     }
                      ),


                      active = list(
#' @field user variable gets or sets the arguments in the \code{user} list                                
                                 user = function(value) {if(missing(value)) {
                                     return(.user$.luser[[self$page$page_name]]) }
                             else {.user$.luser[[self$page$page_name]] <- value}},
#' @field client variable gets or sets the arguments in the \code{client} list                                
                                    client = function(value) {if(missing(value)) {
                                        return(.client$.lclient[[self$page$page_name]]) }
                                 else {.client$.lclient[[self$page$page_name]] <- value}},
#' @field app variable gets or sets the arguments in the \code{app} list                                
                                 app = function(value) {if(missing(value)) {
                                     return(.app$.lapp[[self$page$page_name]]) }
                             else {.app$.lapp[[self$page$page_name]] <- value}}
                      )
)

.user <- .User$new()
.client <- .Client$new()
.app <- .App$new()

#' @title Run Application
#' 
#' @param route The route (page) that is being served
#' @param mode Is the app set to 'broadcast', 'multicast', or 'unicast'
#' @param server_address The domain address or the IP address of the application
#' @param server_port The port of the application
#' 
#' @description The function collects the parameters to run an application webserver.
#' The \code{route}, \code{mode}, \code{server_address}, and \code{server_port} are 
#' passed to the app function. \code{app} function then uses the provided parameters
#' to initialize and control the logic flow of the application. It also uses these parameters
#' to set and get \code{Query} objects. 
#' 
#' @export
#'
app <- function(route="/demo"
                ,mode=getOption("h2owave")$app_mode
                ,server_address = 'http://127.0.0.1'
                ,server_port = 15555)
{
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
                                       qObject <- .Query$new(route)
                                       qObject$check_n_append(route)
                                       qObject$args <- fromJSON(rawToChar(as.list(req)$rook.input$read(-1)))
                                       serve(qObject)
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
               getOption("h2owave")$hub_address
               ,body=jsonlite::toJSON(register_body,auto_unbox=T)
               ,httr::authenticate(
                                   user=getOption("h2owave")$hub_access_key_id
                                   ,password=getOption("h2owave")$hub_access_key_secret
               )
               ,content_type_json()
    )

}