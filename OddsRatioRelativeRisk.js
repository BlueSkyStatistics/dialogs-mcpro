
var localization = {
    en: {
        title: "Odds Ratios / Relative Risks, M by 2 Table",
        navigation: "Odds Ratios / Relative Risks, M by 2 Table",
        outcomevarlabel: "Outcome Variable (Binary Factor)",
        expvarlabel: "Exposure/Predictor Variable (Factor)",
		statlabel: "Statistic",
		orlabel: "Odds Ratios",
		rrlabel: "Relative Risks",
		oresttypelabel: "Odds Ratio Estimation Type",
		orestwaldlabel: "Wald",
		orestfisherlabel: "Fisher",
		orestmidplabel: "Mid-p",
		orestsmalllabel: "Small Sample Adjusted",
		rresttypelabel: "Relative Risk Estimation Type",
		rrestwaldlabel: "Wald",
		rrestsmalllabel: "Small Sample Adjusted",
		reversallabel: "Category Reversal",
		revnonelabel: "No Reversal",
		revexplabel: "Exposure",
		revoutlabel: "Outcome",
		revbothlabel: "Both",
		cilevellabel: "Confidence Level (0-1)",
        help: {
            title: "Odds Ratios / Relative Risks, M by 2 Table",
            r_help: "help(epitab, package ='epitools')",
            body: `
This is used to compare probabilities of having a "disease" for one group relative to another, in a ratio of odds (odds ratio) form or probability ratio (relative risk) form.  
The odds of "disease" is defined as the probability of "disease" divided by the probability of "no disease". A contingency table of outcome frequencies in each group is provided.  
In addition, a table of odds ratios or relative risks for each group relative to the reference group with confidence intervals and a Wald Chi-Square p-value is included.  Lastly, 
a table of p-values is shown with mid-p exact, Fisher's exact, and Wald Chi-Square versions, comparing each group to the reference group. 
<br/><br/>
<b>Outcome Variable:</b> Binary "disease" (yes/no) variable of interest.  By default, the highest category in the sort order is defined as "disease yes".
<br/><br/>
<b>Exposure/Predictor Variable:</b> Groups to compare.  Can have more than 2 groups.
<br/><br/>
<b>Statistic:</b> Which statistic to compute
<br/><br/>
<b>Odds Ratio / Relative Risk Estimation Type:</b> Wald (unconditional maximum likelihood), Fisher (conditional maximum likelihood), Mid-p (median unbiased method), or Small Sample Adjusted
<br/><br/>
<b>Category Reversal:</b>  This controls whether or not to reverse the ordering of the exposure variable categories or the outcome variable categories.  Reversing the exposure 
variable will change the reference group for the odds ratios.  Reversing the outcome variable will change the category that corresponds to "disease".
<br/><br/>
<b>Confidence Level:</b> level for the confidence intervals; default is 0.95
<br/><br/>
<b>Required R Packages:</b> epitools
			`}
    }
}









class OddsRatioRelativeRisk extends baseModal {
    constructor() {
        var config = {
            id: "OddsRatioRelativeRisk",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(epitools)

{{if (options.selected.stattypegrp=="OR")}}
or.result <- epitab(x={{selected.expvar | safe}}, y={{selected.outcomevar | safe}}, method="oddsratio", rev="{{selected.revgrp | safe}}", oddsratio="{{selected.ortypegrp | safe}}", conf.level={{selected.cilevel | safe}}, pvalue="chi2", verbose=TRUE)

# raw frequencies, odds ratio table, and p-values, in that order
BSkyFormat(or.result$data, singleTableOutputHeader="{{selected.tabtitle | safe}}")
BSkyFormat(or.result$tab, singleTableOutputHeader="Odds Ratios with Confidence Intervals ({{selected.cilevel | safe}} level) and Wald Chi-Square")
BSkyFormat(or.result$p.value, singleTableOutputHeader="P-Values")
{{#else}}
rr.result <- epitab(x={{selected.expvar | safe}}, y={{selected.outcomevar | safe}}, method="riskratio", rev="{{selected.revgrp | safe}}", riskratio="{{selected.rrtypegrp | safe}}", conf.level={{selected.cilevel | safe}}, pvalue="chi2", verbose=TRUE)

# raw frequencies, relative risk table, and p-values, in that order
BSkyFormat(rr.result$data, singleTableOutputHeader="{{selected.tabtitle | safe}}")
BSkyFormat(rr.result$tab, singleTableOutputHeader="Relative Risks with Confidence Intervals ({{selected.cilevel | safe}} level) and Wald Chi-Square")
BSkyFormat(rr.result$p.value, singleTableOutputHeader="P-Values")
{{/if}}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
			outcomevar: {
				el: new dstVariable(config, {
				label: localization.en.outcomevarlabel,
				no: "outcomevar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "Prefix|UseComma",
				required: true,
				})
			},
			expvar: {
				el: new dstVariable(config, {
				label: localization.en.expvarlabel,
				no: "expvar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "Prefix|UseComma",
				required: true,
				})
			},			
			statlabel: {
				el: new labelVar(config, {
				label: localization.en.statlabel, 
				style: "mt-4", 
				h:5
				})
			},			
			oropt: {
				el: new radioButton(config, {
				label: localization.en.orlabel,
				no: "stattypegrp",
				increment: "or",
				value: "OR",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			rropt: {
				el: new radioButton(config, {
				label: localization.en.rrlabel,
				no: "stattypegrp",
				increment: "rr",
				value: "RR",
				state: "",
				extraction: "ValueAsIs",
				})
			}, 			
			oresttypelabel: {
				el: new labelVar(config, {
				label: localization.en.oresttypelabel, 
				style: "mt-4", 
				h:5
				})
			},
			orwaldopt: {
				el: new radioButton(config, {
				label: localization.en.orestwaldlabel,
				no: "ortypegrp",
				increment: "wald",
				value: "wald",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			orfisheropt: {
				el: new radioButton(config, {
				label: localization.en.orestfisherlabel,
				no: "ortypegrp",
				increment: "fisher",
				value: "fisher",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			ormidpopt: {
				el: new radioButton(config, {
				label: localization.en.orestmidplabel,
				no: "ortypegrp",
				increment: "midp",
				value: "midp",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			orsmallopt: {
				el: new radioButton(config, {
				label: localization.en.orestsmalllabel,
				no: "ortypegrp",
				increment: "small",
				value: "small",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			rresttypelabel: {
				el: new labelVar(config, {
				label: localization.en.rresttypelabel, 
				style: "mt-4", 
				h:5
				})
			},
			rrwaldopt: {
				el: new radioButton(config, {
				label: localization.en.rrestwaldlabel,
				no: "rrtypegrp",
				increment: "wald",
				value: "wald",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			rrsmallopt: {
				el: new radioButton(config, {
				label: localization.en.rrestsmalllabel,
				no: "rrtypegrp",
				increment: "small",
				value: "small",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			reversallabel: {
				el: new labelVar(config, {
				label: localization.en.reversallabel, 
				style: "mt-4", 
				h:5
				})
			},
			revnoneopt: {
				el: new radioButton(config, {
				label: localization.en.revnonelabel,
				no: "revgrp",
				increment: "neither",
				value: "neither",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			revexpopt: {
				el: new radioButton(config, {
				label: localization.en.revexplabel,
				no: "revgrp",
				increment: "rows",
				value: "rows",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			revoutopt: {
				el: new radioButton(config, {
				label: localization.en.revoutlabel,
				no: "revgrp",
				increment: "columns",
				value: "columns",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			revbothopt: {
				el: new radioButton(config, {
				label: localization.en.revbothlabel,
				no: "revgrp",
				increment: "both",
				value: "both",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			cilevel: {
				el: new input(config, {
				no: 'cilevel',
				label: localization.en.cilevellabel,
				style: "mt-3",
				placeholder: "0.95",
				value: "0.95",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				width:"w-25",
				})
			}			
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.outcomevar.el.content, objects.expvar.el.content,					 
					objects.statlabel.el.content, objects.oropt.el.content, objects.rropt.el.content,
					objects.oresttypelabel.el.content, objects.orwaldopt.el.content, objects.orfisheropt.el.content, objects.ormidpopt.el.content,
					objects.rresttypelabel.el.content, objects.rrwaldopt.el.content, objects.rrsmallopt.el.content,
					objects.reversallabel.el.content, objects.revnoneopt.el.content, objects.revexpopt.el.content, objects.revoutopt.el.content, objects.revbothopt.el.content,
					objects.cilevel.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-or",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	prepareExecution(instance) {
		//following lines will be there
		var res = [];
		var code_vars = {
            dataset: {
                name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
		
		//create several formats
		let outcomevar=code_vars.selected.outcomevar.toString().split("$")[1]
		let expvar=code_vars.selected.expvar.toString().split("$")[1]
		let tabtitle = "Frequencies of Predictor = "+expvar+" vs Outcome = "+outcomevar
		
		//create new variables under code_vars
		code_vars.selected.tabtitle = tabtitle
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}	
	
	
}
module.exports.item = new OddsRatioRelativeRisk().render()