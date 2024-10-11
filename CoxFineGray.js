


class CoxFineGray extends baseModal {
    static dialogId = 'CoxFineGray'
    static t = baseModal.makeT(CoxFineGray.dialogId)

    constructor() {
        var config = {
            id: CoxFineGray.dialogId,
            label: CoxFineGray.t('title'),
            modalType: "two",
            RCode: `
library(survival)
library(broom)
library(survminer)
library(car)
library(dplyr)

# variables table
vars.table <- data.frame(Event.Var="{{selected.eventvar | safe}}", Event.Code="{{selected.eventcode | safe}}", Time.Var="{{selected.timevar | safe}}", Strata.Vars="{{selected.stratavars | safe}}")
BSkyFormat(vars.table, singleTableOutputHeader="Specified Variables")

# creating finegray (start, stop) dataset with the selected event
fgdat <- finegray(Surv({{selected.timevar | safe}},factor({{selected.eventvar | safe}})) ~ ., data={{dataset.name}}, etype="{{selected.eventcode | safe}}" {{selected.weightvar | safe}})

# model fit
{{selected.modelname | safe}} <- coxph(Surv(fgstart, fgstop, fgstatus) ~ {{selected.modelterms | safe}}{{selected.stratavarslist | safe}}, data=fgdat, weights=fgwt, ties="{{selected.tiemethod | safe}}", na.action=na.exclude)

# computing sample size from a standard fit
data.for.n <- {{dataset.name}} %>% mutate(eventforn=ifelse({{selected.eventvar | safe}}=={{selected.eventcode | safe}},1,0))
cox.for.n <- coxph(Surv({{selected.timevar | safe}}, eventforn) ~ {{selected.modelterms | safe}}{{selected.stratavarslist | safe}}, data=data.for.n)

cox_summary<-t(glance({{selected.modelname | safe}}))
cox_summary[1,1]<-cox.for.n$n
cox_est<-as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE))
cox_hr<-as.data.frame(tidy({{selected.modelname | safe}},exponentiate=TRUE, conf.int=TRUE))

BSkyFormat(cox_summary,singleTableOutputHeader="Cox Model Summary")
BSkyFormat(cox_est,singleTableOutputHeader="Parameter Estimates")
BSkyFormat(cox_hr,singleTableOutputHeader="Hazard Ratios (HR) and 95% Confidence Intervals")

{{if ((options.selected.anovachkbox=="TRUE") & (options.selected.stratavarslist==""))}}
# ANOVA table
anovatable<-Anova({{selected.modelname | safe}},type=2,test.statistic="Wald")
BSkyFormat(as.data.frame(anovatable),singleTableOutputHeader="Analysis of Deviance Wald Tests (Type II)")
{{/if}}

{{if (options.selected.diagnosticsbox=="TRUE")}}
# diagnostics
prophaz<-as.data.frame(cox.zph({{selected.modelname | safe}})$table)
BSkyFormat(prophaz,singleTableOutputHeader="Proportional Hazards Tests")
plot(cox.zph({{selected.modelname | safe}}), hr=TRUE, col=2, lwd=2)
{{/if}}
{{if ((options.selected.diagnosticsbox=="TRUE") & (options.selected.stratavarslist==""))}}
ggcoxfunctional({{selected.modelname | safe}},data=fgdat,ylim=c({{selected.martmin | safe}},1))
{{/if}}
{{if (options.selected.diagnosticsbox=="TRUE")}}
ggcoxdiagnostics({{selected.modelname | safe}})
{{/if}}
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "copy"
                })
            },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: CoxFineGray.t('modelname'),
                    placeholder: "FineGrayCoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "FineGrayCoxRegModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: CoxFineGray.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxFineGray.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			eventcode: {
				el: new inputSpinner(config, {
				no: 'eventcode',
				label: CoxFineGray.t('eventcodelabel'),
				style: "ml-5 mt-3 mb-3",
				min: 1,
				max: 1000000,
				step: 1,
				value: 1,
				extraction: "NoPrefix|UseComma"
				})
			},			
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: CoxFineGray.t('modelterms'),
					required: true
                })
            },
			stratavars: {
				el: new dstVariableList(config,{
				label: CoxFineGray.t('stratavarslabel'),
				no: "stratavars",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
            weightvar: {
                el: new dstVariable(config, {
                    label: CoxFineGray.t('weightvar'),
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
                    label: CoxFineGray.t('tiemethod'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow"],
                    default: "efron"
                })
            }, 
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxFineGray.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
			martmin: {
				el: new input(config, {
				no: 'martmin',
				allow_spaces: true,
				type: "numeric",
				label: CoxFineGray.t('martminlabel'),
				style: "ml-4",
				width: "w-25",
				placeholder: "-1",
				value: "-1",
				extraction: "TextAsIs"
				})
			},
            anovachkbox: {
                el: new checkbox(config, {
                    label: CoxFineGray.t('anovachkboxlabel'),
                    no: "anovachkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            }
        };
		
		
        var options = {
            el: new optionsVar(config, {
                no: "options",
                name: CoxFineGray.t('options'),
                content: [
                    objects.tiemethod.el,
                    objects.diagnosticsbox.el, objects.martmin.el, objects.anovachkbox.el
					]
            })
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content,
                objects.timevar.el.content,
                objects.eventvar.el.content, objects.eventcode.el.content,
                objects.modelterms.el.content, objects.stratavars.el.content,
                objects.weightvar.el.content,
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxFineGray.t('navigation'),
                icon: "icon-cox-finegray",
				positionInNav: 3,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxFineGray.t('help.title'),
            r_help: "help(data,package='utils')",
            body: CoxFineGray.t('help.body')
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

		//creating correct string for strata variables in model call and output dataset
		let stratavars=code_vars.selected.stratavars.toString().replaceAll("+", ") + strata(")
		if (stratavars != "") {
		stratavars="+ strata("+stratavars+")"
		}
	
		//create new variables under code_vars		
		code_vars.selected.stratavarslist = stratavars
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new CoxFineGray().render()
