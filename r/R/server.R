

register_body <- list(
    register_app=list(
        address = "http://localhost:15555"
        ,mode = 'unicast'
#        ,key_id = .config$hub_access_key_id
#        ,key_secret = .config$hub_access_key_secret
        ,route = '/demo'
    )
)

httr::POST(
    .config$hub_address
    ,body=jsonlite::toJSON(register_body,auto_unbox=T)
    ,httr::authenticate(
        user=.config$hub_access_key_id
        ,password=.config$hub_access_key_secret
        )
    ,content_type_json())


library(httpuv)                            
startServer(
    host = "127.0.0.1"
    , port = 15555
    , list(                                       
        onHeaders = function(req){
         print(capture.output(as.list(req)))
        }
       ,call = function(req) {                      
         body <- ""                                                                  
          list(           
            status = 200L
            ,headers = list('Content-Type' = 'text/html')
            ,body = body        
      )                                                                                                                                                                                      }          
    )
)


startServer("127.0.0.1", 15555,
list(
onHeaders = function(req) {
# Print connection headers
cat(capture.output(str(as.list(req))), sep = "\n")
},
onWSOpen = function(ws) {
cat("Connection opened.\n")
ws$onMessage(function(binary, message) {
cat("Server received message:", message, "\n")
ws$send(message)
})
ws$onClose(function() {
cat("Connection closed.\n")
})
}
)
)




library(httpuv)

s <- startServer(host = "0.0.0.0", port = 15555,
  app = list(
    call = function(req) {
        cat(capture.output(as.list(req)$rook.input$read_lines()), sep = "\n")
      body <- paste0("Time: ", Sys.time(), "<br>Path requested: ", req$PATH_INFO)
      list(
        status = 200L,
        headers = list('Content-Type' = 'text/html'),
        body = body
      )
    }
  )
)