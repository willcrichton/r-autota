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
install.packages('path/to/r-autota', repos=NULL, source='true')
```

To refresh the package after updating source files:

```r
install.packages('devtools')
library(devtools)
reload(inst('autota'))
```
