/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class ConditionalLogistic extends baseModal {
    static dialogId = 'ConditionalLogistic'
    static t = baseModal.makeT(ConditionalLogistic.dialogId)

    constructor() {
        var config = {
            id: ConditionalLogistic.dialogId,
            label: ConditionalLogistic.t('title'),
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
                    label: ConditionalLogistic.t('modelname'),
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
                    label: ConditionalLogistic.t('outcomevarlabel'),
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
                    label: ConditionalLogistic.t('stratavarlabel'),
                    no: "stratavar",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
			methodgrplabel: {
				el: new labelVar(config, {
				label: ConditionalLogistic.t('methodgrplabel'), 
				style: "mt-3", 
				h:5
				})
			},			
			exact: {
				el: new radioButton(config, {
				label: ConditionalLogistic.t('exactlabel'),
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
				label: ConditionalLogistic.t('efronlabel'),
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
				label: ConditionalLogistic.t('breslowlabel'),
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
                name: ConditionalLogistic.t('navigation'),
                icon: "icon-logisticconditional",
				positionInNav: 12,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: ConditionalLogistic.t('help.title'),
            r_help: ConditionalLogistic.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: ConditionalLogistic.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new ConditionalLogistic().render()
}
