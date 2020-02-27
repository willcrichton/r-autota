fetch_stack_overflow <- function(query, n = 5) {
  # Make Google URL
  base_url <- "https://stackoverflow.com/search?q="
  url_args <- utils::URLencode(gsub(" ", "+", query))
  url <- paste0(base_url, url_args)

    # Fetch and parse web page
  html <- xml2::read_html(url)
  links <- xml2::xml_find_all(html, "//div[@class=\"result-link\"]//a")

  links %>%
    lapply(function(link) {
      title <- xml2::xml_text(link) %>%
        { stringr::str_trim(.) } %>%
        { stringr::str_sub(., start=4) }
      href <- paste0("https://stackoverflow.com", xml2::xml_attr(link, "href"))
      c(title=title, href=href)
    }) %>%
    { .[1:min(length(.),n)] }
}

build_error <- function(trace, kind, query, ...) {
  list(
    message=trace$message,
    so_query=query,
    so_questions=fetch_stack_overflow(query),
    kind=kind,
    ...)
}

handle_generic_error <- function(trace) {
  send_message(build_error(trace=trace, kind="generic_error", query=trace$message))
  TRUE
}
