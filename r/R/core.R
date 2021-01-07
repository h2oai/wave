#install.packages(c("jsonlite","httr","stringr","future"),repo = "https://lib.ugent.be/CRAN/")
library(jsonlite)
library(httr)
library(stringr) 
library(future)

`%notin%` <- Negate(`%in%`)

plan(list(multisession,multisession))

#' Search and return an existing, or default environmental variable
#' This is a (hidden) internal function
#'
#' @param object An environmental variable
#'
#' @return The found or default environmental variable \code{object}
#' @export
#'
#' @examples
#' test_variable <- 'INTERNAL_ADDRESS'
#' .get_env_var(test_variable)
.get.env.var <- function(object){
       var <- Sys.getenv(paste0("H2O_Q_",object[1]))
        ifelse(var != "", return(var), return(object[2]))
}

.default_internal_address = 'ws://localhost:10101'

#' Configure the environmental variables
#' This is a (hidden) internal function
#' 
#' The environmental variables configured here are:
#' internal_address
#' external_address
#' hub_address
#' hub_access_key_id
#' hub_access_key_secret
#' shutdown_timeout
#' They are stored in a list \code{.config}
#' @return
#' @export
#'
#' @examples
.Config <- function(){
        .config <<- list()
        .config$internal_address <<- .get.env.var(c("INTERNAL_ADDRESS",.default_internal_address))
        .config$external_address <<- .get.env.var(c("EXTERNAL_ADDRESS",.config$internal_address))
        .config$hub_address <<- .get.env.var(c("ADDRESS",'http://localhost:10101'))
        .config$hub_access_key_id <<- .get.env.var(c('ACCESS_KEY_ID', 'access_key_id'))
        .config$hub_access_key_secret <<- .get.env.var(c('ACCESS_KEY_SECRET','access_key_secret'))
        .config$shutdown_timeout <<- as.integer(.get.env.var(c('SHUTDOWN_TIMEOUT','3')))
}

.Config()
#.onLoad <- function(){
#   .Config()
#}
        

#' Function to check if the object is a primitive.
#' This function checks if the object is of type numeric, integer, logical, character. 
#'This is a (hidden) internal function
#'
#' @param object 
#'
#' @return TRUE - logical
#' @export
#'
#' @examples 
#' test_variable <- 1
#' .is_primitive(test_variable)
.is_primitive <- function(object=NULL){
        if(class(object) %in% list("numeric","integer","logical"))
            {
                    return(TRUE)
            }
        else if(class(object) == "character" && object == " "){
                stop(sprintf("Error. %s cannot be empty.",object))
        }
        else if(class(object) == "list")
        {return(unique(unlist(lapply(object,function(x){.isprimitive(x)}))))}
        else{
                stop(sprintf("Error. %s is not a primitive.\n Please ensure that object is one of the types:\n 
                             1. \"numeric\"
                             2. \"character\"
                             3. \"list\"
                             4. \"integer\"
                             5. \"logical\"\n"
                             ,object) )
}
}

#' Data Dump
#' A function to check the kind of data that needs to be packed and sent. 
#' Different configurations of the data will be enclosed with different named lists. 
#' @param fields 
#' @param size 
#' @param data 
#'
#' @return
#' @export
#'
#' @examples
data.dump <- function(fields,size,data=NULL){
        f = fields
        n = size
        d = data
        if(!is.null(d)){
                if(is.list(d)) o <- list(m=list(f=f,d=d))
                else if(n < 0) o <- list(c=list(f=f,d=d))
                else o <- list(f=list(f=f, d=d))
        }
        else if(n==0) o <- list(m=list(f=f))
        else if(n < 0) o <- list(c=list(f=f,n=n))
        else o <- list(f=list(f=f,n=n))
        class(o) <- "h2o_q_data"
        return(o)
}

#' Function to create a new page or check the existence of a page
#' This function is used to create a new page on a site. 
#' If the name of the page is an empty string then the function returns an error. 
#' If the name of the page does not have a `/` it returns a error. 
#' If another function calls the page function (by setting fun_flag = TRUE) then a new page is not created
#' but the existence of a page is checked. Under this condition of the page does not exist, then the function 
#' returns an error.
#' \code{fun_flag} is a variable that is used when another function calls this \code{page}
#' function. It could 
#' @param page_name - the name of the page to be created, or to be checked
#' @param fun_flag  - a flag set when other functions call this function. 
#' @param ... 
#'
#' @return page_instance - list()
#' @export
#'
#' @examples 
#' test_page <- page("/example)
page <- function(page_name,fun_flag=FALSE,...){

        if(fun_flag == TRUE && current_page != page_name){
                stop(sprintf("%s page does not exist. Please enter an existing page",page_name))
        }
        if(nchar(page_name) == 0){
             stop(sprintf("page name must not be empty.\n example_page <- page(\"/page_name\")"))
        }
        if(is.na(stringr::str_match(page_name,"^/"))){
             stop(sprintf("page name must be prefixed with \"/\".\n example_page <- page(\"/page_name\")"))
        }
        current_page <<- page_name
        page_instance <- list()
        class(page_instance) <- append("h2o_q_page",class(page_instance))
        return(page_instance)
}


#' Function adds one or many cards to the page_instance. 
#' Each of these cards contains information that will be displayed. 
#' These cards could be static of dynamic. 
#' Each card requires a unique name. If a card with a name similar to an existing card
#' is added then the existing card will be over written. 
#' The card name cannot be empty. 
#'
#' @param page_instance - The page instance object 
#' @param page_name - name of the page instance
#' @param card_name name of the card
#' @param FUN card function to be passed. This could be any card type available in ui.R
#' @param ... 
#'
#' @return page_instance - list() 
#' @export
#'
#' @examples
#' test_page <- page.add(test_page,"/example","test_card"
#' ,FUN=ui_small_stat_card(box="1 1 1 1",title="test",value="$55.05"))
page.add <- function(page_instance,page_name,card_name,FUN,...){
        page(page_name,fun_flag=TRUE)
        o <- FUN
        o$view = gsub("^ui_(\\w+)_card(.*)","\\1",(deparse(substitute(FUN))))[1]

        if(nchar(o$view) == 0){
                stop(sprintf("%s, is not a known card. Content on the page need to be a card",card_name))
        }
        if("list" %notin% class(o)){
                stop(sprintf("%s, card needs to be a list",card_name))
        }

        data = list()
        bufs = list()
        for(i in names(o)){
                    if(class(o[[i]]) == "h2o_q_data"){
                               data[[i]] <- length(bufs)
                               class(o[[i]]) <- NULL
                               bufs[[length(bufs)+1]] <- o[[i]]
                             }
}

        for(k in names(data)){
                o[[k]] <- NULL
                o[[paste0("~",k)]] <- data[[k]]
        }

        .opage <- list()
        .opage$key = card_name
        .opage$value = o
        if(length(bufs) > 0) .opage$.b = bufs

        page_instance[[card_name]] <- .opage
        return(page_instance)
}


#' Function to load/get the data on a page in JSON format
#' A page name needs to be passed to the function to get back the 
#' data on a the page in JSON page. 
#' @param page_name - name of the page
#' @param ... 
#'
#' @return page in the form of a JSON
#' @export
#'
#' @examples
#' page.load("/example")
page.load <- function(page_name,...){
        return(site.load(page_name,...))
}


#' Make a required name change if needed
#'
#' @param x 
#'
#' @return
#' @export
#'
#' @examples
.delta_name_change <- function(x){
        return(gsub("\\."," ",gsub("\\.value\\."," ",x)))
}
#' Function to provide the difference between two instances of a page. 
#' The existing and the new instances of the page. 
#' The returning data is passed to the page.save() function
#'This is a (hidden) internal function
#'
#' @param ref_page existing page
#' @param new_page updated page
#' Adding a list of lists required (temporarily broken) 
#' @return .page_changes returns the differences in page
#' @export
#'
#' @examples
#' .page.diff(.test_page, test_page)
.page.diff <- function(ref_page, new_page){
        .page_changes <- list()
        if(length(new_page$value) != length(ref_page$value)){
                .page_changes <- append(.page_changes,test_2$value[which(!(names(test_2$value) %in% names(test_page$value)))])
        }
        .value_changes <- sapply(names(ref_page$value),function(x){if(!(identical(ref_page$value[[x]],new_page[[x]]))){new_page[[x]]}})
        .value_changes <- .value_changes[!sapply(.value_changes,is.null)]
        .page_changes <- append(.page_changes,.value_changes)
        class(.pages_changes) <- append(class(.pages_changes),"h2o_q_page_changes")
        return(.page_changes)
}

#' Glist - Creating a guarded list. 
#' This list will be guarded and wont be changed. 
#'
#' @param ... 
#'
#' @return
#' @export
#'
#' @examples
glist <- function(...){
        o <- list(...)
        class(o) <- append(class(o),c("h2o_q_guarded_list"))
        return(o)
}

#' CHecking for glist
#'
#' @param lname 
#' @param ... 
#'
#' @return
#' @export
#'
#' @examples
is.glist <- function(lname,...){
        if("h2o_q_guarded_list" %in% class(lname)) return(TRUE)
        else return(FALSE)
}

#' Page Frame
#' Add additional attributes if the page is having a delta frame.
#'
#' @param page 
#' @param ... 
#'
#' @return
#' @export
#'
#' @examples
page_frame <- function(page,...){
        o <- lapply(page,
                    function(x){
                            if(is.list(x)) page_frame(x)
                            else x <- NULL
                    })
        class(o) <- c("h2o_q_delta_data",class(o))
        return(o)
}

#' Function to check if the list is empty
#'
#' @param x 
#'
#' @return
#' @export
#'
#' @examples
is.list.empty <- function(x){
        o <- unique(unlist(lapply(x,function(x){if(is.list(x)) return(is.list.empty(x)) else return(is.null(x))})))
        if(length(o) > 1) return(FALSE)
        else return(o)
}


#' Function to save the page, push the page to the Qd server
#' The function requires the page instance created, and the name of the page. 
#'
#' @param page_instance - page instance object
#' @param page_name - name of the page
#' @param ... 
#'
#' @return return code from sending the page to the server
#' @export
#'
#' @examples
#' page.save(test_page,"/example")
page.save <- function(page_instance,page_name,...){
        page(page_name,fun_flag=TRUE)
        if("h2o_q_delta_data" %in% class(page_instance)) {
                unlist_o_all <- unlist(lapply(page_instance,function(x){unlist(x,recursive=F,use.names=T)}),recursive=F,use.names=T)
                unlist_o_unguarded <- as.list(unlist(lapply(unlist_o_all,function(x){if(!is.glist(x)) return(x)}),use.names=T))
                unlist_o_guarded <- lapply(unlist_o_all,function(x){if(is.glist(x)) return(x)})
                unlist_o_guarded <- unlist_o_guarded[!sapply(unlist_o_guarded,is.null)]
                unlist_o <- c(unlist_o_guarded,unlist_o_unguarded)
                print(str(unlist_o))
                data <- jsonlite::toJSON(list(d=lapply(names(unlist_o),function(x){list(k=.delta_name_change(x),v=unlist_o[[x]])})),auto_unbox=TRUE)
        }
        else {data <- jsonlite::toJSON(list(d=lapply(unname(page_instance),function(x){if(length(x) == 3){list(k=x[[1]],d=x[[2]],b=x[[3]])}else{list(k=x[[1]],d=x[[2]])}})),auto_unbox=TRUE)
        assign(deparse(substitute(page_instance)),page_frame(page_instance),env=parent.frame())
        }
        return(.site.save(page_name,data,...))
}

#' Function to send a page on a site to the Qd server
#' The function requires the name of the page and the data to be sent
#' This is a (hidden) internal function
#' 
#' @param page_name name of the page
#' @param data - JSON data that needs to be sent
#' @param ... 
#'
#' @return return code from sending the page to the server
#' @export
#'
#' @examples
#' .site.save("/example",json_data)
.site.save <- function(page_name,data,...){
        return(.BAclient.patch(page_name,data,...))
}


#' Function to load/get a page on a site from the Qd server
#' The function requires the name of the page
#' The data is sent back in JSON. 
#' 
#' @param page_name name of the page
#' @param data - JSON data that needs to be sent
#' @param ... 
#'
#' @return return JSON data of the specific page from the Qd server
#' @export
#'
#' @examples
#' site.load("/example")
site.load <- function(page_name,...){
        return(.BAclient.get(page_name,...))
}


#' Function to upload files to the Qd server
#' This function will return the relative file path on the Qd server. 
#' You can use this relative path for the purposes of your site/page/card
#'
#' @param files_list a list of files names that neds to be uploaded to the server
#' @param ... 
#'
#' @return list of file names with their location on the Qd server
#' @export
#'
#' @examples
#' file_list <- list("aml.jpg","dai.jpg")
#' site.upload(file_list)
site.upload <- function(files_list,...){
        return(.BAclient.upload(file_list,...))
}

#' This function will download file(s) from that Qd server to local disk. 
#' The file will be written to the location defined in the path variable
#'
#' @param files_name name of the file to be downloaded from the Qd server
#' @param path folder location where the file needs to be downloaded
#' @param ... 
#'
#' @return file is written to disk and http code
#' @export
#'
#' @examples
#' site.download("aml.jpg","/tmp")
site.download <- function(files_name,path,...){
        return(.BAclient.download(file_name,path,...))
}

#' Function to unload a page on site on the Qd server
#' The function requires the name of a page. This page will 
#' then be removed from the server
#' Currently, Qd, server does not allow removing files - BROKEN
#'
#' @param page_name - name of the page to be removed from the Qd server
#' @param ... 
#'
#' @return http code if the page was removed
#' @export
#'
#' @examples
#' site.unload("/example")
site.unload <- function(page_name,...){
        return(.BAclient.unload(page_name,...))
}

#' Basic Authentication HTTP patch function
#' The patch function will take the page name and the data that needs to be patched. 
#' In return you will get http code
#'  This is a (hidden) internal function
#'
#' @param page_name - name of the page
#' @param data - JSON data to be updated on the page. 
#' @param ... 
#'
#' @return http operation code
#' @export
#'
#' @examples
#' .BAclient.path("/example",json_data)
.BAclient.patch <- function(page_name,data,...){
        resp <- httr::PATCH(paste0(.config$hub_address,page_name)
        ,httr::content_type_json()
        ,body=data
        ,httr::authenticate(user=.config$hub_access_key_id,password=.config$hub_access_key_secret))
        
        if(resp$status_code != 200) stop(sprintf("Request failed with code %s and message %s",resp$status_code,rawToChar(resp$output)))
}


#' Basic Authentication HTTP get function
#' The get function will get the requested page in JSON format from the 
#' Qd server
#' This is a (hidden) internal function
#' 
#' @param page_name - name of the page to get
#' @param ... 
#'
#' @return http operation code
#' @export
#'
#' @examples
#' .BAclient.get("/example")
.BAclient.get <- function(page_name,...){
        resp <- httr::GET(paste0(.config$hub_address,page_name)
        ,httr::content_type_json()
        ,httr::authenticate(user=.config$hub_access_key_id,password=.config$hub_access_key_secret))

        if(resp$status_code != 200) stop(sprintf("Request failed with code %s and message %s",resp$status_code,ifelse(rawToChar(resp$content),rawToChar(resp$content),NULL)))
        return(jsonlite::toJSON(rawToChar(resp$content)))
}

#' Basic Authentication HTTP upload with post function
#' This function will upload the files provided in the fle list to the Qd server
#' This is a (hidden) internal function
#' 
#' @param files_list list of files to be uploaded
#' @param ... 
#'
#' @return http operation code, and list of file locations on the Qd server
#' @export
#'
#' @examples
#' file_list <- list("aml.jpg","dai.jpg")
#' .BAclient.upload(file_list)
.BAclient.upload <- function(files_list,...){
        fs <- lapply(files_list,function(x){upload_file(x)})
        names(fs) <- rep("files",length(fs))
        resp <- httr::POST(paste0(.config$hub_address,"/_f")
        ,body=fs
        ,httr::authenticate(user=.config$hub_access_key_id,password=.config$hub_access_key_secret))
        if(resp$status_code != 200){
        stop(sprintf("Upload failed with error code %s and message %s",resp$status_code,ifelse(rawToChar(resp$content),rawToChar(resp$content),NULL)))
        }
        else{
               return(jsonlite::fromJSON(rawToChar(resp$content))) 
        }
}

#' Basic Authentication HTTP download with get function
#' This function will download files from the Qd server and store it in the path provided
#' This is a (hidden) internal function
#' 
#' @param file_name the file that you would like to download from the Qd server
#' @param path  the location wehre the file needs to be downloaded
#' @param ... 
#'
#' @return http operation code
#' @export
#'
#' @examples
#' .BAclient.download("aml.jpb","tmp")
.BAclient.download <- function(file_name,path,...){
        resp <- httr::GET(paste0(.config$hub_address,page_name),write_disk(path))
        if(resp$status_code != 200){
        stop(sprintf("Unload failed with error code %s and message %s",resp$status_code,rawToChar(resp$content)))
        }
        else{
               return(jsonlite::fromJSON(rawToChar(resp$content))) 
        }
}

#' Basic Authentication HTTP delete function
#' This function will delete the page on the Qd server. It requires the page name
#' This is a (hidden) internal function
#' 
#' @param page_name name of the page to be removed from the Qd server
#' @param ... 
#'
#' @return http operation code
#' @export
#'
#' @examples
#' .BAclient.unload("/example")
.BAclient.unload <- function(page_name,...){
        resp <- httr::DELETE(paste0(.config$hub_address,page_name))
        if(resp$status_code != 200){
        stop(sprintf("Unload failed with error code %s and message %s",resp$status_code,rawToChar(resp$content)))
        }
        else{
               return(jsonlite::fromJSON(rawToChar(resp$content))) 
        }
}



