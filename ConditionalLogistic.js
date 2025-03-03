/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Logistic, Conditional",
        navigation: "Logistic, Conditional",
        modelname:"Enter model name",
        outcomevarlabel: "Dependent Variable (numeric; 1 = event, 0 = no event)",
		stratavarlabel: "Strata",
		methodgrplabel: "Estimation Method",
		exactlabel: "Exact",
		efronlabel: "Efron",
		breslowlabel: "Breslow",
        help: {
            title: "Logistic, Conditional",
            r_help: "help(clogit, package = 'survival')",
            body: `
This fits a conditional logistic regression model, which is similar to standard logistic regression, but incorporates a stratification variable.  Common applications of this 
model are in matched case-control, matched cohort, and nested case-control studies.  The output includes the number of strata used in the analysis, outcome frequency patterns 
within strata, various model summary statistics, parameter estimates, and odds ratios.
<br/><br/>
<b>Dependent Variable:</b> This is the variable indicating the event for each subject, with 1 signifying an event, and 0 signifying a non-event.  This variable must be numeric.
<br/><br/>
<b>Formula Builder:</b> Specify the desired model terms.
<br/><br/>
<b>Strata:</b> Specify the stratification variable.  Can be numeric, character, or a nominal/ordinal factor.
<br/><br/>
<b>Estimation Method:</b> Specify the model estimation method.  The "Exact" method is the default.  As long as there are not too many ways to select events within strata, this 
should be the option chosen. The estimation may take some time or lead to errors if many combinations can result within some strata, say 100 events out of 500 subjects.  The Efron 
and Breslow approximations are adequate in these cases, with Efron being preferred.  See the references in the R help for details.
<br/><br/>
<b>Required R Packages:</b> survival, broom, arsenal, dplyr
		`}
    }
}

class ConditionalLogistic extends baseModal {
    constructor() {
        var config = {
            id: "ConditionalLogistic",
            label: localization.en.title,
            modalType: "two",
            RCode: `
library(survival)
library(broom)
library(arsenal)
library(dplyr)

{{selected.modelname | safe}} <- clogit({{selected.outcomevar | safe}} ~ {{selected.modelterms | safe}} + strata({{selected.stratavar | safe}}), data={{dataset.name}}, method="{{selected.methodgrp | safe}}", na.action=na.exclude)

# subsetting to data used in the analysis
# na.action contains observation numbers removed, if any - will be NULL if none removed
if (is.null({{selected.modelname | safe}}$na.action)) {
data.subset <- {{dataset.name}}
} else {
data.subset <- {{dataset.name}}[-{{selected.modelname | safe}}$na.action, ]
}

# number of strata used in the analysis
num_strata <- n_distinct(data.subset[ , c("{{selected.stratavar | safe}}")])

# data frame with outcome and strata variables, and number of strata
BSkyFormat(data.frame(outcome="{{selected.outcomevar | safe}}", strata="{{selected.stratavar | safe}}", num_strata=num_strata), singleTableOutputHeader="Variables Used and Number of Strata")

# computing outcome pattern frequencies within strata
outcome.patterns.table <- table(data.subset[ , c("{{selected.stratavar | safe}}")], data.subset[ , c("{{selected.outcomevar | safe}}")])

patterns <- data.frame(nonevents=outcome.patterns.table[ ,1], events=outcome.patterns.table[ ,2])
patterns.freqlist <- freqlist(table(patterns[ , c("nonevents","events")]))
BSkyFormat(as.data.frame(patterns.freqlist), singleTableOutputHeader="Strata Outcome Frequencies")

# model summary
clogit_summary <- t(glance({{selected.modelname | safe}}))
BSkyFormat(clogit_summary, singleTableOutputHeader="Model Summary")

# parameter estimates
clogit_est <- as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE))	
BSkyFormat(clogit_est, singleTableOutputHeader="Parameter Estimates and 95% Confidence Intervals")

# odds ratios
clogit_or <- as.data.frame(tidy({{selected.modelname | safe}}, exponentiate=TRUE, conf.int=TRUE)) %>%
	dplyr::select(-std.error, -statistic)
BSkyFormat(clogit_or, singleTableOutputHeader="Odds Ratios (OR) and 95% Confidence Intervals")
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
					style: "mb-3",
                    placeholder: "CondLogisticModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CondLogisticModel1"
                })
            },
            outcomevar: {
                el: new dstVariable(config, {
                    label: localization.en.outcomevarlabel,
                    no: "outcomevar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
					required: true
                })
            }, 
            stratavar: {
                el: new dstVariable(config, {
                    label: localization.en.stratavarlabel,
                    no: "stratavar",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
			methodgrplabel: {
				el: new labelVar(config, {
				label: localization.en.methodgrplabel, 
				style: "mt-3", 
				h:5
				})
			},			
			exact: {
				el: new radioButton(config, {
				label: localization.en.exactlabel,
				no: "methodgrp",
				style: "ml-3",
				increment: "exact",
				value: "exact",
				state: "checked",
				extraction: "ValueAsIs"
				})
			},
 			efron: {
				el: new radioButton(config, {
				label: localization.en.efronlabel,
				no: "methodgrp",
				style: "ml-3",
				increment: "efron",
				value: "efron",
				state: "",
				extraction: "ValueAsIs"
				})
			},           
 			breslow: {
				el: new radioButton(config, {
				label: localization.en.breslowlabel,
				no: "methodgrp",
				style: "ml-3",
				increment: "breslow",
				value: "breslow",
				state: "",
				extraction: "ValueAsIs"
				})
			} 
        };

       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content, objects.outcomevar.el.content, objects.modelterms.el.content, objects.stratavar.el.content,
				objects.methodgrplabel.el.content, objects.exact.el.content, objects.efron.el.content, objects.breslow.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-logisticconditional",
				positionInNav: 12,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new ConditionalLogistic().render()