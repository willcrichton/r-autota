handle_closure_not_subsettable <- function(trace) {
  pattern <- stringr::regex("Error in (.*) : object of type 'closure' is not subsettable(.*)$", dotall=TRUE)
  match <- stringr::str_match(trace$message, pattern)
  if (length(match) == 1 && is.na(match)) { return(FALSE); }

  bad_expr <- match[[1, 2]]
  ast <- str2lang(bad_expr)
  oper <- ast[[1]]
  if (identical(oper, sym("$")) || identical(oper, sym("[[")) || identical(oper, sym("["))) {
    closure <- ast[[2]]
    ast_copy <- rlang::duplicate(ast)
    ast_copy[[2]] <- quote(a)
    subset <- substring(deparse(ast_copy), 2)
  } else {
    closure <- NULL
    subset <- NULL
  }

  send_message(build_error(
    kind="closure_not_subsettable",
    trace=trace,
    query="object of type 'closure' is not subsettable",
    query_explain="I took out the specific expression because it didn't likely occur in other people's error messages.",
    operator=oper,
    closure=closure,
    subset=subset))

  TRUE
}
