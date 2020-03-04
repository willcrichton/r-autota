get_all_toplevel_vars <- function() {
  env_vars <- lapply(search(), function(env) { ls(env) })
  unlist(env_vars)
}

get_imported_packages <- function() {
  search() %>%
    lapply(function(name) {
      parts <- unlist(strsplit(name, ":"))
      if (length(parts) > 1) {
        parts[2]
      } else {
        NULL
      }
    }) %>%
    list.filter(!is.null(.))
}

get_all_package_vars <- memoise::memoise(function() {
  lookup_table <-
    .packages(TRUE) %>%
    lapply(function(pkg) {
      tryCatch({
        list.zip(pkg=pkg, var=names(getNamespace(pkg)))
      }, warning = function(w) {
        NULL
      }, error = function(e) {
        NULL
      })
    }) %>%
    { unlist(., recursive = FALSE) } %>%
    { do.call(rbind, .) } %>%
    { data.frame(.) }
})

find_packages_containing_var <- function(var) {
  all_vars <- get_all_package_vars()
  imported_pkgs <- get_imported_packages()
  all_vars[all_vars$var == var,]$pkg %>%
    list.filter(!(. %in% imported_pkgs)) %>%
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

get_source_lines_for_ref <- function(src, ref) {
  line <- utils::getSrcLocation(ref, which = "line")
  list(line_number = line, line_text = getSrcLines(src, line, line))
}

get_defined_symbols <- function(path) {
  src <- srcfile(filename = path)
  exprs <- parse(file = path, keep.source = TRUE, srcfile = src)
  exprs %>%
    list.zip(expr = ., ref = utils::getSrcref(.)) %>%
    list.filter(is.expression(.$expr) && identical(.$expr[[1]], rlang::sym("<-"))) %>%
    list.map(
      c(list(name = .$expr[[2]], path=basename(path)),
        get_source_lines_for_ref(src, .$ref)))
}

find_user_defined_symbol <- function(obj) {
  ctx <- rstudioapi::getSourceEditorContext()
  # If the user creates a new R script without saving it, then ignore this case
  if (is.null(ctx) || ctx$path == "") { return(NULL) }

  user_symbols <- get_defined_symbols(path = ctx$path)
  user_symbols %>%
    list.find(.$name == obj) %>%
    { if (length(.) == 0) { NULL } else { .[[1]] }}
}

handle_obj_not_found <- function(trace) {
  pattern <- regex("object '(.*)' not found")
  match <- str_match(trace$message, pattern)
  if (is.na(match[[1, 1]])) { return(FALSE); }

  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  packages <- find_packages_containing_var(missing_obj)
  user_defined <- find_user_defined_symbol(missing_obj)

  send_message(build_error(
    kind="obj_not_found",
    trace=trace,
    query=trace$message,
    query_explain="The error is already short, so we can search it directly.",
    matches=matches,
    packages=packages,
    user_defined=user_defined,
    missing_obj=missing_obj))

  TRUE
}
