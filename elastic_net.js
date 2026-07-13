



class enet extends baseModal {
    static dialogId = 'enet'
    static t = baseModal.makeT(enet.dialogId)

    constructor() {
        var config = {
            id: enet.dialogId,
            label: enet.t('title'),
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
                    label: enet.t('modellabel'),
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
                    label: enet.t('depvarlabel'),
                    no: "depvar",
                    filter: "Numeric|Scale|Nominal",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			independent: {
				el: new dstVariableList(config,{
					label: enet.t('independentlabel'),
					no: "independent",
					required: true,
					filter:"String|Numeric|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UseComma",
				})
			},						
            offset: {
                el: new dstVariable(config, {
                    label: enet.t('offsetlabel'),
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ', offset=%val%',
                    extraction: "NoPrefix|UseComma",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: enet.t('weightslabel'),
                    no: "weights",
                    filter: "Numeric|Scale",
					wrapped: ', weights=%val%',
                    extraction: "NoPrefix|UseComma"
                })
            },
			alpha: {
				el: new advancedSlider(config,{
					no: 'alpha',
					label: enet.t('alphalabel'),
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
                    label: enet.t('cvmeaslabel'),
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
					label: enet.t('nfoldslabel'),
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
					label: enet.t('seedlabel'),
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
					label: enet.t('outputallestlabel'),
					no: "outputallest",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			outputdatasetname: {
                el: new input(config, {
                    no: 'outputdatasetname',
                    label: enet.t('outputdatasetlabel'),
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
                    label: enet.t('familylabel'),
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
                    label: enet.t('thetalabel'),
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
                    label: enet.t('varpowerlabel'),
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
                    label: enet.t('linkpowerlabel'),
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
					label: enet.t('expcoeflabel'),
					no: "expcoef",
					style: "mt-3",
					extraction: "Boolean"
				})
			},				
			onesetable: {
				el: new checkbox(config, {
					label: enet.t('onesetablelabel'),
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
                name: enet.t('navigation'),
                icon: "icon-variance",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: enet.t('help.title'),
            r_help: enet.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: enet.t('help.body')
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

module.exports = {
    render: () => new enet().render()
}
