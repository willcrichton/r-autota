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

.get_functions_in_expression <- function(expr) {
  if (is.call(expr)) {
    fn <- expr[[1]]
    fn <- if (is.symbol(fn) || (is.language(fn) && identical(fn[[1]], sym("::")))) {
      fn
    } else {
      list()
    }
    c(fn, lapply(rlang::call_args(expr), get_functions_in_expression))
  } else if (length(expr) == 1) {
    list()
  } else {
    lapply(expr, get_functions_in_expression)
  }
}

get_functions_in_expression <- function(expr) {
  fns <- unlist(.get_functions_in_expression(expr), use.names = FALSE)
}

get_related_documentation <- function(trace) {
  lowest_call <- trace$trace$calls[[1]]
  fns <- get_functions_in_expression(lowest_call)
  lapply(fns, function(fn) {
    if (is.symbol(fn)) { list(name=toString(fn), package=NULL) }
    else { list(name=toString(fn[[3]]), package=toString(fn[[2]])) }
  })
}

str_match_many <- function(message, patterns) {
  for (pattern in patterns) {
    match <- str_match(message, pattern$pattern)
    if (length(match) != 1 || !is.na(match)) {
      return(match[,pattern$groups])
    }
  }
  NA
}

build_error <- function(trace, kind, query, ...) {
  list(
    message=trace$message,
    so_query=query,
    so_questions=fetch_stack_overflow(query),
    docs=get_related_documentation(trace),
    kind=kind,
    ...)
}

handle_generic_error <- function(trace) {
  send_message(build_error(trace=trace, kind="generic_error", query=trace$message))
  TRUE
}
