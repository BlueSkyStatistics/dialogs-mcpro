
var localization = {
    en: {
        title: "Logistic Regression, multiple models",
        navigation: "Logistic Regression, multiple models",
        depvarlabel: "Dependent Variable",
		indvarslabel: "Independent Variables",
		adjvars1label: "Adjustment Variables, Set 1",
		adjvars2label: "Adjustment Variables, Set 2",
		adjvars3label: "Adjustment Variables, Set 3",
		adjvars4label: "Adjustment Variables, Set 4",
		adjvars5label: "Adjustment Variables, Set 5",		
		stratavarlabel: "Strata",
		wgtvarlabel: "Weights",
		digitslabel: "Digits After Decimal",
		contdigitslabel: "Continuous Values",
		pvaluedigitslabel: "P-Values",
		ordigitslabel: "Odds Ratios",
		parestorlabel: "Parameter Estimates and Odds Ratios",
		parestchkboxlabel: "Parameter Estimates",
		stderrorschkboxlabel: "Standard Errors",
		confintchkboxlabel: "Parameter Wald Confidence Intervals",
		likeconfintchkboxlabel: "Parameter Profile Likelihood Confidence Intervals",
		orchkboxlabel: "Odds Ratios",
		orconfintchkboxlabel: "Odds Ratios Wald Confidence Intervals",
		likeorconfintchkboxlabel: "Odds Ratios Profile Likelihood Confidence Intervals",
		cilevellabel: "Confidence Interval Level",
		interceptchkboxlabel: "Intercepts",
		adjvarschkboxlabel: "Adjustment Variables",
		adjnameschkboxlabel: "Adjustment Names",
		samplesizelabel: "Sample Size",
		nmissifanychkboxlabel: "Number Missing, if any",
		nmissalwayschkboxlabel: "Number Missing, always",
		fitstatisticslabel: "Fit Statistics",
		concchkboxlabel: "Concordance (AUC)",
		aicchkboxlabel: "Akaike Information Criterion (AIC)",
		bicchkboxlabel: "Bayesian Information Criterion (BIC)",
		loglikchkboxlabel: "Log-Likelihood",
		nulldevchkboxlabel: "Null Deviance",
		devchkboxlabel: "Deviance",
		nulldfchkboxlabel: "Null Model Degrees of Freedom",
		resdfchkboxlabel: "Residual Degrees of Freedom",
		pvalueslabel: "P-Values",
		parestpvaluechkboxlabel: "Parameter Estimates (Wald Test)",
		lrtpvaluechkboxlabel: "Likelihood Ratio Tests (not adjustors)",
		teststatisticslabel: "Test Statistics",
		zstatchkboxlabel: "Parameter z-statistics (Wald Test)",
        help: {
            title: "Logistic Regression, multiple models",
            r_help: "help(modelsum, package ='arsenal')",
            body: `
This creates a table containing results from logistic regression models for a given dependent variable.  Separate logistic regression models will be fit for each independent variable, 
optionally adjusted for a set of additional variables.  If a strata variable is specified, separate models will be fit for each of the stratification variable values.  As an example,
 if no adjustor or stratification variables are specified, then the table will include all univariate models for the list of independent variables.  Various statistics from each model can be output.
<br/><br/>
<b>Dependent Variable:</b> Dependent variable for each logistic regression model.  The variable class must be a numeric type or factor.
<br/><br/>
<b>Independent Variables:</b> Independent variables to include in the models.  The variable classes can be a numeric type, character, factor, or ordered factor.
<br/><br/>
<b>Adjustment Variables (Sets 1-5):</b> Optional variables to be included in a model with the independent variables.  The variable classes can be a numeric type, character, factor, or ordered factor.
Specifying more than one set of adjustor variables will provide separate models with each set of adjustor variables.
<br/><br/>
<b>Strata:</b> Optional stratification variable. Separate models will be fit for the subset defined by each of the stratification variable values.  The variable class can be character, numeric, factor, or ordered factor.
<br/><br/>
<b>Weights:</b> Optional case-weights to be used in the models.  Specifying a weights variable will fit weighted regression models.
<br/><br/>
<b>Digits After Decimal</b><br/>
<ul>
<li><b>Continuous Values:</b>  The number of decimal places to show for all continuous values in the table (default=4)</li>
<li><b>P-Values:</b>  The number of decimal places to show for all p-values in the table (default=4)</li>
<li><b>Odds Ratios:</b>  The number of decimal places to show for all odds ratios in the table (default=4)</li>
</ul>
<br/>
<b>Options:</b>
<br/><br/>
<b>Parameter Estimates and Odds Ratios</b><br/>
<ul>
<li><b>Parameter Estimates:</b>  Show parameter estimates (coefficients) from each model.</li>
<li><b>Standard Errors:</b>  Show standard errors of the parameter estimates.</li>
<li><b>Confidence Interval Level:</b>  Level for the parameter estimate and odds ratio confidence intervals (default=0.95).</li>
<li><b>Parameter Wald Confidence Intervals:</b>  Show Wald-based confidence intervals for the parameter estimates.</li>
<li><b>Parameter Profile Likelihood Confidence Intervals:</b>  Show profile likelihood-based confidence intervals for the parameter estimates.</li>
<li><b>Odds Ratios:</b>  Show odds ratios for each parameter estimate (exp(coefficient)).</li>
<li><b>Odds Ratios Wald Confidence Intervals:</b>  Show Wald-based confidence intervals for the odds ratios.</li>
<li><b>Odds Ratios Profile Likelihood Confidence Intervals:</b>  Show profile likelihood-based confidence intervals for the odds ratios.</li>
<li><b>Intercepts:</b>  Show the intercepts from each model.</li>
<li><b>Adjustment Variables:</b>  Show model output for the adjustment variables.</li>
<li><b>Adjustment Names:</b>  Show a column delineating model types (unadjusted and different adjustment variable sets).  Mostly useful when you don't want to show model output for the adjustor variables.</li>
</ul>
<br/>
<b>Sample Size</b><br/>
<ul>
<li><b>Sample Size:</b>  Show the sample size used from each model.</li>
<li><b>Number Missing, if any:</b>  Show the number of observations not used in each model (missing values), only if there are some not used.</li>
<li><b>Number Missing, always:</b>  Show the number of observations not used in each model (missing values), regardless of whether there are some observations not used.</li>
</ul>
<br/>
<b>Fit Statistics</b><br/>
<ul>
<li><b>Concordance (AUC):</b>  Show the model concordance statistic.  This is equivalent to the area under the curve (AUC) from a Receiver Operating Characteristic (ROC) curve.</li>
<li><b>Akaike Information Criterion (AIC):</b>  Show the model Akaike Information Criterion</li>
<li><b>Bayesian Information Criterion (BIC):</b>  Show the model Bayesian Information Criterion</li>
<li><b>Log-Likelihood:</b>  Show the model log-likelihood value</li>
<li><b>Null Deviance:</b>  Show the model null deviance value</li>
<li><b>Deviance:</b>  Show the model deviance value</li>
<li><b>Null Model Degrees of Freedom:</b>  Show the degrees of freedom from a model with no predictors in it.</li>
<li><b>Residual Degrees of Freedom:</b>  Show the residual degrees of freedom (total degrees of freedom minus the number of parameters fit).</li>
</ul>
<br/>
<b>P-Values</b><br/>
<ul>
<li><b>Parameter Estimates (Wald Test):</b>  Show the p-values from the individual parameter Wald tests</li>
<li><b>Likelihood Ratio Tests (not adjustors):</b>  Show the p-values for each independent variable based on a likelihood ratio test.  This compares a model with the independent variable to a model without the independent variable, including any adjustor variables in both models.</li>
</ul>
<br/>
<b>Test Statistics</b><br/>
<ul>
<li><b>Parameter z-statistics (Wald Test):</b>  Show the z-statistics from the individual parameter Wald tests</li>
</ul>
<br/>
<b>Required R Packages:</b> arsenal, dplyr
			`}
    }
}









class LogisticRegMultiple extends baseModal {
    constructor() {
        var config = {
            id: "LogisticRegMultiple",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(arsenal)
library(dplyr)

logreg.tab <- modelsum({{selected.depvar | safe}} ~ {{selected.indvars | safe}}, adjust=list('Unadjusted' = ~1 {{selected.adjvars1 | safe}}{{selected.adjvars2 | safe}}{{selected.adjvars3 | safe}}{{selected.adjvars4 | safe}}{{selected.adjvars5 | safe}}) {{selected.stratavar | safe}} {{selected.wgtvar | safe}}, data={{dataset.name}}, family=binomial, binomial.stats=c({{selected.statslist | safe}}), show.intercept={{selected.interceptchkbox | safe}}, show.adjust={{selected.adjvarschkbox | safe}}, digits={{selected.contdigits | safe}}, digits.p={{selected.pvaluedigits | safe}}, digits.ratio={{selected.ordigits | safe}}, conf.level={{selected.cilevel | safe}})

logreg.tab.final <- as.data.frame(summary(logreg.tab, text=TRUE, term.name="term", adjustment.names={{selected.adjnameschkbox | safe}}))

{{if (options.selected.parestpvaluechkbox=="'p.value'")}}
# renaming p-value column so that modelsum p-value formatting is used instead of BlueSky's formatting
logreg.tab.final <- rename(logreg.tab.final, "p value"="p.value")
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
				label: localization.en.depvarlabel,
				no: "depvar",
				filter: "Numeric|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},						
			indvars: {
				el: new dstVariableList(config,{
				label: localization.en.indvarslabel,
				no: "indvars",
				required: true,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},
			adjvars1: {
				el: new dstVariableList(config,{
				label: localization.en.adjvars1label,
				no: "adjvars1",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 1' = ~ %val%"
				})
			},
			adjvars2: {
				el: new dstVariableList(config,{
				label: localization.en.adjvars2label,
				no: "adjvars2",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 2' = ~ %val%"
				})
			},
			adjvars3: {
				el: new dstVariableList(config,{
				label: localization.en.adjvars3label,
				no: "adjvars3",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 3' = ~ %val%"
				})
			},
			adjvars4: {
				el: new dstVariableList(config,{
				label: localization.en.adjvars4label,
				no: "adjvars4",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 4' = ~ %val%"
				})
			},
			adjvars5: {
				el: new dstVariableList(config,{
				label: localization.en.adjvars5label,
				no: "adjvars5",
				required: false,
				filter:"String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				wrapped: ", 'Set 5' = ~ %val%"
				})
			},			
			stratavar: {
				el: new dstVariable(config, {
				label: localization.en.stratavarlabel,
				no: "stratavar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", strata=%val%",
				required: false,
				})
			},
			wgtvar: {
				el: new dstVariable(config, {
				label: localization.en.wgtvarlabel,
				no: "wgtvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: ", weights=%val%",
				required: false
				})
			},
			digitslabel: {
				el: new labelVar(config, {
				label: localization.en.digitslabel, 
				h:5,
				style: "mt-4"
				})
			},
			contdigits: {
				el: new inputSpinner(config, {
				  no: 'contdigits',
				  label: localization.en.contdigitslabel,
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
				  label: localization.en.pvaluedigitslabel,
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
				  label: localization.en.ordigitslabel,
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
				label: localization.en.parestorlabel, 
				h:5
				})
			},
			parestimatechkbox: {
				el: new checkbox(config, {
				label: localization.en.parestchkboxlabel,
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
				label: localization.en.stderrorschkboxlabel,
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
				label: localization.en.confintchkboxlabel,
				no: "confintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.wald'",
				false_value: ""
				})
			},
			likeconfintchkbox: {
				el: new checkbox(config, {
				label: localization.en.likeconfintchkboxlabel,
				no: "likeconfintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.estimate'",
				false_value: ""
				})
			},
			orchkbox: {
				el: new checkbox(config, {
				label: localization.en.orchkboxlabel,
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
				label: localization.en.orconfintchkboxlabel,
				no: "orconfintchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'CI.OR.wald'",
				false_value: ""
				})
			},
			likeorconfintchkbox: {
				el: new checkbox(config, {
				label: localization.en.likeorconfintchkboxlabel,
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
				  label: localization.en.cilevellabel,
				  min: 0,
				  max: 100,
				  step: .001,
				  value: .95,
				  extraction: "NoPrefix|UseComma"
				})
			},
			interceptchkbox: {
				el: new checkbox(config, {
				label: localization.en.interceptchkboxlabel,
				no: "interceptchkbox",
				state: "checked",
				extraction: "Boolean"
				})
			},
			adjvarschkbox: {
				el: new checkbox(config, {
				label: localization.en.adjvarschkboxlabel,
				no: "adjvarschkbox",
				state: "checked",
				extraction: "Boolean"
				})
			},
			adjnameschkbox: {
				el: new checkbox(config, {
				label: localization.en.adjnameschkboxlabel,
				no: "adjnameschkbox",
				extraction: "Boolean"
				})
			},			
			samplesizelabel: {
				el: new labelVar(config, {
				label: localization.en.samplesizelabel, 
				h:5,
				style: "mt-4",
				})
			},
			nchkbox: {
				el: new checkbox(config, {
				label: localization.en.samplesizelabel,
				no: "nchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},
			nmissifanychkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissifanychkboxlabel,
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
				label: localization.en.nmissalwayschkboxlabel,
				no: "nmissalwayschkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},
			fitstatisticslabel: {
				el: new labelVar(config, {
				label: localization.en.fitstatisticslabel, 
				h:5,
				style: "mt-4",
				})
			},
			concchkbox: {
				el: new checkbox(config, {
				label: localization.en.concchkboxlabel,
				no: "concchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'concordance'",
				false_value: ""
				})
			},
			aicchkbox: {
				el: new checkbox(config, {
				label: localization.en.aicchkboxlabel,
				no: "aicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'AIC'",
				false_value: ""
				})
			},
			bicchkbox: {
				el: new checkbox(config, {
				label: localization.en.bicchkboxlabel,
				no: "bicchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'BIC'",
				false_value: ""
				})
			},
			loglikchkbox: {
				el: new checkbox(config, {
				label: localization.en.loglikchkboxlabel,
				no: "loglikchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'logLik'",
				false_value: ""
				})
			},
			nulldevchkbox: {
				el: new checkbox(config, {
				label: localization.en.nulldevchkboxlabel,
				no: "nulldevchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'null.deviance'",
				false_value: ""
				})
			},
			devchkbox: {
				el: new checkbox(config, {
				label: localization.en.devchkboxlabel,
				no: "devchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'deviance'",
				false_value: ""
				})
			},
			nulldfchkbox: {
				el: new checkbox(config, {
				label: localization.en.nulldfchkboxlabel,
				no: "nulldfchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'df.null'",
				false_value: ""
				})
			},
			resdfchkbox: {
				el: new checkbox(config, {
				label: localization.en.resdfchkboxlabel,
				no: "resdfchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'df.residual'",
				false_value: ""
				})
			},			
			pvalueslabel: {
				el: new labelVar(config, {
				label: localization.en.pvalueslabel, 
				h:5,
				style: "mt-4",
				})
			},
			parestpvaluechkbox: {
				el: new checkbox(config, {
				label: localization.en.parestpvaluechkboxlabel,
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
				label: localization.en.lrtpvaluechkboxlabel,
				no: "lrtpvaluechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'p.value.lrt'",
				false_value: ""
				})
			},
			teststatisticslabel: {
				el: new labelVar(config, {
				label: localization.en.teststatisticslabel, 
				h:5,
				style: "mt-4",
				})
			},
			zstatchkbox: {
				el: new checkbox(config, {
				label: localization.en.zstatchkboxlabel,
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
                name: "Options",
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
                name: localization.en.navigation,
                icon: "icon-logistic_multiple",
				positionInNav: 13,
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
module.exports.item = new LogisticRegMultiple().render()