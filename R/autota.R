# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Install Package:           'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'

library(glue)

DEBUG <- TRUE

debug_cat <- function(...) {
  if (DEBUG) {
    cat(...);
  }
}

autoTAAddin <- function(port=3000) {
  editor <- rstudioapi::getSourceEditorContext()

  viewer <- getOption("viewer")
  viewer(glue("http://localhost:{port}"))

  httpuv::stopAllServers()
  s <- httpuv::startServer(
    "127.0.0.1", 8080,
    list(
       onWSOpen = function(ws) {
         # The ws object is a WebSocket object
         debug_cat("Server connection opened.\n")

         ws$onMessage(function(binary, message) {
           debug_cat("Server received message:", message, "\n")
          })
         ws$onClose(function() {
           debug_cat("Server connection closed.\n")
         })

         socket <<- ws
       }
     ))


  error_handler <- function(...) {
    rlang::entrace(...)
    trace <- rlang::last_trace()
    message <- list(message=trace$message, trace=sapply(trace$trace$calls, function(c) { toString(c) }))
    socket$send(jsonlite::toJSON(message))
  }
  options(error = error_handler)
}

