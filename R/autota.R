# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Install Package:           'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'

library(shiny)
library(miniUI)

autoTAAddin <- function() {
  context <- rstudioapi::getActiveDocumentContext()
  ui <- miniPage(
    gadgetTitleBar('Test'),
    miniContentPanel(
      p("hello"),
      uiOutput('output')
    )
  )

  server <- function(input, output, session) {
    output$output <- renderUI({p("hi")})

    observeEvent(input$done, {
      stopApp()
    })
  }

  viewer <- paneViewer(300)
  runGadget(ui, server, viewer = viewer)
}

autoTAAddin()
