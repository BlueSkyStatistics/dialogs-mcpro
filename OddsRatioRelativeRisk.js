










class OddsRatioRelativeRisk extends baseModal {
    static dialogId = 'OddsRatioRelativeRisk'
    static t = baseModal.makeT(OddsRatioRelativeRisk.dialogId)

    constructor() {
        var config = {
            id: OddsRatioRelativeRisk.dialogId,
            label: OddsRatioRelativeRisk.t('title'),
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
				label: OddsRatioRelativeRisk.t('outcomevarlabel'),
				no: "outcomevar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "Prefix|UseComma",
				required: true,
				})
			},
			expvar: {
				el: new dstVariable(config, {
				label: OddsRatioRelativeRisk.t('expvarlabel'),
				no: "expvar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "Prefix|UseComma",
				required: true,
				})
			},			
			statlabel: {
				el: new labelVar(config, {
				label: OddsRatioRelativeRisk.t('statlabel'), 
				style: "mt-4", 
				h:5
				})
			},			
			oropt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('orlabel'),
				no: "stattypegrp",
				increment: "or",
				value: "OR",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			rropt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('rrlabel'),
				no: "stattypegrp",
				increment: "rr",
				value: "RR",
				state: "",
				extraction: "ValueAsIs",
				})
			}, 			
			oresttypelabel: {
				el: new labelVar(config, {
				label: OddsRatioRelativeRisk.t('oresttypelabel'), 
				style: "mt-4", 
				h:5
				})
			},
			orwaldopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('orestwaldlabel'),
				no: "ortypegrp",
				increment: "wald",
				value: "wald",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			orfisheropt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('orestfisherlabel'),
				no: "ortypegrp",
				increment: "fisher",
				value: "fisher",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			ormidpopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('orestmidplabel'),
				no: "ortypegrp",
				increment: "midp",
				value: "midp",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			orsmallopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('orestsmalllabel'),
				no: "ortypegrp",
				increment: "small",
				value: "small",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			rresttypelabel: {
				el: new labelVar(config, {
				label: OddsRatioRelativeRisk.t('rresttypelabel'), 
				style: "mt-4", 
				h:5
				})
			},
			rrwaldopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('rrestwaldlabel'),
				no: "rrtypegrp",
				increment: "wald",
				value: "wald",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			rrsmallopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('rrestsmalllabel'),
				no: "rrtypegrp",
				increment: "small",
				value: "small",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			reversallabel: {
				el: new labelVar(config, {
				label: OddsRatioRelativeRisk.t('reversallabel'), 
				style: "mt-4", 
				h:5
				})
			},
			revnoneopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('revnonelabel'),
				no: "revgrp",
				increment: "neither",
				value: "neither",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			revexpopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('revexplabel'),
				no: "revgrp",
				increment: "rows",
				value: "rows",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			revoutopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('revoutlabel'),
				no: "revgrp",
				increment: "columns",
				value: "columns",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			revbothopt: {
				el: new radioButton(config, {
				label: OddsRatioRelativeRisk.t('revbothlabel'),
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
				label: OddsRatioRelativeRisk.t('cilevellabel'),
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
                name: OddsRatioRelativeRisk.t('navigation'),
                icon: "icon-or",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: OddsRatioRelativeRisk.t('help.title'),
            r_help: OddsRatioRelativeRisk.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: OddsRatioRelativeRisk.t('help.body')
        }
;
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

module.exports = {
    render: () => new OddsRatioRelativeRisk().render()
}
