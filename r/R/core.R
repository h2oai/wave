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

#library(jsonlite)
#library(httr)
#library(stringr)
#library(R6)

#'The 'Negate' variable to invert '%in%'
`%notin%` <- Negate(`%in%`)


#'(Hidden) Function to search and return a variable in the R environment.
#'@param object An environmental variable
#'@return The \code{var} variable that was found in the R environment
#'@export
#'@examples
#'.get_env_var()

.get_env_var <- function(object) {
        var <- Sys.getenv(paste0("H2O_WAVE_", object[1]))
        ifelse(var != "", return(var), return(object[2]))
}


#'The default internal address for the \code{waved} server
#'@export 
.default_internal_address = 'ws://localhost:10101'


#'Function to create data buffers. The data buffers are of three types,
#'\code{arrays}, \code{circular}, and \code{map}.
#'@param fields
#'@param size
#'@param data
#'
#'@return
#'@export
#'
#'@examples
data <- function(fields
                 ,size = 0
                 ,rows = NULL
                 ,columns = NULL
                 ,pack = FALSE) {
        f = fields
        n = size
        d = rows
        col = columns
        if (length(f) == 0)
                stop(sprintf("fields must be of non-zero length"))
        else if (length(f) > 0 &&
                 is.character(f))
                f = as.list(unlist(strsplit(f, " ")))
        else if (length(f) > 0 && is.list(f))
                f = f
        else
                stop(
                     sprintf(
                             "fields is of unknown type. Please use character: c(\"fruit\".\"vegetable\",\"flower\"), or string: \"fruit vegetable flower\", or list: list(\"fruit\",\"vegetable\",\"flower\")"
                     )
                )

        if (!is.null(rows))
                d = rows

        if (!is.null(d)) {
                if (is.list(d))
                        o <- list(m = list(f = f, d = d))
                else if (n < 0)
                        o <- list(c = list(f = f, d = d))
                else
                        o <- list(f = list(f = f, d = d))
        }
        else if (n == 0)
                o <- list(m = list(f = f))
        else if (n < 0)
                o <- list(c = list(f = f, n = -n))
        else
                o <- list(f = list(f = f, n = n))
        class(o) <- "h2o_wave_data"
        return(o)
}

#'@export 
.reset_while_test <- function() {
        source("../core.R")
        source("../ui.R")
        source("../zzz.R")
        .onLoad()
}


#'This is the new R6 implementation of page. Here we are treating page as an
#'object and there are functions, implicit functions that are tied to the page
#'object. This essentially means that one can implicitly called the functions
#'on the page object. Function to create a new page or check the existence of a
#'page This function is used to create a new page on a site. If the name of the
#'page is an empty string then the function returns an error. If the name of
#'the page does not have a `/` it returns a error. If another function calls
#'the page function (by setting fun_flag = TRUE) then a new page is not created
#'but the existence of a page is checked. Under this condition of the page does
#'not exist, then the function returns an error. \code{fun_flag} is a variable
#'that is used when another function calls this \code{page} function. It could
#'@param page_name - the name of the page to be created, or to be checked
#'@param ...
#'
#'@return page_instance - list()
#'@export
#'
#'@examples

.Site <- R6::R6Class(
                 ".Site",
                 public = list(
                               page_name = NULL,
                               cards = NULL,
                               register = function(name) {
                                       if (is.na(stringr::str_match(name, "^/")))
                                               stop(
                                                    sprintf(" Page name must be prefixed with \"/\"
                                page <- .Site$new()
                                page$register(\"/page_name\")"
                                                    ))
                                       self$cards <- NULL
                                       self$cards <- list()
                                       class(self$cards) <- append("h2o_wave_page", class(self$cards))
                                       self$page_name <- name

                               },
                               add_card = function(card_name, FUN, ...) {
                                       o <- FUN
                                       o$view = gsub("^ui_(\\w+)_card(.*)", "\\1", (deparse(substitute(FUN))))[1]
                                       if (nchar(o$view) == 0)
                                               stop(sprintf(
                                                            " %s, is not a known card. Content on the page need to be a card",
                                                            card_name
                                                            ))
                                       if ("list" %notin% class(o))
                                               stop(sprintf("%s, card needs to be a list", card_name))

                                       data = list()
                                       bufs = list()

                                       for (i in names(o)) {
                                               if (class(o[[i]]) == "h2o_wave_data") {
                                                       data[[i]] <- length(bufs)
                                                       class(o[[i]]) <- NULL
                                                       bufs[[length(bufs) + 1]] <- o[[i]]
                                               }
                                       }

                                       for (k in names(data)) {
                                               o[[k]] <- NULL
                                               o[[paste0("~", k)]] <- data[[k]]
                                       }
                                       temporary_card_object <- list()
                                       temporary_card_object$key = card_name
                                       temporary_card_object$value = o
                                       if (length(bufs) > 0)
                                               temporary_card_object$.b = bufs
                                       self$cards[[card_name]] <- temporary_card_object
                               },
                               drop = function(...) {
                                       self$cards = NULL
                                       data <- jsonlite::toJSON(list(d = list({})), auto_unbox = TRUE)
                                       .site_save(self$page_name, data, ...)
                               },
                               set = function(card=NULL,...) {
                                       base_string <- paste0("self$cards$",card,"$value")
                                       non_eval_string <- as.list(as.character(substitute(c(...)))[-1L])
                                       for(i in 1:(length(non_eval_string)-1)){
                                               base_string <- paste0(base_string,"$%s")
                                       }
                                       base_string <- paste0(base_string," <- %s")
                                       parsed_out_string <- parse(text = do.call(sprintf, c(fmt = base_string, non_eval_string)))
                                       eval(parsed_out_string)
                               },
                               save = function(...) {
                                       page_data <- self$cards
#                                       for(i in page_data) print(i)
                                       if ("h2o_wave_delta_data" %in% class(page_data)) {
#                                               print(jsonlite::toJSON(list(d= lapply(names(as.list(page_data)),function(x){
#                                                       list(k=.delta_name_change(x), v = as.list(page_data)[[x]])})),
#                                                      auto_unbox=T))
                                               proxy_data_frame <- do.call("cbind",lapply(page_data,data.frame))
                                               data <- jsonlite::toJSON(list(d = lapply(names(proxy_data_frame), function(x) {
                                                                                                list(k = .delta_name_change(x), v = proxy_data_frame[[x]])
})), auto_unbox = TRUE)
                                       }
                                       else {
                                               data <- jsonlite::toJSON(list(d = lapply(unname(page_data),
                                                                                        function(x) {
                                                                                                x[["value"]][sapply(x[["value"]],is.null)] <- NULL
                                                                                                if (length(x) == 3) {
                                                                                                        list(k = x[["key"]],
                                                                                                             d = x[["value"]],
                                                                                                             b = x[[".b"]])
                                                                                                }
                                                                                                else{
                                                                                                        list(k = x[["key"]], d = x[["value"]])
                                                                                                }
                                                                                        })), auto_unbox =
                                               TRUE)
                                               self$cards <- list()
                                               class(self$cards) <- c("h2o_wave_delta_data", class(self$cards))
                                       }
                                       .site_save(self$page_name, data, ...)
                               }
                 )
)


#'@export 

Site <- function(name) {
        if(nchar(name) == 0) stop(
                sprintf(" Page name cannot be empty
                      page <- Site(\"page_name\")"
                        ))
        intermediate_site_object <- .Site$new()
        intermediate_site_object$register(name)
        return(intermediate_site_object)
}


#'Function to load/get the data on a page in JSON format A page name needs to
#'be passed to the function to get back the data on a the page in JSON page.
#'@param page_name - name of the page
#'@param ...
#'
#'@return page in the form of a JSON
#'@export
#'
#'@examples
page_load <- function(page_name, ...) {
        return(site_load(page_name, ...))
}


#'(Hidden) Function to change the value in an element
#'@param x
#'@return
#'@export
#'@examples
.delta_name_change <- function(x) {
        return(gsub("\\.", " ", gsub("\\.value\\.", " ", x)))
}


#'Function to send a page on a site to the Qd server
#'The function requires the name of the page and the data to be sent
#'This is a (hidden) internal function
#'
#'@param page_name name of the page
#'@param data - JSON data that needs to be sent
#'@param ...
#'
#'@return return code from sending the page to the server
#'@export
#'
#'@examples
.site_save <- function(page_name, data, ...) {
        return(.BAclient_patch(page_name, data, ...))
}


#'Function to load/get a page on a site from the Qd server
#'The function requires the name of the page
#'The data is sent back in JSON.
#'
#'@param page_name name of the page
#'@param data - JSON data that needs to be sent
#'@param ...
#'
#'@return return JSON data of the specific page from the Qd server
#'@export
#'
#'@examples
site_load <- function(page_name, ...) {
        return(.BAclient_get(page_name, ...))
}


#'Function to upload files to the Qd server
#'This function will return the relative file path on the Qd server.
#'You can use this relative path for the purposes of your site/page/card
#'
#'@param files_list a list of files names that neds to be uploaded to the server
#'@param ...
#'
#'@return list of file names with their location on the Qd server
#'@export
#'
#'@examples
site_upload <- function(files_list, ...) {
        return(.BAclient_upload(file_list, ...))
}

#'This function will download file(s) from that Qd server to local disk.
#'The file will be written to the location defined in the path variable
#'
#'@param files_name name of the file to be downloaded from the Qd server
#'@param path folder location where the file needs to be downloaded
#'@param ...
#'
#'@return file is written to disk and http code
#'@export
#'
#'@examples
site_download <- function(files_name, path, ...) {
        return(.BAclient_download(file_name, path, ...))
}

#'Function to unload a page on site on the Qd server
#'The function requires the name of a page. This page will
#'then be removed from the server
#'Currently, Qd, server does not allow removing files - BROKEN
#'
#'@param page_name - name of the page to be removed from the Qd server
#'@param ...
#'
#'@return http code if the page was removed
#'@export
#'
#'@examples
site_unload <- function(page_name, ...) {
        return(.BAclient_unload(page_name, ...))
}

#'Basic Authentication HTTP patch function
#'The patch function will take the page name and the data that needs to be patched.
#'In return you will get http code
#' This is a (hidden) internal function
#'
#'@param page_name - name of the page
#'@param data - JSON data to be updated on the page.
#'@param ...
#'
#'@return http operation code
#'@export
#'
#'@examples
.BAclient_patch <- function(page_name, data, ...) {
        resp <- httr::PATCH(
                            paste0(.config$hub_address, page_name)
                            ,httr::content_type_json()
                            ,body = data
                            ,httr::authenticate(
                                                user = .config$hub_access_key_id,
                                                password = .config$hub_access_key_secret
                            )       
        )

        if (resp$status_code != 200)
                stop(sprintf(
                             "Request failed with code %s and message %s",
                             resp$status_code,
                             rawToChar(resp$output)
                             ))
}


#'Basic Authentication HTTP get function
#'The get function will get the requested page in JSON format from the
#'Qd server
#'This is a (hidden) internal function
#'
#'@param page_name - name of the page to get
#'@param ...
#'
#'@return http operation code
#'@export
#'
#'@examples
.BAclient_get <- function(page_name, ...) {
        resp <- httr::GET(
                          paste0(.config$hub_address, page_name)
                          ,httr::content_type_json()
                          ,httr::authenticate(
                                              user = .config$hub_access_key_id,
                                              password = .config$hub_access_key_secret
                          )
        )

        if (resp$status_code != 200)
                stop(sprintf(
                             "Request failed with code %s and message %s",
                             resp$status_code,
                             ifelse(rawToChar(resp$content), rawToChar(resp$content), NULL)
                             ))
        return(jsonlite::toJSON(rawToChar(resp$content)))
}

#'Basic Authentication HTTP upload with post function
#'This function will upload the files provided in the fle list to the Qd server
#'This is a (hidden) internal function
#'
#'@param files_list list of files to be uploaded
#'@param ...
#'
#'@return http operation code, and list of file locations on the Qd server
#'@export
#'
#'@examples
.BAclient_upload <- function(files_list, ...) {
        fs <- lapply(files_list, function(x) {
                             upload_file(x)
        })
        names(fs) <- rep("files", length(fs))
        resp <- httr::POST(
                           paste0(.config$hub_address, "/_f")
                           ,body = fs
                           ,httr::authenticate(
                                               user = .config$hub_access_key_id,
                                               password = .config$hub_access_key_secret
                           )
        )
        if (resp$status_code != 200) {
                stop(
                     sprintf(
                             "Upload failed with error code %s and message %s",
                             resp$status_code,
                             ifelse(rawToChar(resp$content), rawToChar(resp$content), NULL)
                     )
                )
        }
        else{
                return(jsonlite::fromJSON(rawToChar(resp$content)))
        }
}

#'Basic Authentication HTTP download with get function
#'This function will download files from the Qd server and store it in the path provided
#'This is a (hidden) internal function
#'
#'@param file_name the file that you would like to download from the Qd server
#'@param path  the location wehre the file needs to be downloaded
#'@param ...
#'
#'@return http operation code
#'@export
#'
#'@examples
.BAclient_download <- function(file_name, path, ...) {
        resp <- httr::GET(paste0(.config$hub_address, page_name), write_disk(path))
        if (resp$status_code != 200) {
                stop(
                     sprintf(
                             "Unload failed with error code %s and message %s",
                             resp$status_code,
                             rawToChar(resp$content)
                     )
                )
        }
        else{
                return(jsonlite::fromJSON(rawToChar(resp$content)))
        }
}

#'Basic Authentication HTTP delete function
#'This function will delete the page on the Qd server. It requires the page name
#'This is a (hidden) internal function
#'
#'@param page_name name of the page to be removed from the Qd server
#'@param ...
#'
#'@return http operation code
#'@export
#'
#'@examples
.BAclient_unload <- function(page_name, ...) {
        resp <- httr::DELETE(paste0(.config$hub_address, page_name))
        if (resp$status_code != 200) {
                stop(
                     sprintf(
                             "Unload failed with error code %s and message %s",
                             resp$status_code,
                             rawToChar(resp$content)
                     )
                )
        }
        else{
                return(jsonlite::fromJSON(rawToChar(resp$content)))
        }
}
