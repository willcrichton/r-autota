## Test environments 
* local OS X 10.14 install, R 3.6.2
* local Windows 10 install, R 3.6.2
* local Ubuntu 18.04 install, R 3.4.4 (from apt)

## R CMD check results <!--- (TODO:Fix NOTEs) --->
0 errors, 0 warnings, 0 warnings, 1 note

checking R code for possible problems ... NOTE
  fetch_stack_overflow : <anonymous>: no visible binding for global
    variable '.'
  fetch_stack_overflow: no visible binding for global variable '.'
  find_packages_containing_var: no visible binding for global variable
    '.'
  get_imported_packages: no visible binding for global variable '.'
  handle_syntax_error: no visible binding for global variable '.'
  Undefined global functions or variables:
    .

## Downstream dependencies <!--- (TODO: run revdep_check() ) --->

<!--- (TODO: check Licensing for DESCRIPTION ) --->
