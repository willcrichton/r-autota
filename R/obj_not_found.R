get_all_toplevel_vars <- function() {
  env_vars <- lapply(search(), function(env) { ls(env) })
  unlist(env_vars)
}

get_imported_packages <- function() {
  search() %>>%
    lapply(function(name) {
      parts <- unlist(strsplit(name, ":"))
      if (length(parts) > 1) {
        parts[2]
      } else {
        NULL
      }
    }) %>>%
    list.filter(!is.null(.))
}

get_all_package_vars <- memoise::memoise(function() {
  lookup_table <-
    .packages(TRUE) %>>%
    lapply(function(pkg) {
      tryCatch({
        list.zip(pkg=pkg, var=names(getNamespace(pkg)))
      }, warning = function(w) {
        NULL
      }, error = function(e) {
        NULL
      })
    }) %>>%
    { unlist(., recursive = FALSE) } %>>%
    { do.call(rbind, .) } %>>%
    { data.frame(.) }
})

find_packages_containing_var <- function(var) {
  all_vars <- get_all_package_vars()
  imported_pkgs <- get_imported_packages()
  all_vars[all_vars$var == var,]$pkg %>>%
    list.filter(!(. %in% imported_pkgs)) %>>%
    unlist(.)
}

find_closest_string <- function(s, max_dist = 2, max_matches = 3) {
  all_vars <- get_all_toplevel_vars()
  dists <- stringdist::stringdist(s, all_vars)
  sorted_dists <- sort(dists, index.return=TRUE)
  idxs_within_max <- sorted_dists$ix[sorted_dists$x <= max_dist]
  if (length(idxs_within_max) == 0) { return(list()) }

  vars_within_max <- all_vars[idxs_within_max]
  vars_within_max[1:min(length(vars_within_max), max_matches)]
}

handle_obj_not_found <- function(trace) {
  pattern <- stringr::regex("object '(.*)' not found")
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  packages <- find_packages_containing_var(missing_obj)
  send_message(build_error(
    kind="obj_not_found",
    trace=trace,
    query=trace$message,
    matches=matches,
    packages=packages,
    missing_obj=missing_obj))

  TRUE
}
