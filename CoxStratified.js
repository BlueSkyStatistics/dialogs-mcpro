/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class CoxStratified extends baseModal {
    static dialogId = 'CoxStratified'
    static t = baseModal.makeT(CoxStratified.dialogId)

    constructor() {
        var config = {
            id: CoxStratified.dialogId,
            label: CoxStratified.t('title'),
            modalType: "two",
            RCode: `
require(survival)
require(broom)
require(survminer)

{{selected.modelname | safe}}<-coxph(Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}} + {{selected.stratavarslist | safe}}, data={{dataset.name}}, ties="{{selected.tiemethod | safe}}", {{selected.weightvar | safe}} na.action=na.exclude)
cox_summary<-t(glance({{selected.modelname | safe}}))
cox_est<-as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE))
cox_hr<-as.data.frame(tidy({{selected.modelname | safe}},exponentiate=TRUE, conf.int=TRUE))

BSkyFormat(data.frame(strata=c({{selected.stratavarsdatalist | safe}})),singleTableOutputHeader="Stratification Variables")            
BSkyFormat(cox_summary,singleTableOutputHeader="Cox Model Summary for Surv({{selected.timevar | safe}},{{selected.eventvar | safe}})")
BSkyFormat(cox_est,singleTableOutputHeader="Parameter Estimates")
BSkyFormat(cox_hr,singleTableOutputHeader="Hazard Ratios (HR) and 95% Confidence Intervals")

{{if (options.selected.diagnosticsbox=="TRUE")}}
# diagnostics
prophaz<-as.data.frame(cox.zph({{selected.modelname | safe}})$table)
BSkyFormat(prophaz,singleTableOutputHeader="Proportional Hazards Tests")
plot(cox.zph({{selected.modelname | safe}}), hr=TRUE, col=2, lwd=2)
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
                    label: CoxStratified.t('modelname'),
                    placeholder: "StratifiedCoxModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "StratifiedCoxModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: CoxStratified.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxStratified.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: CoxStratified.t('modelterms'),
					required: true
                })
            },
			stratavars: {
				el: new dstVariableList(config,{
				label: CoxStratified.t('stratavarslabel'),
				no: "stratavars",
				required: true,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
            weightvar: {
                el: new dstVariable(config, {
                    label: CoxStratified.t('weightvar'),
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
					wrapped: "weights=%val%,"
                }), r: ['{{ var | safe}}']
            },                       
            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: CoxStratified.t('tiemethod'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxStratified.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            }
        };
		
		
        var options = {
            el: new optionsVar(config, {
                no: "options",
                /*name: CoxStratified.t('options'),*/
                content: [
                    objects.tiemethod.el,
                    objects.diagnosticsbox.el
					]
            })
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content,
                objects.timevar.el.content,
                objects.eventvar.el.content, 
                objects.modelterms.el.content, objects.stratavars.el.content,
                objects.weightvar.el.content,
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxStratified.t('navigation'),
                icon: "icon-survival-stratified",
				positionInNav: 5,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxStratified.t('help.title'),
            r_help: CoxStratified.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: CoxStratified.t('help.body')
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
		stratavars="strata("+stratavars+")"

		let stratavarsdata=code_vars.selected.stratavars.toString().replaceAll("+", "','")
		stratavarsdata="'"+stratavarsdata+"'"
	
	
		//create new variables under code_vars		
		code_vars.selected.stratavarslist = stratavars
		code_vars.selected.stratavarsdatalist = stratavarsdata
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}		
	
	
}

module.exports = {
    render: () => new CoxStratified().render()
}
