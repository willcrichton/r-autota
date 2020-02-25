# Auto TA

## Install from source

On the command line:

```bash
git clone https://github.com/willcrichton/r-autota
cd r-autota
pwd # Copy the printed directory into your clipboard
```

In R:

```r
install.packages('/path/to/r-autota', repos=NULL, type='source')
```

To refresh the package after updating source files:

```r
install.packages('devtools')
library(devtools)
install.packages('stringdist')
reload(inst('autota'))
```

<!--- (TODO: check README.Rmd and NEWS section of http://r-pkgs.had.co.nz/release.html) --->
