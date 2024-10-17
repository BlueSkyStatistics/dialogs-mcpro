










class CoxRegMultiple extends baseModal {
    static dialogId = 'CoxRegMultiple'
    static t = baseModal.makeT(CoxRegMultiple.dialogId)

    constructor() {
        var config = {
            id: CoxRegMultiple.dialogId,
            label: CoxRegMultiple.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(arsenal)
library(survival)
library(dplyr)

coxreg.tab <- modelsum(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ {{selected.indvars | safe}}, adjust=list('Unadjusted' = ~1 {{selected.adjvars1 | safe}}{{selected.adjvars2 | safe}}{{selected.adjvars3 | safe}}{{selected.adjvars4 | safe}}{{selected.adjvars5 | safe}}) {{selected.stratavar | safe}} {{selected.wgtvar | safe}}, data={{dataset.name}}, family=survival, survival.stats=c({{selected.statslist | safe}}), show.adjust={{selected.adjvarschkbox | safe}}, digits={{selected.contdigits | safe}}, digits.p={{selected.pvaluedigits | safe}}, digits.ratio={{selected.hrdigits | safe}}, conf.level={{selected.cilevel | safe}})

coxreg.tab.final <- as.data.frame(summary(coxreg.tab, text=TRUE, term.name="term", adjustment.names={{selected.adjnameschkbox | safe}}))

{{if (options.selected.parestpvaluechkbox=="'p.value'")}}
# renaming p-value column so that modelsum p-value formatting is used instead of BlueSky's formatting
coxreg.tab.final <- rename(coxreg.tab.final, "p value"="p.value")
{{/if}}

# adding model number to the final table
outdat <- as.data.frame(coxreg.tab)
modnumlag <- lag(outdat$model)
model <- ifelse(outdat$model!=modnumlag, as.character(outdat$model), "")
model[1] <- "1"
coxreg.tab.final <- bind_cols(model=model, coxreg.tab.final)

{{if (options.selected.stratavar!="")}}
# if strata column making that first
coxreg.tab.final <- relocate(coxreg.tab.final, 2)
{{/if}}

BSkyFormat(coxreg.tab.final, decimalDigitsRounding=-1, singleTableOutputHeader="Cox Regression Models for Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) (CI level={{selected.cilevel | safe}})")

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
			timevar: {
				el: new dstVariable(config, {
				label: CoxRegMultiple.t('timevarlabel'),
				no: "timevar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			eventvar: {
				el: new dstVariable(config, {
				label: CoxRegMultiple.t('eventvarlabel'),
				no: "eventvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},						
			indvars: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('indvarslabel'),
				no: "indvars",
				required: true,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},
			adjvars1: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('adjvars1label'),
				no: "adjvars1",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 1' = ~ %val%"
				})
			},
			adjvars2: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('adjvars2label'),
				no: "adjvars2",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 2' = ~ %val%"
				})
			},
			adjvars3: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('adjvars3label'),
				no: "adjvars3",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 3' = ~ %val%"
				})
			},
			adjvars4: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('adjvars4label'),
				no: "adjvars4",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 4' = ~ %val%"
				})
			},
			adjvars5: {
				el: new dstVariableList(config,{
				label: CoxRegMultiple.t('adjvars5label'),
				no: "adjvars5",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 5' = ~ %val%"
				})
			},			
			stratavar: {
				el: new dstVariable(config, {
				label: CoxRegMultiple.t('stratavarlabel'),
				no: "stratavar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", strata=%val%",
				required: false,
				})
			},
			wgtvar: {
				el: new dstVariable(config, {
				label: CoxRegMultiple.t('wgtvarlabel'),
				no: "wgtvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", weights=%val%",
				required: false
				})
			},
			digitslabel: {
				el: new labelVar(config, {
				label: CoxRegMultiple.t('digitslabel'), 
				h:5,
				style: "mt-4"
				})
			},
			contdigits: {
				el: new inputSpinner(config, {
				  no: 'contdigits',
				  label: CoxRegMultiple.t('contdigitslabel'),
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
				  label: CoxRegMultiple.t('pvaluedigitslabel'),
				  min: 1,
				  max: 1000,
				  step: 1,
				  value: 4,
				  style: "ml-3",
				  extraction: "NoPrefix|UseComma"
				})
			},
			hrdigits: {
				el: new inputSpinner(config, {
				  no: 'hrdigits',
				  label: CoxRegMultiple.t('hrdigitslabel'),
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
				label: CoxRegMultiple.t('parestorlabel'), 
				h:5
				})
			},
			parestimatechkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('parestchkboxlabel'),
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
				label: CoxRegMultiple.t('stderrorschkboxlabel'),
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
				label: CoxRegMultiple.t('confintchkboxlabel'),
				no: "confintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.estimate'",
				false_value: ""
				})
			},
			hrchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('hrchkboxlabel'),
				no: "hrchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'HR'",
				false_value: ""
				})
			},
			hrconfintchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('hrconfintchkboxlabel'),
				no: "hrconfintchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'CI.HR'",
				false_value: ""
				})
			},			
			cilevel: {
				el: new inputSpinner(config, {
				  no: 'cilevel',
				  label: CoxRegMultiple.t('cilevellabel'),
				  min: 0,
				  max: 100,
				  step: .001,
				  value: .95,
				  extraction: "NoPrefix|UseComma"
				})
			},
			adjvarschkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('adjvarschkboxlabel'),
				no: "adjvarschkbox",
				state: "checked",
				extraction: "Boolean"
				})
			},
			adjnameschkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('adjnameschkboxlabel'),
				no: "adjnameschkbox",
				extraction: "Boolean"
				})
			},			
			samplesizelabel: {
				el: new labelVar(config, {
				label: CoxRegMultiple.t('samplesizelabel'), 
				h:5,
				style: "mt-4",
				})
			},
			nchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('samplesizelabel'),
				no: "nchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},
			nmissifanychkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('nmissifanychkboxlabel'),
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
				label: CoxRegMultiple.t('nmissalwayschkboxlabel'),
				no: "nmissalwayschkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},
			neventschkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('neventschkboxlabel'),
				no: "neventschkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'Nevents'",
				false_value: ""
				})
			},			
			fitstatisticslabel: {
				el: new labelVar(config, {
				label: CoxRegMultiple.t('fitstatisticslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			concchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('concchkboxlabel'),
				no: "concchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'concordance'",
				false_value: ""
				})
			},
			concstderrchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('concstderrchkboxlabel'),
				no: "concstderrchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'std.error.concordance'",
				false_value: ""
				})
			},
			rsqchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('rsqchkboxlabel'),
				no: "rsqchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'r.squared'",
				false_value: ""
				})
			},
			rsqmaxchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('rsqmaxchkboxlabel'),
				no: "rsqmaxchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'r.squared.max'",
				false_value: ""
				})
			},			
			aicchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('aicchkboxlabel'),
				no: "aicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'AIC'",
				false_value: ""
				})
			},
			bicchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('bicchkboxlabel'),
				no: "bicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'BIC'",
				false_value: ""
				})
			},
			loglikchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('loglikchkboxlabel'),
				no: "loglikchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'logLik'",
				false_value: ""
				})
			},			
			pvalueslabel: {
				el: new labelVar(config, {
				label: CoxRegMultiple.t('pvalueslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			parestpvaluechkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('parestpvaluechkboxlabel'),
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
				label: CoxRegMultiple.t('lrtpvaluechkboxlabel'),
				no: "lrtpvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.lrt'",
				false_value: ""
				})
			},
			modscorepvaluechkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modscorepvaluechkboxlabel'),
				no: "modscorepvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.sc'",
				false_value: ""
				})
			},			
			modlrtpvaluechkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modlrtpvaluechkboxlabel'),
				no: "modlrtpvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.log'",
				false_value: ""
				})
			},			
			modwaldpvaluechkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modwaldpvaluechkboxlabel'),
				no: "modwaldpvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.wald'",
				false_value: ""
				})
			},		
			teststatisticslabel: {
				el: new labelVar(config, {
				label: CoxRegMultiple.t('teststatisticslabel'), 
				h:5,
				style: "mt-4",
				})
			},
			zstatchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('zstatchkboxlabel'),
				no: "zstatchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'statistic'",
				false_value: ""
				})
			},
			modscorestatchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modscorestatchkboxlabel'),
				no: "modscorestatchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'statistic.sc'",
				false_value: ""
				})
			},
			modlrtstatchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modlrtstatchkboxlabel'),
				no: "modlrtstatchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'statistic.log'",
				false_value: ""
				})
			},
			modwaldstatchkbox: {
				el: new checkbox(config, {
				label: CoxRegMultiple.t('modwaldstatchkboxlabel'),
				no: "modwaldstatchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'statistic.wald'",
				false_value: ""
				})
			}			
		}
		
		var optionspanel = {
            el: new optionsVar(config, {
                no: "optionspanel",
                name: "Options",
                content: [
                    objects.parestorlabel.el, objects.parestimatechkbox.el, objects.stderrorschkbox.el, objects.confintchkbox.el, 
					objects.hrchkbox.el, objects.hrconfintchkbox.el, objects.adjvarschkbox.el, objects.adjnameschkbox.el, 
					objects.cilevel.el,
					objects.samplesizelabel.el, objects.nchkbox.el, objects.nmissifanychkbox.el, objects.nmissalwayschkbox.el, objects.neventschkbox.el,
					objects.fitstatisticslabel.el, objects.concchkbox.el, objects.concstderrchkbox.el, objects.rsqchkbox.el, objects.rsqmaxchkbox.el, objects.aicchkbox.el, 
					objects.bicchkbox.el, objects.loglikchkbox.el,
					objects.pvalueslabel.el, objects.parestpvaluechkbox.el, objects.lrtpvaluechkbox.el, objects.modscorepvaluechkbox.el, objects.modlrtpvaluechkbox.el,
					objects.modwaldpvaluechkbox.el,
					objects.teststatisticslabel.el, objects.zstatchkbox.el, objects.modscorestatchkbox.el, objects.modlrtstatchkbox.el, objects.modwaldstatchkbox.el
					]
				})
		};	
		
        
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.timevar.el.content, objects.eventvar.el.content, objects.indvars.el.content, objects.adjvars1.el.content, objects.adjvars2.el.content, objects.adjvars3.el.content, 
					objects.adjvars4.el.content, objects.adjvars5.el.content,objects.stratavar.el.content, objects.wgtvar.el.content, objects.digitslabel.el.content,
					objects.contdigits.el.content, objects.pvaluedigits.el.content, objects.hrdigits.el.content],
			bottom: [optionspanel.el.content],
            nav: {
                name: CoxRegMultiple.t('navigation'),
                icon: "icon-survival-multiplemodels",
				positionInNav: 4,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: CoxRegMultiple.t('help.title'),
            r_help: "help(data,package='utils')",
            body: CoxRegMultiple.t('help.body')
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
		let statsarray=[code_vars.selected.parestimatechkbox, code_vars.selected.stderrorschkbox, code_vars.selected.confintchkbox,
						code_vars.selected.hrchkbox, code_vars.selected.hrconfintchkbox,
						code_vars.selected.nchkbox, code_vars.selected.nmissifanychkbox, 
						code_vars.selected.nmissalwayschkbox, code_vars.selected.neventschkbox, code_vars.selected.concchkbox, code_vars.selected.concstderrchkbox, 
						code_vars.selected.rsqchkbox, code_vars.selected.rsqmaxchkbox, code_vars.selected.aicchkbox, 
						code_vars.selected.bicchkbox, code_vars.selected.loglikchkbox,
						code_vars.selected.parestpvaluechkbox, code_vars.selected.lrtpvaluechkbox, code_vars.selected.modscorepvaluechkbox, code_vars.selected.modlrtpvaluechkbox, 
						code_vars.selected.modwaldpvaluechkbox, code_vars.selected.zstatchkbox, code_vars.selected.modscorestatchkbox, code_vars.selected.modlrtstatchkbox,
						code_vars.selected.modwaldstatchkbox]
					
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
            res.push({ cmd: temp, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}


	
}

module.exports = {
    render: () => new CoxRegMultiple().render()
}
