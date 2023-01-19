
var localization = {
    en: {
        title: "Cox, binary time-dependent covariates",
        navigation: "Cox, binary time-dependent covariates",
        modelname:"Enter model name",
        timevar: "Time to event or censor",
        eventvar: "Events (1 = event 1, 0 = censor)",
        modelterms:"Model expression builder for independent variables",
		switchtimeslabel: "Exposure time variables for time-dependent covariates",
		tdprefixlabel: "Prefix for time-dependent covariates",
		subjectidlabel: "Subject identifier",
        weightvar: "Weights (optional)",
        tiemethod: "Tied Time Method",
        forestplotbox : "Forest Plot",
        diagnosticsbox: "Model Diagnostics",
        martscalebox:"Null Model Martingale Residual Axis Minimum Value (-Inf to 1):",
        devbox:"Analysis of Deviance (Type II)",
        devtype:"Test Statistic",
		startstopboxlabel: "Show (start, stop) time dataset",
		startstopnamelabel: "Dataset name",
        help: {
            title: "Cox, binary time-dependent covariates",
            r_help: "help(coxph, package = 'survival')",
            body: `
Fits a Cox proportional hazards model for time-to-event data with censored observations that includes one or more binary time-dependent "exposure" covariates.  This type of 
covariate is one where the occurrence of a "yes" can happen after the start of follow-up and once that "yes" occurs it stays a "yes" for the follow-up duration.  An example 
would be rejection of a graft post-transplant (i.e. before the rejection occurs, the patient has not been "exposed"; after rejection occurs, the patient has been "exposed").  
Treating such a covariate as being known at the start of follow-up is a form of looking into the future and leads to biased estimates (also known as "immortal time bias").
<br/><br/>
Model fitting statistics, parameter estimates, and hazard ratios are provided.  Options available include the tied time method, forest plots, model diagnostics, and the ability 
to view the underlying counting process data set that gets created.  A table describing the counting process data is provided as a check that this data is being created 
appropriately.
<br/><br/>  
Counting process data summaries:
<br/>
<b>early:</b> time when the predictor changes before follow-up time starts<br/>
<b>late:</b> time when the predictor changes after follow-up ends<br/>
<b>within:</b> time when the predictor changes inside the follow-up period<br/>
<b>leading:</b> time when the predictor changes at the beginning of follow-up<br/>
<b>trailing:</b> time when the predictor changes at the end of follow-up<br/>
<b>boundary:</b> time when the predictor changes either at the beginning or ending of follow-up
<br/><br/>
For more information about this table, see the time-dependent covariate vignette at <a href="https://cran.r-project.org/package=survival">https://cran.r-project.org/package=survival</a>.  
<br/><br/>
The model is fit using the coxph function in the survival package.
<br/><br/>
<b>Enter model name:</b> Name where the model results will be stored
<br/><br/>
<b>Time to event or censor:</b> Time to outcome event for those experiencing the event or time to last follow-up for those not experiencing the outcome event
<br/><br/>
<b>Events (1=event, 0=censor):</b> Numerical event indicator; 1=event, 0=censor
<br/><br/>
<b>Formula Builder:</b> Construct terms to include in the model.  Factors, strings, and logical variables will be dummy coded.  The provided buttons allow you to specify main 
effects, full factorial effects (main effects and all interactions with the involved variables), polynomials, specific interactions, and delete terms from the list.
<br/><br/>
<b>Exposure time variables for time-dependent covariates:</b> Numeric variables storing the time when the subject was first "exposed".  This must be on the same time scale as 
the Time variable. Missing values should be used for subjects who were never exposed.  Each variable specified here will create a separate time-dependent covariate.  A specified 
time assumes that a subject is not exposed prior to this time and exposed after this time (i.e. when the predictor change from "no" to "yes").  Specifying only positive values means 
that subjects are not exposed for some time after follow-up starts.  Specifying some positive and negative times indicates that some subjects were exposed after and some before 
follow-up time starts, respectively. If you know that a subject was exposed prior to the follow-up start time, but you don't know exactly when, then you can use any negative time 
and the model will correctly treat that subject as being exposed for their entire follow-up time. If subjects are exposed after follow-up, then they are correctly treated as not
being exposed for their entire follow-up time.
<br/><br/>
<b>Prefix for time-dependent covariates:</b> Desired prefix to be used for every time-dependent covariate specified in the <b>Exposure time variables</b> field.  The name of
each time-dependent covariate will start with this prefix.
<br/><br/>
<b>Subject identifier:</b> The variable storing the subject identifier.  This is required for purposes of creating the underlying counting process data set.
<br/><br/>
<b>Weights:</b> Numeric variable for observation weights. Useful in situations where each record should not be counted as one observation. 
<br/><br/>
<b>Options:</b>
<br/><br/>
<b>Tied Time Method:</b> Method of breaking tied observed times.  Efron is usually the better choice when there aren't many tied times.  The exact method can be beneficial if 
there are many tied times, as in discrete time situations, but can take a little longer for the model to be fit.
<br/><br/>
<b>Forest Plot:</b> will create a forest plot of hazard ratios and confidence intervals
<br/><br/>
<b>Show (start, stop) Data Set:</b> Will show the underlying counting process data set used in the computations. This breaks each subject's follow-up time into parts, depending 
on when the time-dependent covariate should change values.
<br/><br/>
<b>Model Diagnostics:</b> If selected, proportional hazards tests and plots will be provided, in addition to assessments of functional form for each covariate in the model.  
The null model Martingale residual axis minimum value option might need to be changed so that all residuals appear in the plot. To get functional form assessments, you must 
specify only numeric predictors and have no missing data. See Variables > Missing Values > Remove NAs.
<br/><br/>
<b>Analysis of Deviance (Type II):</b> Global test of each predictor in the model.  Multi-degree of freedom tests will be provided for effects with more than 2 levels.  
Wald and Likelihood ratio tests can be obtained, with likelihood ratio tests having better small sample properties.           
<br/><br/>
<b>Required packages:</b> survival, broom, survminer, car
`}
    }
}

class CoxTimeDependent extends baseModal {
    constructor() {
        var config = {
            id: "CoxTimeDependent",
            label: localization.en.title,
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
                    label: localization.en.modelname,
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1"
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
					required: false
                })
            },
			switchtimes: {
				el: new dstVariableList(config,{
				label: localization.en.switchtimeslabel,
				no: "switchtimes",
				required: true,
				filter:"Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				})
			},
            tdprefix: {
                el: new input(config, {
                    no: 'tdprefix',
                    label: localization.en.tdprefixlabel,
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
                    label: localization.en.subjectidlabel,
                    no: "subjectid",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
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
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            forestplotbox: {
                el: new checkbox(config, {
                    label: localization.en.forestplotbox,
                    no: "forestplotbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
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
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: localization.en.martscalebox,
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
                    label: localization.en.devbox,
                    no: "devbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            devtype: {
                el: new comboBox(config, {
                    no: 'devtype',
                    label: localization.en.devtype,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Wald", "LR"],
                    default: "Wald",
                    style:"mt-3"
                })
            },             
            startstopbox: {
                el: new checkbox(config, {
                    label: localization.en.startstopboxlabel,
                    no: "startstopbox",
                    extraction: "Boolean",
                    style:"mt-3"
                })
            },
            startstopname: {
                el: new input(config, {
                    no: 'startstopname',
                    label: localization.en.startstopnamelabel,
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
                name: localization.en.options,
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
                name: localization.en.navigation,
                icon: "icon-cox-timedependent",
				positionInNav: 2,
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
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
	
}
module.exports.item = new CoxTimeDependent().render()