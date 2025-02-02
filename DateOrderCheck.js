


class DateOrderCheck extends baseModal {
    static dialogId = 'DateOrderCheck'
    static t = baseModal.makeT(DateOrderCheck.dialogId)

    constructor() {
        var config = {
            id: DateOrderCheck.dialogId,
            label: DateOrderCheck.t('title'),
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
                    label: DateOrderCheck.t('datevarslabel'),
                    no: "datevars",
                    filter: "Date",
                    required: true,
                    extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			compgrplabel: {
				el: new labelVar(config, {
				label: DateOrderCheck.t('compgrplabel'), 
				style: "mt-3", 
				h:5
				})
			},
			compgrpnote: {
				el: new labelVar(config, {
				label: DateOrderCheck.t('compgrpnote'), 
				style: "mt-1", 
				h:5
				})
			},			
			lt: {
				el: new radioButton(config, {
				label: DateOrderCheck.t('ltlabel'),
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
				label: DateOrderCheck.t('ltelabel'),
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
                label: DateOrderCheck.t('idvarslabel'),
                no: "idvars",
                filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                required: false,
                extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			dateerrorbox: {
				el: new checkbox(config, {
				label: DateOrderCheck.t('dateerrorboxlabel'),
				no: "dateerrorbox",
				style: "mt-3",
				extraction: "Boolean"
				})
			},
			dateerrordataname: {
				el: new input(config, {
				no: 'dateerrordataname',
				label: DateOrderCheck.t('dateerrordatanamelabel'),
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
				label: DateOrderCheck.t('dateerrorvarlabel'),
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
                name: DateOrderCheck.t('navigation'),
                icon: "icon-calendar-1",
				positionInNav: 5,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: DateOrderCheck.t('help.title'),
            r_help: DateOrderCheck.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: DateOrderCheck.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new DateOrderCheck().render()
}
