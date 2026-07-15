var localization = {
    en: {
        title: "Elastic Net",
        navigation: "Elastic Net",
		modellabel: "Enter Model Name",
		depvarlabel: "Dependent variable",
		independentlabel: "Independent variables",
		offsetlabel: "Offset",
		weightslabel: "Weights",
		alphalabel: "Mixing parameter (alpha), 0=ridge regression, 1=lasso regression",
		cvmeaslabel: "Cross-validation measure",
		nfoldslabel: "Cross-validation number of folds (max=sample size)",
		seedlabel: "Set seed",
		outputallestlabel: "Output dataset with all models for every lambda in the sequence",
		outputdatasetlabel: "Output dataset name",
		familylabel: "Select a family and link function",
		thetalabel: "Negative binomial theta parameter (theta>0, required if negative binomial family, smaller value=more dispersion, larger value=less dispersion)",
		varpowerlabel: "Tweedie variance power (required if tweedie family)",
		linkpowerlabel: "Tweedie link power (required if tweedie family)",
		expcoeflabel: "Exponentiate coefficients",
		onesetablelabel: "Create table of non-zero coefficients at minimum lambda + 1 SE",
        help: {
            title: "Elastic Net",
            r_help: "help(cv.glmnet, package ='glmnet')",
            body: `
This dialog fits generalized linear and similar models via penalized maximum likelihood. The regularization path is computed for the 
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

<b>Dependent variable:</b></br>
Outcome variable for the model (required). Can be numeric or factor. </br></br>

<b>Independent variables:</b> </br>
Specify the independent variables for the model.  Can be numeric, factor, ordinal, or character. (required)</br></br>

<b>Offset:</b></br>
Specify an optional offset variable. Must be numeric.  This incorporates an independent variable in the model with fixed values.  No coefficient is estimated for this variable and is taken to be 1.</br></br>  

<b>Weights:</b></br>
Specify an optional weights variable.  Must be numeric.  This specifies positive "prior weights" to be used in the fitting process.</br></br>

<b>Mixing parameter (alpha):</b></br>
This specifies how much of the penalty should be a ridge (alpha=0) vs lasso (alpha=1) penalty. One use of alpha is for numerical stability; for example, the elastic net with alpha=1−epsilon for some 
small epsilon>0 performs much like the lasso, but removes any degeneracies and wild behavior caused by extreme correlations.  The default is 1 (lasso).</br></br>

<b>Cross-validation measure:</b></br>
Specify which statistic is used to judge model performance in the cross-validation.  Options are:
<ul>
<li>default: uses the default metric for each model type; if you aren't sure, this is a good choice</li>
<li>mse: mean squared error - average squared difference between predicted values and observed values. For binomial data this amounts to the Brier score.</li>
<li>mae: mean absolute error - average of the absolute differences between predicted values and observed values</li>
<li>deviance: measures the difference between the likelihood of the fitted model and the likelihood of a saturated model (one parameter per observation)</li>
<li>class: misclassification error; applies to binomial and multinomial only</li>
<li>auc: area under the receiver operating characteristic (ROC) curve; binomial model only</li>
</ul>

<b>Cross-validation number of folds:</b></br>
This specifies the number of partitions the dataset will be split into for the cross-validation.  The default is 10. (minimum=3, maximum=sample size)</br></br>

<b>Set seed:</b></br>
Specify the random seed used for the cross-validation.  Using the same seed across model runs yields model reproducibility.</br></br>

<b>Select a family and link function:</b></br>
This specifies the distribution family for the dependent variable and the link function for what the relationship is between the linear function of the independent variables and the mean response.</br></br>

<b> Negative binomial theta parameter:</b></br>
For the negative binomial family, this defines the dispersion parameter.  This often helps account for overdispersion in count data, where the variance is greater than the mean.  The variance is mu + mu^2/theta. Theta is assumed to be a known value and is not estimated.
It is required if the negative binomial family is chosen.</br></br>

Tweedie distributions can produce any power variance function and any power link function.  Gaussian, Poisson, Gamma, and Inverse-Gaussian are special cases. Variance(mu) = mu^(variance power) and the link function is mu^(link power) for non-zero values of "link power" or log(mu) for variance power=0.
Each value of "variance power" corresponds to a particular type of response distribution. The values 0, 1, 2 and 3 correspond to the normal distribution, the Poisson distribution, the gamma distribution and the inverse-Gaussian distribution respectively.
Interesting Tweedie families occur for "variance power" between 1 and 2. For these GLMs, the response distribution has mass at zero (i.e., it has exact zeros) but is otherwise continuous on the positive real numbers (Smyth, 1996; Hasan et al, 2012).
Hence "variance power" should be chosen between 1 and 2 only if the response observations are continuous and positive except for exact zeros. "variance power" should be chosen greater than or equal to 2 only if the response observations are continuous and strictly positive.
There are no theoretical Tweedie GLMs with "variance power" between 0 and 1 (Jorgensen 1987). The tweedie function will work for those values but the family should be interpreted in a quasi-likelihood sense.
</br></br>

<b>Tweedie variance power:</b></br>
Index of power variance function.  Required for tweedie family.</br></br>

<b>Tweedie link power:</b></br>
Index of power link function.  Required for tweedie family.</br></br>

<b>Exponentiate coefficients:</b></br>
Whether to compute exp(coefficient).  Useful for log and logit link functions (e.g. odds ratios in logistic models, incidence rate ratios in Poisson models)</br></br>

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

Friedman, Jerome, Trevor Hastie, and Robert Tibshirani. 2010. “Regularization Paths for Generalized Linear Models via Coordinate Descent.” Journal of Statistical Software, Articles 33 (1): 1–22. <a href="https://doi.org/10.18637/jss.v033.i01">link</a></br></br>

Simon, Noah, Jerome Friedman, and Trevor Hastie. 2013. “A Blockwise Descent Algorithm for Group-Penalized Multiresponse and Multinomial Regression.” <a href="https://doi.org/10.48550/arXiv.1311.6529">link</a></br></br>

Simon, Noah, Jerome Friedman, Trevor Hastie, and Robert Tibshirani. 2011. “Regularization Paths for Cox’s Proportional Hazards Model via Coordinate Descent.” Journal of Statistical Software, Articles 39 (5): 1–13. <a href="https://doi.org/10.18637/jss.v039.i05">link</a></br></br>

Tibshirani, Robert, Jacob Bien, Jerome Friedman, Trevor Hastie, Noah Simon, Jonathan Taylor, and Ryan Tibshirani. 2012. “Strong Rules for Discarding Predictors in Lasso-Type Problems.” Journal of the Royal Statistical Society: Series B (Statistical Methodology) 74 (2): 245–66. <a href="https://doi.org/10.1111/j.1467-9868.2011.01004.x">link</a></br></br>

<b>R Packages Required:</b> glmnet, MASS, statmod, broom, dplyr
			`}
    }
}



class enetPro extends baseModal {
    constructor() {
        var config = {
            id: "enetPro",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(glmnet)
library(MASS)
library(statmod)
library(broom)
library(dplyr)

# create dataset that removes missing data from both response and predictors
data_for_mod <- dplyr::select({{dataset.name}}, {{selected.depvar | safe}}, {{selected.independent | safe}}{{selected.offsetval | safe}}{{selected.weightsval | safe}}) %>%
	na.omit()

# create dataset that has only the predictors
pred_for_mod <- dplyr::select(data_for_mod, -{{selected.depvar | safe}}{{selected.minusoffsetval | safe}}{{selected.minusweightsval | safe}})

# model matrix
xmat_mod <- makeX(pred_for_mod)

{{if (options.selected.family == "gaussian" & options.selected.combokid == "identity")}}
# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="gaussian",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="gaussian",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}

{{if (options.selected.family == "binomial" & options.selected.combokid == "logit")}}
# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="binomial",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="binomial",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}

{{if (options.selected.family == "poisson" & options.selected.combokid == "log")}}
# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="poisson",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="poisson",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}

{{if (options.selected.family == "tweedie")}}
# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family=tweedie(var.power={{selected.varpower | safe}}, link.power={{selected.linkpower | safe}}),
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family=tweedie(var.power={{selected.varpower | safe}}, link.power={{selected.linkpower | safe}}),
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}

{{if (options.selected.family == "multinomial")}}
# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="multinomial",
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}, type.multinomial="ungrouped")

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family="multinomial",
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}, type.multinomial="ungrouped", type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})
{{#else}}

# fit over all lambda
fit <- glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family={{selected.family | safe}}(link="{{selected.combokid | safe}}"{{selected.theta | safe}}),
             alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}})

# cross-validation fit
set.seed({{selected.seed | safe}})
cv_fit <- cv.glmnet(y=data_for_mod{{selected.dollardepvar | safe}}, x=xmat_mod, family={{selected.family | safe}}(link="{{selected.combokid | safe}}"{{selected.theta | safe}}),
                alpha={{selected.alpha | safe}}{{selected.weights | safe}}{{selected.offset | safe}}, type.measure="{{selected.cvmeas | safe}}",
                nfolds={{selected.nfolds | safe}})				
{{/if}}
{{/if}}
{{/if}}
{{/if}}
{{/if}}


# model info
mod_info <- as.data.frame(glance(cv_fit)) %>%
	mutate(family="{{selected.family | safe}}",
		link="{{selected.combokid | safe}}",
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

{{if (options.selected.family == "multinomial")}}
tempcoef_lambdamin <- coef(cv_fit, s="lambda.min")
tempcoef_lambda1se <- coef(cv_fit, s="lambda.1se")

cv_coefs_min <- as.data.frame(NULL)
cv_coefs_1se <- as.data.frame(NULL)

for (i in 1:length(names(tempcoef_lambdamin))) {
  # minimum lambda coef
  tempdat_min <- as.data.frame(as.matrix(tempcoef_lambdamin[[i]])) %>%
		rownames_to_column("variable") %>%
		rename(coefficient="1") %>%
		mutate(class=names(tempcoef_lambdamin)[[i]]) %>%
		relocate(class) %>%
		filter(coefficient != 0)
  
	cv_coefs_min <- bind_rows(cv_coefs_min, tempdat_min)
  
  # lambda+1SE coef
  tempdat_1se <- as.data.frame(as.matrix(tempcoef_lambda1se[[i]])) %>%
		rownames_to_column("variable") %>%
		rename(coefficient="1") %>%
		mutate(class=names(tempcoef_lambda1se)[[i]]) %>%
		relocate(class) %>%
		filter(coefficient != 0)
  
	cv_coefs_1se <- bind_rows(cv_coefs_1se, tempdat_1se)  
}
{{#else}}
# coefficients at lambda.min
cv_coefs_min <- as.data.frame(as.matrix(coef(cv_fit, s="lambda.min"))) %>%
	rename(coefficient=s1) %>%
	filter(coefficient != 0)

# coefficients at lambda.1se
cv_coefs_1se <- as.data.frame(as.matrix(coef(cv_fit, s="lambda.1se"))) %>%
	rename(coefficient=s1) %>%
	filter(coefficient != 0)
{{/if}}

{{if (options.selected.expcoef == "TRUE")}}
# exponentiating coefficients at minimum lambda and minimum lambda + 1 SE
cv_coefs_min <- mutate(cv_coefs_min,
					   "exp(coefficient)"=exp(coefficient))
cv_coefs_1se <- mutate(cv_coefs_1se,
					   "exp(coefficient)"=exp(coefficient))
{{/if}}

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
	
{{if (options.selected.expcoef == "TRUE")}}
# exponentiating coefficients
{{selected.outputdatasetname | safe}} <- mutate({{selected.outputdatasetname | safe}},
												exp_estimate=exp(estimate)) %>%
										relocate(exp_estimate, .after=estimate)
{{/if}}
{{/if}}

# model output
BSkyFormat(mod_info, singleTableOutputHeader="Model Summary for {{selected.depvar | safe}}")
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
			depvar: {
                el: new dstVariable(config, {
                    label: localization.en.depvarlabel,
                    no: "depvar",
                    filter: "Numeric|Scale|Nominal",
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
                    options: ["default", "mse", "mae", "deviance", "class", "auc"],
                    default: "default",
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
			
            family: {
                el: new comboBoxWithChilderen(config, {
                    no: 'family',
                    nochild: 'combokid',
                    label: localization.en.familylabel,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: [
                        { "name": "binomial", "value": ["logit", "probit", "cauchit","log","cloglog"] },
                        { "name": "Gamma", "value": ["inverse","identity",  "log"] },
                        { "name": "gaussian", "value": ["identity", "inverse", "log"] },
                        { "name": "inverse.gaussian", "value": ["1/mu^2","identity", "inverse", "log" ] },
						{ "name": "multinomial", "value": [" "] },
                        { "name": "negative.binomial", "value": ["log", "identity", "sqrt"] },
                        { "name": "poisson", "value": [ "log","identity", "sqrt"] },
                        { "name": "quasi", "value": [ "logit","probit","cloglog","identity","inverse", "log", "1/mu^2","sqrt" ] },
						{ "name": "quasibinomial", "value": ["logit", "probit", "cauchit","log","cloglog"] },
						{ "name": "quasipoisson", "value": [ "log","identity", "sqrt"] },
						{ "name": "tweedie", "value": [ " " ] }
                    ]
                })
            },		
			theta: {
                el: new input(config, {
                    no: 'theta',
                    label: localization.en.thetalabel,
                    placeholder: "",
                    type: "numeric",
					allow_spaces: true,
					width: "w-25",
					style: "mb-3",
                    extraction: "TextAsIs",
					wrapped: ", theta=%val%"
                })
            },
			varpower: {
                el: new input(config, {
                    no: 'varpower',
                    label: localization.en.varpowerlabel,
                    type: "numeric",
					value: "0",
					allow_spaces: true,
					width: "w-25",
					style: "mt-3",
                    extraction: "TextAsIs"
                })
            },
			linkpower: {
                el: new input(config, {
                    no: 'linkpower',
                    label: localization.en.linkpowerlabel,
                    type: "numeric",
					value: "1",
					allow_spaces: true,
					width: "w-25",
					style: "mb-3",
                    extraction: "TextAsIs"
                })
            },
			expcoef: {
				el: new checkbox(config, {
					label: localization.en.expcoeflabel,
					no: "expcoef",
					style: "mt-3",
					extraction: "Boolean"
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
            right: [objects.modelname.el.content, objects.depvar.el.content, objects.independent.el.content, objects.offset.el.content, objects.weights.el.content,
					objects.alpha.el.content, objects.cvmeas.el.content, objects.nfolds.el.content, objects.seed.el.content],
			bottom: [objects.family.el.content, objects.theta.el.content, objects.varpower.el.content, objects.linkpower.el.content, objects.expcoef.el.content,
					outputpanel.el.content],
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
		let depvarapp=code_vars.selected.depvar
		let dollardepvar="$"+depvarapp
		
		//for offsets
		let offsetapp=code_vars.selected.offset
		let offsetval=offsetapp.replace("offset=", '')
		let minusoffsetval=offsetapp.replace("offset=", '-')
		
		//for weights
		let weightsapp=code_vars.selected.weights
		let weightsval=weightsapp.replace("weights=", '')
		let minusweightsval=weightsapp.replace("weights=", '-')
	
		//create new variables under code_vars
		code_vars.selected.dollardepvar = dollardepvar
		
		code_vars.selected.offsetval = offsetval
		code_vars.selected.minusoffsetval = minusoffsetval
		
		code_vars.selected.weightsval = weightsval
		code_vars.selected.minusweightsval = minusweightsval
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new enetPro().render()