/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class LogisticRegMultiple extends baseModal {
    static dialogId = 'LogisticRegMultiple'
    static t = baseModal.makeT(LogisticRegMultiple.dialogId)

    constructor() {
        var config = {
            id: LogisticRegMultiple.dialogId,
            label: LogisticRegMultiple.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(arsenal)
library(dplyr)

logreg.tab <- modelsum({{selected.depvar | safe}} ~ {{selected.indvars | safe}}, adjust=list('Unadjusted' = ~1 {{selected.adjvars1 | safe}}{{selected.adjvars2 | safe}}{{selected.adjvars3 | safe}}{{selected.adjvars4 | safe}}{{selected.adjvars5 | safe}}) {{selected.stratavar | safe}} {{selected.wgtvar | safe}}, data={{dataset.name}}, family=binomial, binomial.stats=c({{selected.statslist | safe}}), show.intercept={{selected.interceptchkbox | safe}}, show.adjust={{selected.adjvarschkbox | safe}}, digits={{selected.contdigits | safe}}, digits.p={{selected.pvaluedigits | safe}}, digits.ratio={{selected.ordigits | safe}}, conf.level={{selected.cilevel | safe}})

logreg.tab.final <- as.data.frame(summary(logreg.tab, text=TRUE, term.name="term", adjustment.names={{selected.adjnameschkbox | safe}}))

{{if (options.selected.parestpvaluechkbox=="'p.value'")}}
# renaming p-value column so that modelsum p-value formatting is used instead of BlueSky's formatting
logreg.tab.final <- dplyr::rename(logreg.tab.final, "p value"="p.value")
{{/if}}

# adding model number to the final table
outdat <- as.data.frame(logreg.tab)
modnumlag <- lag(outdat$model)
model <- ifelse(outdat$model!=modnumlag, as.character(outdat$model), "")
model[1] <- "1"
logreg.tab.final <- bind_cols(model=model, logreg.tab.final)

{{if (options.selected.stratavar!="")}}
# if strata column making that first
logreg.tab.final <- relocate(logreg.tab.final, 2)
{{/if}}

BSkyFormat(logreg.tab.final, decimalDigitsRounding=-1, singleTableOutputHeader="Logistic Regression Models for Dependent Variable = {{selected.depvar | safe}} (CI level={{selected.cilevel | safe}})")

{{if (((options.selected.adjvars1 != "") | (options.selected.adjvars2 != "") | (options.selected.adjvars3 != "") | (options.selected.adjvars4 != "") | (options.selected.adjvars5 != "")) & (options.selected.adjvarschkbox == "FALSE"))}}
# printing adjustment variable lists
BSkyFormat(data.frame(Set1=c({{selected.set1stringfinal | safe}}), 
					  Set2=c({{selected.set2stringfinal | safe}}), 
					  Set3=c({{selected.set3stringfinal | safe}}), 
					  Set4=c({{selected.set4stringfinal | safe}}), 
					  Set5=c({{selected.set5stringfinal | safe}})), 
		   singleTableOutputHeader="Adjustment Variable Sets")
{{/if}}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "copy", scroll: true}) },
			depvar: {
				el: new dstVariable(config, {
				label: LogisticRegMultiple.t('depvarlabel'),
				no: "depvar",
				filter: "Numeric|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},						
			indvars: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('indvarslabel'),
				no: "indvars",
				required: true,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},
			adjvars1: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('adjvars1label'),
				no: "adjvars1",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 1' = ~ %val%"
				})
			},
			adjvars2: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('adjvars2label'),
				no: "adjvars2",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 2' = ~ %val%"
				})
			},
			adjvars3: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('adjvars3label'),
				no: "adjvars3",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 3' = ~ %val%"
				})
			},
			adjvars4: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('adjvars4label'),
				no: "adjvars4",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 4' = ~ %val%"
				})
			},
			adjvars5: {
				el: new dstVariableList(config,{
				label: LogisticRegMultiple.t('adjvars5label'),
				no: "adjvars5",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 5' = ~ %val%"
				})
			},			
			stratavar: {
				el: new dstVariable(config, {
				label: LogisticRegMultiple.t('stratavarlabel'),
				no: "stratavar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", strata=%val%",
				required: false,
				})
			},
			wgtvar: {
				el: new dstVariable(config, {
				label: LogisticRegMultiple.t('wgtvarlabel'),
				no: "wgtvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", weights=%val%",
				required: false
				})
			},
			digitslabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('digitslabel'), 
				h:5,
				style: "mt-4"
				})
			},
			contdigits: {
				el: new inputSpinner(config, {
				  no: 'contdigits',
				  label: LogisticRegMultiple.t('contdigitslabel'),
				  min: 0,
				  max: 1000,
				  step: 1,
				  value: 4,
				  style: "ml-3",
				  extraction: "NoPrefix|UseComma"
				})
			},
			pvaluedigits: {
				el: new inputSpinner(config, {
				  no: 'pvaluedigits',
				  label: LogisticRegMultiple.t('pvaluedigitslabel'),
				  min: 1,
				  max: 1000,
				  step: 1,
				  value: 4,
				  style: "ml-3",
				  extraction: "NoPrefix|UseComma"
				})
			},
			ordigits: {
				el: new inputSpinner(config, {
				  no: 'ordigits',
				  label: LogisticRegMultiple.t('ordigitslabel'),
				  min: 1,
				  max: 1000,
				  step: 1,
				  value: 4,
				  style: "ml-3 mb-4",
				  extraction: "NoPrefix|UseComma"
				})
			},			
			parestorlabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('parestorlabel'), 
				h:5
				})
			},
			parestimatechkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('parestchkboxlabel'),
				no: "parestimatechkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'estimate'",
				false_value: ""
				})
			},
			stderrorschkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('stderrorschkboxlabel'),
				no: "stderrorschkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'std.error'",
				false_value: ""
				})
			},
			confintchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('confintchkboxlabel'),
				no: "confintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.wald'",
				false_value: ""
				})
			},
			likeconfintchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('likeconfintchkboxlabel'),
				no: "likeconfintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.estimate'",
				false_value: ""
				})
			},
			orchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('orchkboxlabel'),
				no: "orchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'OR'",
				false_value: ""
				})
			},
			orconfintchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('orconfintchkboxlabel'),
				no: "orconfintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.OR.wald'",
				false_value: ""
				})
			},
			likeorconfintchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('likeorconfintchkboxlabel'),
				no: "likeorconfintchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'CI.OR'",
				false_value: ""
				})
			},			
			cilevel: {
				el: new inputSpinner(config, {
				  no: 'cilevel',
				  label: LogisticRegMultiple.t('cilevellabel'),
				  min: 0,
				  max: 100,
				  step: .001,
				  value: .95,
				  extraction: "NoPrefix|UseComma"
				})
			},
			interceptchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('interceptchkboxlabel'),
				no: "interceptchkbox",
				state: "checked",
				extraction: "Boolean"
				})
			},
			adjvarschkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('adjvarschkboxlabel'),
				no: "adjvarschkbox",
				state: "checked",
				extraction: "Boolean"
				})
			},
			adjnameschkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('adjnameschkboxlabel'),
				no: "adjnameschkbox",
				extraction: "Boolean"
				})
			},			
			samplesizelabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('samplesizelabel'), 
				h:5,
				style: "mt-4",
				})
			},
			nchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('samplesizelabel'),
				no: "nchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},
			nmissifanychkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('nmissifanychkboxlabel'),
				no: "nmissifanychkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'Nmiss'",
				false_value: ""
				})
			},
			nmissalwayschkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('nmissalwayschkboxlabel'),
				no: "nmissalwayschkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},
			fitstatisticslabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('fitstatisticslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			concchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('concchkboxlabel'),
				no: "concchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'concordance'",
				false_value: ""
				})
			},
			aicchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('aicchkboxlabel'),
				no: "aicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'AIC'",
				false_value: ""
				})
			},
			bicchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('bicchkboxlabel'),
				no: "bicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'BIC'",
				false_value: ""
				})
			},
			loglikchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('loglikchkboxlabel'),
				no: "loglikchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'logLik'",
				false_value: ""
				})
			},
			nulldevchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('nulldevchkboxlabel'),
				no: "nulldevchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'null.deviance'",
				false_value: ""
				})
			},
			devchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('devchkboxlabel'),
				no: "devchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'deviance'",
				false_value: ""
				})
			},
			nulldfchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('nulldfchkboxlabel'),
				no: "nulldfchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'df.null'",
				false_value: ""
				})
			},
			resdfchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('resdfchkboxlabel'),
				no: "resdfchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'df.residual'",
				false_value: ""
				})
			},			
			pvalueslabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('pvalueslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			parestpvaluechkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('parestpvaluechkboxlabel'),
				no: "parestpvaluechkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'p.value'",
				false_value: ""
				})
			},		
			lrtpvaluechkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('lrtpvaluechkboxlabel'),
				no: "lrtpvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.lrt'",
				false_value: ""
				})
			},
			teststatisticslabel: {
				el: new labelVar(config, {
				label: LogisticRegMultiple.t('teststatisticslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			zstatchkbox: {
				el: new checkbox(config, {
				label: LogisticRegMultiple.t('zstatchkboxlabel'),
				no: "zstatchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'statistic'",
				false_value: ""
				})
			}			
		}
		
		var optionspanel = {
            el: new optionsVar(config, {
                no: "optionspanel",
                //name: "Options",
                content: [
                    objects.parestorlabel.el, objects.parestimatechkbox.el, objects.stderrorschkbox.el, objects.confintchkbox.el, objects.likeconfintchkbox.el, 
					objects.orchkbox.el, objects.orconfintchkbox.el, objects.likeorconfintchkbox.el, objects.interceptchkbox.el, objects.adjvarschkbox.el, 
					objects.adjnameschkbox.el, objects.cilevel.el, 
					objects.samplesizelabel.el, objects.nchkbox.el, objects.nmissifanychkbox.el, objects.nmissalwayschkbox.el,
					objects.fitstatisticslabel.el, objects.concchkbox.el, objects.aicchkbox.el, objects.bicchkbox.el, objects.loglikchkbox.el, objects.nulldevchkbox.el,
					objects.devchkbox.el, objects.nulldfchkbox.el, objects.resdfchkbox.el,
					objects.pvalueslabel.el, objects.parestpvaluechkbox.el, objects.lrtpvaluechkbox.el,
					objects.teststatisticslabel.el, objects.zstatchkbox.el
					]
				})
		};	
		
        
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.depvar.el.content, objects.indvars.el.content, objects.adjvars1.el.content, objects.adjvars2.el.content, objects.adjvars3.el.content, 
					objects.adjvars4.el.content, objects.adjvars5.el.content,objects.stratavar.el.content, objects.wgtvar.el.content, objects.digitslabel.el.content,
					objects.contdigits.el.content, objects.pvaluedigits.el.content, objects.ordigits.el.content],
			bottom: [optionspanel.el.content],
            nav: {
                name: LogisticRegMultiple.t('navigation'),
                icon: "icon-logistic_multiple",
				positionInNav: 13,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: LogisticRegMultiple.t('help.title'),
            r_help: LogisticRegMultiple.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: LogisticRegMultiple.t('help.body')
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
		let statsarray=[code_vars.selected.parestimatechkbox, code_vars.selected.stderrorschkbox, code_vars.selected.confintchkbox, code_vars.selected.likeconfintchkbox,
						code_vars.selected.orchkbox, code_vars.selected.orconfintchkbox, code_vars.selected.likeorconfintchkbox,
						code_vars.selected.nchkbox, code_vars.selected.nmissifanychkbox, 
						code_vars.selected.nmissalwayschkbox, code_vars.selected.concchkbox, code_vars.selected.aicchkbox, 
						code_vars.selected.bicchkbox, code_vars.selected.loglikchkbox, code_vars.selected.nulldevchkbox, code_vars.selected.devchkbox,
						code_vars.selected.nulldfchkbox, code_vars.selected.resdfchkbox,
						code_vars.selected.parestpvaluechkbox, code_vars.selected.lrtpvaluechkbox, code_vars.selected.zstatchkbox]
					
		statsarray=statsarray.filter(elem => Boolean(elem))
		let statsstring=statsarray.join(',')

		//for adjustor variable data frame output
		let set1string=code_vars.selected.adjvars1.substr(14)
		let set1array=set1string.split("+")
		let set1length=set1array.length
		
		let set2string=code_vars.selected.adjvars2.substr(14)
		let set2array=set2string.split("+")
		let set2length=set2array.length
		
		let set3string=code_vars.selected.adjvars3.substr(14)
		let set3array=set3string.split("+")
		let set3length=set3array.length
		
		let set4string=code_vars.selected.adjvars4.substr(14)
		let set4array=set4string.split("+")
		let set4length=set4array.length
		
		let set5string=code_vars.selected.adjvars5.substr(14)
		let set5array=set5string.split("+")
		let set5length=set5array.length

		let maxsetlength=Math.max(set1length, set2length, set3length, set4length, set5length)
		
		set1array.length=maxsetlength
		set2array.length=maxsetlength
		set3array.length=maxsetlength
		set4array.length=maxsetlength
		set5array.length=maxsetlength
		
		let set1stringfinal=set1array.toString().replaceAll(",", "','")
		let set2stringfinal=set2array.toString().replaceAll(",", "','")
		let set3stringfinal=set3array.toString().replaceAll(",", "','")
		let set4stringfinal=set4array.toString().replaceAll(",", "','")
		let set5stringfinal=set5array.toString().replaceAll(",", "','")
		
		set1stringfinal="'"+set1stringfinal+"'"
		set2stringfinal="'"+set2stringfinal+"'"
		set3stringfinal="'"+set3stringfinal+"'"
		set4stringfinal="'"+set4stringfinal+"'"
		set5stringfinal="'"+set5stringfinal+"'"



		//create new variables under code_vars
		code_vars.selected.statslist = statsstring

		code_vars.selected.set1stringfinal = set1stringfinal
		code_vars.selected.set2stringfinal = set2stringfinal
		code_vars.selected.set3stringfinal = set3stringfinal
		code_vars.selected.set4stringfinal = set4stringfinal
		code_vars.selected.set5stringfinal = set5stringfinal
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}


	
}

module.exports = {
    render: () => new LogisticRegMultiple().render()
}
