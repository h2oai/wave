##Python Reference

#@app('/demo')
#async def serve(q: Q):
#    count = q.client.count or 0
#
#    if not q.client.initialized:
#        q.page['example'] = ui.form_card(box='1 1 12 10', items=[
#            ui.button(name='increment', label=f'Count={count}')
#        ])
#        q.client.initialized = True
#
#    if q.args.increment:
#        q.client.count = count = count + 1
#        q.page['example'].items[0].button.label = f'Count={count}'
#
#    await q.page.save()

library(h2owave)
## set route
route <- "/demo"
## serve page
serve <- function(route){
page <- Site(route)
count = 0
    page$add_card("example",ui_form_card(
         box='2 2 12 10'
         ,items = list(
         ui_button(
            name='increment'
            ,label=paste0('Count=',count)
        )
    )
))
page$save()
}

library(httpuv)
library(jsonlite)

## setup server
s <- startServer(host = "0.0.0.0", port = 15555,
  app = list(
    call = function(req) {
            ## get the wave-client-id
        route <- paste0("/",as.list(req)$HTTP_WAVE_CLIENT_ID)
    ## create a page with route
        serve(route)
#        print(as.list(req))
      body <- paste0("Time: ", Sys.time(), "<br>Path requested: ", req$PATH_INFO)
      list(
        status = 200L,
        headers = list('Content-Type' = 'text/html'),
        body = body
      )
    }
  )
)

##register the app server with wave
register_body <- list(
    register_app=list(
        address = "http://localhost:15555"
        ,mode = 'unicast'
        ,route = '/demo'
    )
)

## push register
httr::POST(
    .config$hub_address
    ,body=jsonlite::toJSON(register_body,auto_unbox=T)
    ,httr::authenticate(
        user=.config$hub_access_key_id
        ,password=.config$hub_access_key_secret
        )
    ,content_type_json()
    )



