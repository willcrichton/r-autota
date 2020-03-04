handle_syntax_error <- function(trace) {
  pattern1 <- list(
    pattern = regex("Error: unexpected (.*) in:?\\s+\"(.+)\"$", dotall=TRUE),
    groups = c(2, 3))
  pattern2 <- list(
    pattern = regex("Error in (.*) : (.*): unexpected (.*)\\n\\d+: (.*)$", dotall=TRUE),
    groups = c(4, 5))
  match <- str_match_many(trace$message, list(pattern1, pattern2))
  if (is.na(match)) { return(FALSE); }

  syntax_kind <- match[[1]]
  bad_expr <- match[[2]]

  # Extract the partial parse information for the malformed expression.
  #   A dummy "srcfile" is required to store the parse data extracted by getParseData.
  srcfile <- srcfilecopy(filename='', lines=c(bad_expr))
  parse_ret <- tryCatch(
    {parse(text=bad_expr, keep.source=TRUE, srcfile=srcfile)},
    error=function(e){NULL})
  parse_info <- if (is.null(parse_ret)) {
    parse_data <- utils::getParseData(srcfile)
    purrr::transpose(parse_data) %>%
      list.filter(.$terminal)
  } else {
    NULL
  }

  send_message(build_error(
    kind="syntax_error",
    trace=trace,
    query=glue("r error unexpected {syntax_kind}"),
    query_explain="I took out the part in quote marks because it's too specific to our program.",
    syntax_kind=syntax_kind,
    bad_expr=bad_expr,
    parse_info=parse_info))

  TRUE
}
