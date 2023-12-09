
var localization = {
    en: {
        title: "Cox, Fine-Gray",
        navigation: "Cox, Fine-Gray",
        modelname:"Enter model name",
        timevar: "Time to event or censor",
        eventvar: "Events (0 = censor, 1 = event 1, 2 = event 2, ...)",
		eventcodelabel: "Event Code",
        modelterms:"Model expression builder for independent variables",
		stratavarslabel: "Stratification Variables (optional)",
        weightvar: "Weights (optional)",
        tiemethod: "Tied Time Method",
        diagnosticsbox: "Model Diagnostics",
		martminlabel: "Null Model Martingale Residual Axis Minimum Value (-Inf to 1)",
		anovachkboxlabel: "Analysis of Deviance (Type II)",
        help: {
            title: "Cox, Fine-Gray",
            r_help: "help(coxph, package = 'survival')",
            body: `
Fits a Fine-Gray Cox proportional hazards model for time-to-event data with censored observations when competing risks are present.  Fine-Gray models model the effect of 
covariates on the cumulative incidence function.  An alternative is to model the effect of covariates on the cause-specific hazard, for which standard Cox regression models 
can be used.  An introduction to the topic of competing risks can be found in "Introduction to the Analysis of Survival Data in the Presence of Competing Risks" by Peter Austin, 
et. al., Circulation, 2016; 133:601-609. 
<br/><br/>
Model fitting statistics, parameter estimates, and hazard ratios are provided.  Options available include the tied time method and model diagnostics.  The model is fit using the 
finegray and coxph functions in the survival package.
<br/><br/>
<b>Enter model name:</b> Specify the name of the model where the results will be stored.
<br/><br/>
<b>Time to event or censor:</b> Time to the first event for those experiencing an event or time to last follow-up for those not experiencing any event
<br/><br/>
<b>Events (0 = censor, 1 = event 1, 2 = event 2, ...):</b> Numerical event indicator; 0=censor, 1=event 1, 2=event 2, etc.
<br/><br/>
<b>Event Code:</b> Select the event of interest you want to model.  Can either be selected or typed in.
<br/><br/>
<b>Formula Builder:</b> Construct terms to include in the model.  Factors, strings, and logical variables will be dummy coded.  The provided buttons allow you to specify main 
effects, full factorial effects (main effects and all interactions with the involved variables), polynomials, specific interactions, and delete terms from the list.  Interactions 
with stratification variables is allowed.
<br/><br/>
<b>Stratification Variables:</b> Specify one or more stratification variables.  These can be numeric, factor, ordered factor, or character variables.  The strata divide the 
subjects into separate groups whereby each group has a distinct baseline hazard function.  If multiple stratification variables are given, a separate baseline hazard function is 
used for every combination of stratification variable levels.
<br/><br/>
<b>Weights:</b> Numeric variable for observation weights. Useful in situations where each record should not be counted as one observation. 
<br/><br/>
<b>Tied Time Method:</b> Method of breaking tied observed times.  Efron is usually the better choice when there aren't many tied times.
<br/><br/>
<b>Model Diagnostics:</b> If selected, an assessment of proportional hazards and functional form of covariates will be assessed, including relevant plots. 
If there are stratification variables or non-numeric predictors, functional form plots will not be produced. 
The <b>Null Model Martingale Residual Axis Minimum Value</b> might need to be changed in order to see all Martingale residuals.
<br/><br/>
<b>Analysis of Deviance (Type II):</b> If selected, whole variable tests (including multi-degree of freedom tests for multi-category covariates) will be provided.  Wald tests 
are used.
<br/><br/>
<b>Required R packages:</b> survival, broom, survminer, car, dplyr
<br/><br/>
Click the R Help button to get detailed R help about the coxph function.  Go to Help-> R Function Help to get more information about the finegray function, which creates the 
needed dataset.
`}
    }
}

class CoxFineGray extends baseModal {
    constructor() {
        var config = {
            id: "CoxFineGray",
            label: localization.en.title,
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
                    label: localization.en.modelname,
                    placeholder: "FineGrayCoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "FineGrayCoxRegModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: localization.en.timevar,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvar,
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			eventcode: {
				el: new inputSpinner(config, {
				no: 'eventcode',
				label: localization.en.eventcodelabel,
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
                    label: localization.en.modelterms,
					required: true
                })
            },
			stratavars: {
				el: new dstVariableList(config,{
				label: localization.en.stratavarslabel,
				no: "stratavars",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
            weightvar: {
                el: new dstVariable(config, {
                    label: localization.en.weightvar,
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
                    label: localization.en.tiemethod,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow"],
                    default: "efron"
                })
            }, 
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: localization.en.diagnosticsbox,
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
				label: localization.en.martminlabel,
				style: "ml-4",
				width: "w-25",
				placeholder: "-1",
				value: "-1",
				extraction: "TextAsIs"
				})
			},
            anovachkbox: {
                el: new checkbox(config, {
                    label: localization.en.anovachkboxlabel,
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
                name: localization.en.options,
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
                name: localization.en.navigation,
                icon: "icon-cox-finegray",
				positionInNav: 3,
                modal: config.id
            }
        }
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
