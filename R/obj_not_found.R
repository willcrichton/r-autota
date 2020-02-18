get_all_vars <- function() {
  env_vars <- lapply(search(), function(env) { ls(env) })
  unlist(env_vars)
}

all_vars <- get_all_vars()

find_closest_string <- function(s, max_dist = 3) {
  dists <- stringdist::stringdist(s, all_vars)
  sorted_dists <- sort(dists, index.return=TRUE)
  idxs_within_max <- sorted_dists$ix[sorted_dists$x <= max_dist]
  vars_within_max <- all_vars[idxs_within_max]

  vars_within_max
}

handle_obj_not_found <- function(trace, send_message) {
  pattern <- stringr::regex("object (.*) not found")
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  send_message(list(kind="obj_not_found", message=trace$message, matches=matches))
}

