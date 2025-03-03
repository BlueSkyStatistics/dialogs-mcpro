/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Date Order Check",
        navigation: "Date Order Check",
        datevarslabel: "Date Variables (specify earliest to latest; same class; at least 2)",
		compgrplabel: "Comparison",
		compgrpnote: "Note: This is the comparison between all dates specified above that will be checked for order errors, e.g. values should be date1<date2<date3.",
		ltlabel: "<",
		ltelabel: "<=",
		idvarslabel: "Row Identification Variables (optional)",
		dateerrorboxlabel: "Create dataset with date error variable",
		dateerrordatanamelabel: "Dataset name",
		dateerrorvarlabel: "Date error variable name",
        help: {
            title: "Date Order Check",
            r_help: "help('<', package = 'base')",
            body: `
This creates a list of rows in the active dataset where date variable values are not in a specified order.  This helps identify potential date variable errors when dates or 
times are needed for an analysis.  For example, if three date columns are supposed to be in the order of date1 < date2 < date3, this dialog will print all observations where 
the values of those variables do not follow that order.  Missing date values are allowed in the specified variables and will not be used for any comparisons.
<br/><br/>
<b>Date Variables (specify earliest to latest; same class; at least 2):</b>  Specify at least 2 date variables in the order of earliest to latest.  These can be any date class 
(POSIXct, Date), but all variables specified must be the same date class.  If not, an error will result.
<br/><br/>
<b>Comparison:</b>  Specify the comparison operator used to compare the date values.  "<" means less than and "<=" means less than or equal to.  If "<" is chosen, then dates that
are equal will be flagged as errors.  If "<=" is chosen, then dates that are equal will not be flagged as errors.
<br/><br/>
<b>Row Identification Variables (optional):</b>  Specify one or more variables that may be useful to identify the rows.  For example, subject identification number.  These will 
be included in the list of errors.  If no variables are specified, the row number of the dataset will be the only identifier.
<br/><br/>
<b>Create dataset with date error variable:</b>  This will create a separate data set with the original data and a variable indicating whether each observation has a date order 
error (coded as 1=date order error and 0=no date order error).  The <b>Dataset name</b> is the desired name of this data set and <b>Date error variable name</b> is the desired name 
of the date order error variable in this data set.
		`}
    }
}

class DateOrderCheck extends baseModal {
    constructor() {
        var config = {
            id: "DateOrderCheck",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
# vector containing specified order
datevars <- c({{selected.datevars | safe}})

# vector containing ID variables (could be more than one)
idvars <- c({{selected.idvars | safe}})  

# creating a data set with only ID variables and relevant dates
if (is.null(idvars)==TRUE) {
datedata <- {{dataset.name}}[, c(datevars)]
} else {
datedata <- {{dataset.name}}[, c({{selected.idvars | safe}},datevars)]
}

# initalizing empty data set that stores date comparisons
datecomp.result <- data.frame(matrix(, nrow=nrow(datedata), ncol=0))

# comparing all pairs of dates and creating a variable for each pair
for (i in 1:(length(datevars)-1))
{
    for (j in (i+1):length(datevars))
    {
    testing.bad <- ifelse(datedata[ ,c(datevars[i])]{{selected.compgrp | safe}}datedata[ ,c(datevars[j])], 0, 1)
    datecomp.result<-data.frame(datecomp.result,testing.bad)
    }
}

# row sums where if sum>=1 then the observation has a date order issue
comp.sums <- rowSums(datecomp.result, na.rm=TRUE)
bad.rows <- which(comp.sums>=1)

# printing date variables used
dates.used <- data.frame(dates.used=datevars)
BSkyFormat(dates.used,singleTableOutputHeader="Specified Date Variable Order (Comparison is {{selected.compgrp | safe}} )")

# printing summary table
datesummary <- data.frame(NObs=nrow({{dataset.name}}), NObs.Date.Errors=length(bad.rows))
BSkyFormat(datesummary, singleTableOutputHeader="Total Observations and Observations with Date Errors")

# printing observations with date order errors
if (length(bad.rows)>=1) {
    date.errors <- datedata[bad.rows, ]
    date.errors <- data.frame(row=bad.rows,date.errors)
	rownames(date.errors) <- NULL
    BSkyFormat(date.errors, singleTableOutputHeader="Dates That Are Out of Order")
} 

# if want an output dataset of errors then create a new dataset
bad.rows.ind <- ifelse(comp.sums>=1, 1, 0)
{{selected.dateerrordataname | safe}} <- cbind({{dataset.name}}, {{selected.dateerrorvar | safe}}=bad.rows.ind)
BSkyLoadRefresh("{{selected.dateerrordataname | safe}}",load.dataframe={{selected.dateerrorbox | safe}})
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            datevars: {
                el: new dstVariableList(config, {
                    label: localization.en.datevarslabel,
                    no: "datevars",
                    filter: "Date",
                    required: true,
                    extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			compgrplabel: {
				el: new labelVar(config, {
				label: localization.en.compgrplabel, 
				style: "mt-3", 
				h:5
				})
			},
			compgrpnote: {
				el: new labelVar(config, {
				label: localization.en.compgrpnote, 
				style: "mt-1", 
				h:5
				})
			},			
			lt: {
				el: new radioButton(config, {
				label: localization.en.ltlabel,
				no: "compgrp",
				style: "ml-3",
				increment: "lt",
				value: "<",
				state: "checked",
				extraction: "ValueAsIs"
				})
			},
 			lte: {
				el: new radioButton(config, {
				label: localization.en.ltelabel,
				no: "compgrp",
				style: "ml-3 mb-3",
				increment: "lte",
				value: "<=",
				state: "",
				extraction: "ValueAsIs"
				})
			},           
            idvars: {
                el: new dstVariableList(config, {
                label: localization.en.idvarslabel,
                no: "idvars",
                filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                required: false,
                extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			dateerrorbox: {
				el: new checkbox(config, {
				label: localization.en.dateerrorboxlabel,
				no: "dateerrorbox",
				style: "mt-3",
				extraction: "Boolean"
				})
			},
			dateerrordataname: {
				el: new input(config, {
				no: 'dateerrordataname',
				label: localization.en.dateerrordatanamelabel,
				placeholder: "dateerrordata",
				value: "dateerrordata",
				extraction: "TextAsIs",
				type: "character",
				ml: 3
				})
			},
			dateerrorvar: {
				el: new input(config, {
				no: 'dateerrorvar',
				label: localization.en.dateerrorvarlabel,
				placeholder: "dateerror",
				value: "dateerror",
				extraction: "TextAsIs",
				type: "character",
				ml: 3
				})
			}			
        };

       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.datevars.el.content, objects.compgrplabel.el.content, objects.compgrpnote.el.content, objects.lt.el.content, objects.lte.el.content,
				objects.idvars.el.content, objects.dateerrorbox.el.content, objects.dateerrordataname.el.content, objects.dateerrorvar.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-calendar-1",
				positionInNav: 5,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new DateOrderCheck().render()