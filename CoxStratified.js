
var localization = {
    en: {
        title: "Cox, Stratified",
        navigation: "Cox, Stratified",
        modelname:"Enter model name",
        timevar: "Time to event or censor",
        eventvar: "Events (1 = event 1, 0 = censor)",
        modelterms:"Model expression builder for independent variables",
		stratavarslabel: "Stratification Variables",
        weightvar: "Weights (optional)",
        tiemethod: "Tied Time Method",
        diagnosticsbox: "Model Diagnostics",
        help: {
            title: "Cox, Stratified",
            r_help: "help(coxph, package = 'survival')",
            body: `
            Fits a stratified Cox proportional hazards model for time-to-event data with censored observations. This is a Cox model that allows a separate baseline hazard 
			function for each strata level.  Model fitting statistics, parameter estimates, and hazard ratios are provided.  Options available include the tied time method 
			and model diagnostics.  The model is fit using the coxph function in the survival package. 
            <br/>
            <br/>
            <b>Time to event or censor:</b> Time to event for those experiencing the event or time to last follow-up for those not experiencing the event
            <br/><br/>
            <b>Events (1=event, 0=censor):</b> Numerical event indicator; 1=event, 0=censor
            <br/><br/>
            <b>Formula Builder:</b> Construct terms to include in the model.  Factors, strings, and logical variables will be dummy coded.  The provided buttons allow you to 
			specify main effects, full factorial effects (main effects and all interactions with the involved variables), polynomials, specific interactions, and delete terms 
			from the list.  Interactions with stratification variables is allowed.
            <br/><br/>
			<b>Stratification Variables:</b> Specify one or more stratification variables.  These can be numeric, factor, ordered factor, or character variables.  The strata 
			divide the subjects into separate groups whereby each group has a distinct baseline hazard function.  If multiple stratification variables are given, a separate 
			baseline hazard function is used for every combination of stratification variable levels.
			<br/><br/>
            <b>Weights:</b> Numeric variable for observation weights. Useful in situations where each record should not be counted as one observation. 
            <br/>
            <br/>
            <b>Required packages:</b> survival, broom, survminer
            <br/>
            <br/>
            Click the R Help button to get detailed R help about the coxph function.
            <br/>
            <br/>
            <br/>
            <br/>
            <b>Options</b>
            <br/>
            <br/>
            <b>Tied Time Method:</b>
            <br/>
            Method of breaking tied observed times.  Efron is usually the better choice when there aren't many tied times.  The exact method can be beneficial if there are many tied times, as in discrete time situations, but can take a little longer for the model to be fit. 
            <br/>
            <br/>
            <b>Model Diagnostics:</b>
            <br/>
            If selected, proportional hazards tests and plots will be provided, in addition to a Martingale residual plot.
`}
    }
}

class CoxStratified extends baseModal {
    constructor() {
        var config = {
            id: "CoxStratified",
            label: localization.en.title,
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
                    label: localization.en.modelname,
                    placeholder: "StratifiedCoxModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "StratifiedCoxModel1"
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
				required: true,
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
					wrapped: "weights=%val%,"
                }), r: ['{{ var | safe}}']
            },                       
            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: localization.en.tiemethod,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
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
            }
        };
		
		
        var options = {
            el: new optionsVar(config, {
                no: "options",
                /*name: localization.en.options,*/
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
                name: localization.en.navigation,
                icon: "icon-survival-stratified",
				positionInNav: 5,
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
		stratavars="strata("+stratavars+")"

		let stratavarsdata=code_vars.selected.stratavars.toString().replaceAll("+", "','")
		stratavarsdata="'"+stratavarsdata+"'"
	
	
		//create new variables under code_vars		
		code_vars.selected.stratavarslist = stratavars
		code_vars.selected.stratavarsdatalist = stratavarsdata
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new CoxStratified().render()