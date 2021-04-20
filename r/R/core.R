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


`%notin%` <- Negate(`%in%`)


#' @title Fetch Environment Variable
#' 
#' @param object An environment variable object string
#' 
#' @description Fetches the value associated with an environment variable. 
#' The associated value is obtained when the user passes the specific environment
#' object string. 
#' 
#' @return The \code{var} value that was found/associated with the provided
#' environment variable object string. 
#' 
#' @examples
#' .get_env_var("INTERNAL_ADDRESS")
#' 
.get_env_var <- function(object) {
        var <- Sys.getenv(paste0("H2O_WAVE_", object[1]))
        ifelse(var != "", return(var), return(object[2]))
}


#' @title Default Internal Address
#' 
#' @description The default internal address used by \code{waved}
#' 
.default_internal_address = 'ws://localhost:10101'


#' @title Create Data Buffer
#' 
#' @param fields  - One long string, or a list of fields that need to store data
#' in buffers. 
#' @param size - The size of the buffer.
#' @param rows - Data in the form of rows that needs to be stored in buffers.  
#' @param columns - Data specified as columns first. 
#' @param pack - Packed the buffer to a fixed size. 
#' 
#' @description Creates the Data Buffers are in-memory data structures.
#' They hold card's tabular data. There are three types of data buffers:
#' \code{arrays},\code{circular}, and \code{map}.
#' https://h2oai.github.io/wave/docs/buffers
#' 
#' @return The data buffer object.
#'
#' @examples 
#' data(fields='foo price',size=-15)
#' 
#' @export
#' 
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

##' @description Function to quickly reset library source to the latest version. 
##' Used specifically while testing. 
##' 
#.reset_while_test <- function() {
#        source("../core.R")
#        source("../ui.R")
#        source("../zzz.R")
#        library(jsonlite)
#        library(httr)
#        library(stringr)
#        library(R6)
#        .onLoad()
#}


#' @title Create a \code{page} 
#' 
#' @import R6 stringr jsonlite httr     
#' 
#' @description Given a \code{name} the object generates a \code{page}.
#' 
#' @details A \code{Site} can have multiple pages. Each page is uniquely 
#' identified by a page \code{name}. Each Page can hold multiple cards. 
#' Each of these cards display information. The cards can be dynamic or static
#' depending on the type of information that is required by hte user.
#' 
#' @note Please use the \code{Site()} function to create a \code{page}.
#'
#' @return A \code{page}. 
#' 
.Site <- R6::R6Class(
                 ".Site",
                 public = list(
#' @field page_name - The name of the page as a string
                               page_name = NULL,
#' @field cards - The list of cards. Use \code{page$add_card} to add cards
                               cards = NULL,
                               

#' @description Register a page with a \code{name}.
#' 
#' @param name - The name of the page as a string. 
#' 
#' @details A page is created with \code{page <- .Site$new()} method. After a 
#' new page is created \code{page$register(name)} method registers a page with a given name.
#' 
#' @note Please use the \code{Site()} function to create a \code{page}.
#' 
#' @return A \code{page}.
#'
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
#' @description The method adds a card to the page. The \code{FUN} will add the elements
#' specific to the card being added. 
#' 
#' @param card_name - The name of the card as a string. 
#' @param FUN - The function specific to the card being added. 
#' 
#' @return A \code{page} with the \code{card_name} added.
#'
#' @examples 
#' .onLoad()
#' name <- "/newpage"
#' page <- Site(name)
#' page$add_card("hello",ui_markdown_card(box="1 1 2 2",
#'                    title="Hello World!"
#'                    ,content='And now for something complete different!'
#'                    ))
#' 
                               add_card = function(card_name, FUN) {
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
#' @description The method drops the cards on the page. 
#' 
#' @return A \code{page} with the cards dropped. 
#'
#' @examples 
#' .onLoad()
#' name <- "/newpage"
#' page <- Site(name)
#' page$add_card("hello",ui_markdown_card(box="1 1 2 2",
#'                    title="Hello World!"
#'                    ,content='And now for something complete different!'
#'                    ))
#' page$save()
#' page$drop()
#' 
                               drop = function() {
                                       self$cards = NULL
                                       data <- jsonlite::toJSON(list(d = list({})), auto_unbox = TRUE)
                                       .site_save(self$page_name, data)
                               },
#' @description The method updates the values of variables on a card. 
#' 
#' @param card - The name of the card as a string. 
#' @param ... - variable names, and associated values.
#' 
#' @return A \code{page} with updates values for specific card-variables. 
#'
#' @examples 
#' .onLoad()
#' name <- "/newpage"
#' page <- Site(name)
#' page$add_card("crypto",ui_small_series_stat_card(box="1 1 1 1"
#'                       ,title="ETH"
#'                       ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
#'                       ,data=list(price=10,change=0.15)
#'                       ,plot_data=data(fields='price change',size=-15)
#'                       ,plot_category='price'
#'                       ,plot_type='area'
#'                       ,plot_value='change'
#'                       ,plot_color='$red'
#'                       ,plot_zero_value = 0
#'                       ,plot_curve='linear'
#' ))
#' page$set("crypto","title","ETH")
#' page$save()
#' 
                               set = function(card=NULL,...) {
                                       base_string <- paste0("self$cards$",card)
                                       non_eval_string <- as.list(as.character(substitute(c(...)))[-1L])
                                       for(i in 1:(length(non_eval_string)-1)){
                                               if(non_eval_string[[i]] == "-") non_eval_string[[i]] = "_"
                                               base_string <- paste0(base_string,'.%s')
                                       }
                                       base_string <- paste0(base_string,' = %s')
                                       parsed_out_string <- parse(text = do.call(sprintf, c(fmt = base_string, non_eval_string)))
                                       eval(parsed_out_string)
                               },
#' @description The method pushes the page and its content (cards) to the 
#' wave server. 
#' 
#' @examples 
#' .onLoad()
#' name <- "/newpage"
#' page <- Site(name)
#' page$add_card("hello",ui_markdown_card(box="1 1 2 2",
#'                    title="Hello World!"
#'                    ,content='And now for something complete different!'
#'                    ))
#' page$save()
#' 
                               save = function() {
                                       page_data <- self$cards
                                       if ("h2o_wave_delta_data" %in% class(page_data)) {
                                               data <- jsonlite::toJSON(list(d= lapply(names(as.list(page_data)),function(x){
                                                       list(k=.delta_name_change(x), v = as.list(page_data)[[x]])})),
                                                      auto_unbox=T)
                                       }
                                       else {
                                               data <- jsonlite::toJSON(list(d = lapply(unname(page_data),
                                                                                        function(x) {
                                                                                                x[["value"]] <- .recursive_null_extractor(x[["value"]])
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
                                       .site_save(self$page_name, data)
                               }
                 )
)


#' @title Create Page
#' 
#' @param name - The name of the page as a string. 
#' @param address - The address of Wave server. 
#' 
#' @description The function is used to create and register a page with the
#' given \code{name}. If the address of the Wave server can also be passed to this
#' function. 
#' 
#' @return A \code{page}.
#'
#' @examples page <- Site("/newpage")
#' 
#' @export
#' 
Site <- function(name
                ,address = NULL) {
        if (!is.null(address)) .config$hub_address <<- address
        if(nchar(name) == 0) stop(
                sprintf(" Page name cannot be empty
                      page <- Site(\"page_name\")"
                        ))
        intermediate_site_object <- .Site$new()
        intermediate_site_object$register(name)
        intermediate_site_object$drop()
        return(intermediate_site_object)
}



#' @title Recursive NULL Extractor
#' 
#' @param x - A list or an element of a list.
#' 
#' @description The function recurses through a list and checks for NULL elements. 
#' And if there are NULL elements it will remove them from the list. 
#' 
#' @return A \code{list} without NULLs.
#'
.recursive_null_extractor <- function(x){
        attribute_holder <- attributes(x)$class
        x <- lapply(x,function(y){
                if(is.list(y)){
                        return(.recursive_null_extractor(y))
                }
                else{
                        return(y)
                }
        })
        x[sapply(x,is.null)] <- NULL
        attributes(x)$class <- attribute_holder
        return(x)
}


#' @title Card Variable Name Modification. 
#' 
#' @param x - The variable which needs to be modified.
#' 
#' @description The function modifies the name of the variable on a card. It removes the 
#' period, and replaces it with space. It also replaces all underscores with a dash. 
#' 
#' @return A variable with name modified.
#'
.delta_name_change <- function(x) {
        return(gsub("\\.", " ",gsub("_\\.","-",x)))
}


#' @title Load A Page
#' 
#' @param page_name - The name of the page to be loaded. 
#' 
#' @description The function loads the page with the name \code{page_name}. 
#' It also loads the data on that page. 
#' 
#' @return A \code{page}.
#'
page_load <- function(page_name) {
        return(site_load(page_name))
}


#' @title Save Page to a Site
#' 
#' @param page_name - The name of the page to be uploaded.
#' @param data - The JSON data uploaded on to the page. 
#' 
#' @description The function uploads the page and the JSON data on that page. 
#'
.site_save <- function(page_name, data) {
        return(.BAclient_patch(page_name, data))
}


#' @title Load Page From a Site
#' 
#' @param page_name - The name of the page to be loaded.
#' 
#' @description The function loads the page and the JSON data on that page. 
#' 
#' @return JSON data on the specified page. 
#'
site_load <- function(page_name) {
        return(.BAclient_get(page_name))
}


#' @title Upload Files to Server
#' 
#' @param files_list - List of files that needed to be uploaded to the server.
#' 
#' @description The function uploads file to the Wave server. 
#' 
site_upload <- function(files_list) {
        return(.BAclient_upload(files_list))
}


#' @title Download File from Server
#' 
#' @param file_name - Name of the file to be downloaded from the server. 
#' @param path - Path where the \code{file} is saved. 
#' 
#' @description The function downloads file from the Wave server and saves
#' it at a specified location. 
#' 
site_download <- function(file_name, path) {
        return(.BAclient_download(file_name, path))
}


#' @title Page Unload
#' 
#' @param page_name - Name of the page that needs to be unloaded.
#' 
#' @description The function removes the specified page from the site. 
#' 
site_unload <- function(page_name) {
        return(.BAclient_unload(page_name))
}


#' @title Basic Auth HTTP PATCH
#' 
#' @param page_name - The name of the page to be uploaded.
#' @param data - The JSON data uploaded on to the page. 
#' 
#' @description The function uploads the page and the JSON data on that page. 
#'
.BAclient_patch <- function(page_name, data) {
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


#' @title Basic Auth HTTP GET
#' 
#' @param page_name - The name of the page to get.
#' 
#' @description The function gets the specified page and the associated
#' JSON data. 
#'
#' @return JSON data on the specified page. 
#' 
.BAclient_get <- function(page_name) {
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


#' @title Basic Auth HTTP POST
#' 
#' @param files_list - List of files that needed to be uploaded to the server.
#' 
#' @description The function uploads file to the Wave server. 
#' 
.BAclient_upload <- function(files_list) {
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


#' @title Basic Auth HTTP GET (file)
#' 
#' @param file_name - Name of the file to be downloaded from the server. 
#' @param path - Path where the \code{file} is saved. 
#' 
#' @description The function downloads file from the Wave server and saves
#' it at a specified location. 
#' 
.BAclient_download <- function(file_name, path) {
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


#' @title Basic Auth HTTP DELETE
#' 
#' @param page_name - Name of the page that needs to be unloaded.
#' 
#' @description The function removes the specified page from the site. 
#' 
.BAclient_unload <- function(page_name) {
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
