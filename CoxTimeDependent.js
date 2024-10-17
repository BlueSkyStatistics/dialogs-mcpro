


class CoxTimeDependent extends baseModal {
    static dialogId = 'CoxTimeDependent'
    static t = baseModal.makeT(CoxTimeDependent.dialogId)

    constructor() {
        var config = {
            id: CoxTimeDependent.dialogId,
            label: CoxTimeDependent.t('title'),
            modalType: "two",
            RCode: `
library(survival)
library(broom)
library(survminer)
library(car)

# splitting the follow-up times
{{selected.startstopname | safe}} <- tmerge({{dataset.name}}, {{dataset.name}}, id={{selected.subjectid | safe}}, {{selected.eventvar | safe}}=event({{selected.timevar | safe}}, {{selected.eventvar | safe}}), {{selected.tdclist | safe}})

# checking time splits
BSkyFormat(attr({{selected.startstopname | safe}}, "tcount"), singleTableOutputHeader="Data Split Summary")

# (start, stop) data set option
BSkyLoadRefresh("{{selected.startstopname | safe}}", load.dataframe={{selected.startstopbox | safe}})

# model fit and output
{{selected.modelname | safe}} <- coxph(Surv(tstart, tstop, {{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}} + {{selected.tdcmodelterms | safe}}, data={{selected.startstopname | safe}}, ties="{{selected.tiemethod | safe}}" {{selected.weightvar | safe}}, na.action=na.exclude)

cox_summary<-t(glance({{selected.modelname | safe}}))
cox_est<-as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE))
cox_hr<-as.data.frame(tidy({{selected.modelname | safe}}, exponentiate=TRUE, conf.int=TRUE))

BSkyFormat(cox_summary,singleTableOutputHeader="Cox Model Summary for Surv(tstart, tstop, {{selected.eventvar | safe}})")
BSkyFormat(cox_est,singleTableOutputHeader="Parameter Estimates")
BSkyFormat(cox_hr,singleTableOutputHeader="Hazard Ratios (HR) and 95% Confidence Intervals")

{{if (options.selected.devbox=="TRUE")}}
# analysis of deviance option
anovatable<-Anova({{selected.modelname | safe}}, type=2, test.statistic="{{selected.devtype | safe}}")
BSkyFormat(as.data.frame(anovatable),singleTableOutputHeader="Analysis of Deviance (Type II)")
{{/if}}

{{if (options.selected.diagnosticsbox=="TRUE")}}
# diagnostics option
prophaz<-as.data.frame(cox.zph({{selected.modelname | safe}})$table)
BSkyFormat(prophaz,singleTableOutputHeader="Proportional Hazards Tests")
plot(cox.zph({{selected.modelname | safe}}), hr=TRUE, col=2, lwd=2)
ggcoxfunctional({{selected.modelname | safe}},data={{selected.startstopname | safe}},ylim=c({{selected.martscalebox | safe}},1))
ggcoxdiagnostics({{selected.modelname | safe}})
{{/if}}

{{if (options.selected.forestplotbox=="TRUE")}}
# forest plot option
ggforest({{selected.modelname | safe}},data={{selected.startstopname | safe}})
{{/if}}
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move", scroll: true
                })
            },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: CoxTimeDependent.t('modelname'),
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: CoxTimeDependent.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxTimeDependent.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: CoxTimeDependent.t('modelterms'),
					required: false
                })
            },
			switchtimes: {
				el: new dstVariableList(config,{
				label: CoxTimeDependent.t('switchtimeslabel'),
				no: "switchtimes",
				required: true,
				filter:"Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				})
			},
            tdprefix: {
                el: new input(config, {
                    no: 'tdprefix',
                    label: CoxTimeDependent.t('tdprefixlabel'),
					style: "ml-5 mb-3",
					width: "w-50",
                    placeholder: "tdbin_",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "tdbin_"
                })
            }, 
            subjectid: {
                el: new dstVariable(config, {
                    label: CoxTimeDependent.t('subjectidlabel'),
                    no: "subjectid",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },  			
            weightvar: {
                el: new dstVariable(config, {
                    label: CoxTimeDependent.t('weightvar'),
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
					wrapped: ", weights=%val%"
                }), r: ['{{ var | safe}}']
            },                       
            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: CoxTimeDependent.t('tiemethod'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            forestplotbox: {
                el: new checkbox(config, {
                    label: CoxTimeDependent.t('forestplotbox'),
                    no: "forestplotbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxTimeDependent.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: CoxTimeDependent.t('martscalebox'),
                    placeholder: "-1",
                    ml: 4,
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "-1",
                    allow_spaces:true,
                    Type: "numeric"
                })
            }, 
            devbox: {
                el: new checkbox(config, {
                    label: CoxTimeDependent.t('devbox'),
                    no: "devbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            devtype: {
                el: new comboBox(config, {
                    no: 'devtype',
                    label: CoxTimeDependent.t('devtype'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Wald", "LR"],
                    default: "Wald",
                    style:"mt-3"
                })
            },             
            startstopbox: {
                el: new checkbox(config, {
                    label: CoxTimeDependent.t('startstopboxlabel'),
                    no: "startstopbox",
                    extraction: "Boolean",
                    style:"mt-3"
                })
            },
            startstopname: {
                el: new input(config, {
                    no: 'startstopname',
                    label: CoxTimeDependent.t('startstopnamelabel'),
					style: "ml-4",
					width: "w-50",
                    placeholder: "sdata",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "sdata"
                })
            } 			
        }
        var options = {
            el: new optionsVar(config, {
                no: "options",
                name: CoxTimeDependent.t('options'),
                content: [
                    objects.tiemethod.el,
                    objects.forestplotbox.el, 
                    objects.diagnosticsbox.el,
                    objects.martscalebox.el,
                    objects.devbox.el,
                    objects.devtype.el,
					objects.startstopbox.el, objects.startstopname.el
                ]
            })
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content,
                objects.timevar.el.content,
                objects.eventvar.el.content, 
                objects.modelterms.el.content, objects.switchtimes.el.content, objects.tdprefix.el.content,
                objects.subjectid.el.content, objects.weightvar.el.content
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxTimeDependent.t('navigation'),
                icon: "icon-cox-timedependent",
				positionInNav: 2,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxTimeDependent.t('help.title'),
            r_help: "help(data,package='utils')",
            body: CoxTimeDependent.t('help.body')
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
		
		//for tmerge call to create the time-dependent covariates
		let pretext=code_vars.selected.tdprefix.toString()
		let varlistarray=code_vars.selected.switchtimes.toString().split(',')
		varlistarray.forEach((elem, i, theArray) => {theArray[i] = pretext + elem + "=tdc(" + elem + ")"})
		let varliststring=varlistarray.join(", ")
		
		//for model fit call
		let timesarray=code_vars.selected.switchtimes.toString().split(',')
		timesarray.forEach((elem, i, theArray) => {theArray[i] = pretext + elem})
		let varlistmodelstring=timesarray.join(" + ")		
	
		//create new variables under code_vars
		code_vars.selected.tdclist = varliststring
		code_vars.selected.tdcmodelterms = varlistmodelstring
				
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: temp, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}		
	
	
	
}

module.exports = {
    render: () => new CoxTimeDependent().render()
}
