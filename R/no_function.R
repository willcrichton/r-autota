
handle_no_function <- function(trace) {
  pattern <- regex("could not find function \"(.*)\"$")
  match <- str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  packages <- find_packages_containing_var(missing_obj)
  user_defined <- find_user_defined_symbol(missing_obj)

  send_message(build_error(
    kind="no_function",
    trace=trace,
    query=glue("r could not find function {missing_obj}"),
    query_explain="I took out the quotation marks to avoid being overly-specific in the query. I also left out the specific call expression, only keeping the name of the function.",
    matches=matches,
    packages=packages,
    user_defined=user_defined,
    missing_obj=missing_obj))

  TRUE
}

