# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Install Package:           'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'

DEBUG <- TRUE

debug_cat <- function(...) {
  if (DEBUG) {
    cat(...);
  }
}

#' @export
autoTAAddin <- function(port=3000) {
  viewer <- getOption("viewer")
  viewer(glue::glue("http://localhost:{port}"))

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

  # editor <- rstudioapi::getSourceEditorContext()

  send_message <- function(message) {
    json <- jsonlite::toJSON(message)
    debug_cat("Sending message: ", json)
    socket$send(json)
  }

  handle_error <- function(trace) {
    handle_obj_not_found(trace, send_message) |
    handle_no_function(trace, send_message);
  }

  error_handler <- function(...) {
    rlang::entrace(...)
    trace <- rlang::last_trace()
    handle_error(trace)
  }

  options(error = error_handler)
}


