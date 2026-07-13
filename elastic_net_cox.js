var localization = {
    en: {
        title: "Elastic Net, Cox",
        navigation: "Elastic Net, Cox",
		modellabel: "Enter Model Name",
		timevarlabel: "Time to event or censor",
		eventvarlabel: "Events (1=event, 0=censor)",
		independentlabel: "Independent variables",
		offsetlabel: "Offset",
		weightslabel: "Weights",
		stratalabel: "Strata",
		alphalabel: "Mixing parameter (alpha), 0=ridge regression, 1=lasso regression",
		cvmeaslabel: "Cross-validation measure",
		nfoldslabel: "Cross-validation number of folds (max=sample size)",
		seedlabel: "Set seed",
		outputallestlabel: "Output dataset with all models for every lambda in the sequence",
		outputdatasetlabel: "Output dataset name",
		onesetablelabel: "Create table of non-zero coefficients at minimum lambda + 1 SE",
        help: {
            title: "Elastic Net, Cox",
            r_help: "help(cv.glmnet, package ='glmnet')",
            body: `
This dialog fits Cox regression models via penalized maximum likelihood. The regularization path is computed for the 
lasso or elastic net penalty at a grid of values (on the log scale) for the regularization parameter lambda.  Penalized regression is useful
when the number of parameters is large relative to the sample size (or number of outcome events).  This is a good solution to the bias-variance tradeoff, where one
is willing to sacrifice a little bias in exchange for less prediction variability.  The alpha parameter controls the mixing of the penalties
between ridge regression (alpha=0) and lasso regression (alpha=1).  The tuning parameter (lambda) controls the overall strength of the penalty.  The optimal
value of lambda is chosen with k-fold cross-validation.
</br></br>
The ridge penalty shrinks the coefficients of correlated predictors towards each other while the lasso tends to pick one of them and discard the others.  So,
lasso is good for variable selection purposes.   
</br></br>
The theory and algorithms in this implementation are described in Friedman, Hastie, and Tibshirani (2010), Simon et al. (2011), Tibshirani et al. (2012) 
and Simon, Friedman, and Hastie (2013).
</br></br>
Observations with missing values for any variable used in the model are automatically removed.  Predictors are standardized automatically prior to model-fitting.
The coefficients are always returned on the original scale.  Plots are produced showing coefficient values and the model criterion values throughout the entire lambda sequence. 

<br/><br/>

<b>Time to event or censor:</b></br>
Variable for the time to event (for those with the event) and the time to censor (for those without the event) (required). Numeric only. </br></br>

<b>Events (1=event, 0=censor):</b></br>
Variable indicating those with the event (=1) and those censored (=0) (required). Numeric only. </br></br>

<b>Independent variables:</b> </br>
Specify the independent variables for the model.  Can be numeric, factor, ordinal, or character. (required)</br></br>

<b>Offset:</b></br>
Specify an optional offset variable. Must be numeric.  This incorporates an independent variable in the model with fixed values.  No coefficient is estimated for this variable and is taken to be 1.</br></br>  

<b>Weights:</b></br>
Specify an optional weights variable.  Must be numeric.  This specifies positive "prior weights" to be used in the fitting process.</br></br>

<b>Strata:</b></br>
Specify an optional stratification variable.  When specified, this fits a stratified Cox model, which allows separate baseline hazard functions for each strata level. Can be numeric, factor, or character.</br></br>

<b>Mixing parameter (alpha):</b></br>
This specifies how much of the penalty should be a ridge (alpha=0) vs lasso (alpha=1) penalty. One use of alpha is for numerical stability; for example, the elastic net with alpha=1−epsilon for some 
small epsilon>0 performs much like the lasso, but removes any degeneracies and wild behavior caused by extreme correlations.  The default is 1 (lasso).</br></br>

<b>Cross-validation measure:</b></br>
Specify which statistic is used to judge model performance in the cross-validation.  Options are:
<ul>
<li>deviance: measures the difference between the likelihood of the fitted model and the likelihood of a saturated model (one parameter per observation)</li>
<li>C: Harrell's C statistic for model concordance; measures model discrimination such that those with higher risk scores should have shorter times to the event</li>
</ul>

<b>Cross-validation number of folds:</b></br>
This specifies the number of partitions the dataset will be split into for the cross-validation.  The default is 10. (minimum=3, maximum=sample size)</br></br>

<b>Set seed:</b></br>
Specify the random seed used for the cross-validation.  Using the same seed across model runs yields model reproducibility.</br></br>

<b>Output Options</b></br></br>
<b>Output dataset with all models for every lambda in the sequence:</b></br>
Specify whether to create a dataset that contains the model for every lambda value.  The dataset will be sorted by increasing lambda value, where the model for the smallest 
lambda is essentially the unpenalized model.  This dataset will contain an indicator variable for whether (=1) or not (=0) the model pertains to a lambda value within 1 standard
error of the optimal lambda value.  In some sense, all models within 1 SE are statistically equivalent and would provide similar performance.</br></br>

<b>Output dataset name:</b></br>
Name of output dataset that contains the models across the entire lambda sequence.</br></br>

<b>Create table of non-zero coefficients at minimum lambda + 1 SE:</b></br>
This specifies whether or not to produce a table of coefficient estimates for the model that is exactly 1 standard error from the optimal lambda.

</br></br>
References: </br></br>

Hastie et al.  An Introduction to glmnet <a href="https://glmnet.stanford.edu/articles/glmnet.html">link</a></br></br>

Tay et al.  Regularized Cox Regression <a href="https://glmnet.stanford.edu/articles/Coxnet.html">link</a></br></br>

Friedman, Jerome, Trevor Hastie, and Robert Tibshirani. 2010. “Regularization Paths for Generalized Linear Models via Coordinate Descent.” Journal of Statistical Software, Articles 33 (1): 1–22. <a href="https://doi.org/10.18637/jss.v033.i01">link</a></br></br>

Simon, Noah, Jerome Friedman, and Trevor Hastie. 2013. “A Blockwise Descent Algorithm for Group-Penalized Multiresponse and Multinomial Regression.” <a href="https://doi.org/10.48550/arXiv.1311.6529">link</a></br></br>

Simon, Noah, Jerome Friedman, Trevor Hastie, and Robert Tibshirani. 2011. “Regularization Paths for Cox’s Proportional Hazards Model via Coordinate Descent.” Journal of Statistical Software, Articles 39 (5): 1–13. <a href="https://doi.org/10.18637/jss.v039.i05">link</a></br></br>

Tibshirani, Robert, Jacob Bien, Jerome Friedman, Trevor Hastie, Noah Simon, Jonathan Taylor, and Ryan Tibshirani. 2012. “Strong Rules for Discarding Predictors in Lasso-Type Problems.” Journal of the Royal Statistical Society: Series B (Statistical Methodology) 74 (2): 245–66. <a href="https://doi.org/10.1111/j.1467-9868.2011.01004.x">link</a></br></br>

<b>R Packages Required:</b> glmnet, survival, broom, dplyr
			`}
    }
}



class enetcox extends baseModal {
    constructor() {
        var config = {
            id: "enetcox",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(glmnet)
library(survival)
library(broom)
library(dplyr)

# create dataset that removes missing data from both response and predictors
data_for_mod <- dplyr::select({{dataset.name}}, {{selected.timevar | safe}}, {{selected.eventvar | safe}}, {{selected.independent | safe}}{{selected.offsetval | safe}}{{selected.weightsval | safe}}{{selected.strataval | safe}}) %>%
	na.omit()

# create dataset that has only the predictors
pred_for_mod <- dplyr::select(data_for_mod, -{{selected.timevar | safe}}, -{{selected.eventvar | safe}}{{selected.minusoffsetval | safe}}{{selected.minusweightsval | safe}}{{selected.minusstrataval | safe}})

# model matrix
xmat_mod <- makeX(pred_for_mod)

{{if (options.selected.strata == "")}}
# fit over all lambda
fit <- glmnet(y=Surv(data_for_mod{{selected.dollartimevar | safe}}, data_for_mod{{selected.dollareventvar | safe}}), x=xmat_mod, family="cox",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=Surv(data_for_mod{{selected.dollartimevar | safe}}, data_for_mod{{selected.dollareventvar | safe}}), x=xmat_mod, family="cox",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}
# fit over all lambda
fit <- glmnet(y=stratifySurv(Surv(data_for_mod{{selected.dollartimevar | safe}}, data_for_mod{{selected.dollareventvar | safe}}){{selected.strata | safe}}), x=xmat_mod, family="cox",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=stratifySurv(Surv(data_for_mod{{selected.dollartimevar | safe}}, data_for_mod{{selected.dollareventvar | safe}}){{selected.strata | safe}}), x=xmat_mod, family="cox",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{/if}}

# model info
mod_info <- as.data.frame(glance(cv_fit)) %>%
	mutate(family="cox",
        "penalty (alpha)"={{selected.alpha | safe}},
        "number of folds"={{selected.nfolds | safe}},
        measure=cv_fit$name) %>%
	rename(N=nobs)

# criterion values at lambda.min and lambda.1se 
crit_val_lambdamin <- tidy(cv_fit) %>%
	filter(lambda==cv_fit$lambda.min)

crit_val_lambda1se <- tidy(cv_fit) %>%
	filter(lambda==cv_fit$lambda.1se)

crit_val_all <- as.data.frame(bind_rows(crit_val_lambdamin, crit_val_lambda1se))
dimnames(crit_val_all)[[1]] <- c("lambda.min","lambda.1se")	

# coefficients at lambda.min
cv_coefs_min <- as.data.frame(as.matrix(coef(cv_fit, s="lambda.min"))) %>%
	rename(coefficient="1") %>%
	filter(coefficient != 0) %>%
	mutate(HR=exp(coefficient))

# coefficients at lambda.1se
cv_coefs_1se <- as.data.frame(as.matrix(coef(cv_fit, s="lambda.1se"))) %>%
	rename(coefficient="1") %>%
	filter(coefficient != 0) %>%
	mutate(HR=exp(coefficient))

{{if (options.selected.outputallest == "TRUE")}}
# dataset with all parameter estimates for every lambda in the sequence
# with indicator of whether lambda is within 1 SE and a model number

{{selected.outputdatasetname | safe}} <- tidy(fit) %>%
	arrange(lambda) %>%
	mutate(within_1se=ifelse((lambda>=cv_fit$lambda.min) & (lambda<=cv_fit$lambda.1se), 1, 0))

mod_numbers <- count({{selected.outputdatasetname | safe}}, lambda) %>%
	mutate(model=row_number())

{{selected.outputdatasetname | safe}} <- left_join({{selected.outputdatasetname | safe}}, mod_numbers, by="lambda") %>%
	dplyr::select(-step, -n) %>%
	relocate(model)
	
# exponentiating coefficients
{{selected.outputdatasetname | safe}} <- mutate({{selected.outputdatasetname | safe}},
												HR=exp(estimate)) %>%
										relocate(HR, .after=estimate)
{{/if}}

# model output
BSkyFormat(mod_info, singleTableOutputHeader="Model Summary for Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}){{selected.strataname | safe}}")
BSkyFormat(crit_val_all, singleTableOutputHeader="Cross-validation criterion values (CI: +/- 1 SE) and number of non-zero coefficients at each lambda")
BSkyFormat(cv_coefs_min, singleTableOutputHeader="Non-zero Parameter Estimates at Minimum lambda")
{{if (options.selected.onesetable == "TRUE")}}
BSkyFormat(cv_coefs_1se, singleTableOutputHeader="Non-zero Parameter Estimates at Minimum lambda + 1 SE")
{{/if}}
{{if (options.selected.outputallest == "TRUE")}}
# output dataset of parameter estimates for for every lambda
BSkyLoadRefresh("{{selected.outputdatasetname | safe}}")
{{/if}}

# plot of coefficients across all lambdas in the sequence
plot(fit, label=TRUE, xvar="lambda")

# cross-validation plot
plot(cv_fit)
`
        };
        var objects = {
			modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modellabel,
                    placeholder: "",
                    value:"EnetModel1",
					enforceRobjectRules:true,
                    extraction: "TextAsIs",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },		
			content_var: {
				el: new srcVariableList(config, {
					action: "move"
				}) 
			},
			timevar: {
                el: new dstVariable(config, {
                    label: localization.en.timevarlabel,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvarlabel,
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },			
			independent: {
				el: new dstVariableList(config,{
					label: localization.en.independentlabel,
					no: "independent",
					required: true,
					filter:"String|Numeric|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UseComma",
				})
			},						
            offset: {
                el: new dstVariable(config, {
                    label: localization.en.offsetlabel,
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ', offset=%val%',
                    extraction: "NoPrefix|UseComma",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: localization.en.weightslabel,
                    no: "weights",
                    filter: "Numeric|Scale",
					wrapped: ', weights=%val%',
                    extraction: "NoPrefix|UseComma"
                })
            },
            strata: {
                el: new dstVariable(config, {
                    label: localization.en.stratalabel,
                    no: "strata",
                    filter: "Numeric|Scale|Nominal|Character",
					wrapped: ', strata=data_for_mod$%val%',
                    extraction: "NoPrefix|UseComma"
                })
            },			
			alpha: {
				el: new advancedSlider(config,{
					no: 'alpha',
					label: localization.en.alphalabel,
					min: 0,
					max: 1,
					step: 0.001,
					value: 1,
					style: "mt-3",
					required: true,
					extraction: "NoPrefix|UseComma"
				})
			},
		    cvmeas: {
                el: new selectVar(config, {
                    no: 'cvmeas',
                    label: localization.en.cvmeaslabel,
                    multiple: false,
					width: "w-25",
                    extraction: "NoPrefix|UseComma",
                    options: ["deviance", "C"],
                    default: "deviance",
					required: true
                })
            },
			nfolds: {
				el: new inputSpinner(config, {
					no: 'nfolds',
					label: localization.en.nfoldslabel,
					min: 3,
					max: 100000,
					step: 1,
					value: 10,
					required: true,
					extraction: "NoPrefix|UseComma"
				})
			},
			seed: {
				el: new inputSpinner(config, {
					no: 'seed',
					label: localization.en.seedlabel,
					min: 0,
					max: 10000000,
					step: 1,
					value: 12345,
					style: "mb-4",
					required: true,
					extraction: "NoPrefix|UseComma"
				})
			},				
			outputallest: {
				el: new checkbox(config, {
					label: localization.en.outputallestlabel,
					no: "outputallest",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			outputdatasetname: {
                el: new input(config, {
                    no: 'outputdatasetname',
                    label: localization.en.outputdatasetlabel,
                    placeholder: "",
                    value:"Allmodels",
					enforceRobjectRules:true,
					overwrite: "dataset",
					style: "ml-5",
                    extraction: "TextAsIs",
                    required: false,
                    type: "character"
                })
            },				
			onesetable: {
				el: new checkbox(config, {
					label: localization.en.onesetablelabel,
					no: "onesetable",
					newline: true,
					extraction: "Boolean"
				})
			}
			
		}
		
		var outputpanel = {
            el: new optionsVar(config, {
                no: "outputpanel",
                name: "Output Options",
                content: [
                    objects.outputallest.el, objects.outputdatasetname.el, objects.onesetable.el
					]
				})
		}	
		
			
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.timevar.el.content, objects.eventvar.el.content, objects.independent.el.content, objects.offset.el.content, objects.weights.el.content,
					objects.strata.el.content, objects.alpha.el.content, objects.cvmeas.el.content, objects.nfolds.el.content, objects.seed.el.content],
			bottom: [outputpanel.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-variance",
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
		
		//for dependent variable
		let timevarapp=code_vars.selected.timevar
		let dollartimevar="$"+timevarapp
		
		let eventvarapp=code_vars.selected.eventvar
		let dollareventvar="$"+eventvarapp
		
		//for offsets
		let offsetapp=code_vars.selected.offset
		let offsetval=offsetapp.replace("offset=", '')
		let minusoffsetval=offsetapp.replace("offset=", '-')
		
		//for weights
		let weightsapp=code_vars.selected.weights
		let weightsval=weightsapp.replace("weights=", '')
		let minusweightsval=weightsapp.replace("weights=", '-')
		
		//for strata
		let strataapp=code_vars.selected.strata
		let strataval=strataapp.replace("strata=data_for_mod$", '')
		let minusstrataval=strataapp.replace("strata=data_for_mod$", '-')
		let strataname=strataapp.replace("data_for_mod$", '')
	
		//create new variables under code_vars
		code_vars.selected.dollartimevar = dollartimevar
		code_vars.selected.dollareventvar = dollareventvar
		
		code_vars.selected.offsetval = offsetval
		code_vars.selected.minusoffsetval = minusoffsetval
		
		code_vars.selected.weightsval = weightsval
		code_vars.selected.minusweightsval = minusweightsval
		
		code_vars.selected.strataval = strataval
		code_vars.selected.minusstrataval = minusstrataval
		code_vars.selected.strataname = strataname
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new enetcox().render()