



class enetCoxPro extends baseModal {
    static dialogId = 'enetCoxPro'
    static t = baseModal.makeT(enetCoxPro.dialogId)

    constructor() {
        var config = {
            id: enetCoxPro.dialogId,
            label: enetCoxPro.t('title'),
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
                    label: enetCoxPro.t('modellabel'),
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
                    label: enetCoxPro.t('timevarlabel'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: enetCoxPro.t('eventvarlabel'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },			
			independent: {
				el: new dstVariableList(config,{
					label: enetCoxPro.t('independentlabel'),
					no: "independent",
					required: true,
					filter:"String|Numeric|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UseComma",
				})
			},						
            offset: {
                el: new dstVariable(config, {
                    label: enetCoxPro.t('offsetlabel'),
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ', offset=%val%',
                    extraction: "NoPrefix|UseComma",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: enetCoxPro.t('weightslabel'),
                    no: "weights",
                    filter: "Numeric|Scale",
					wrapped: ', weights=%val%',
                    extraction: "NoPrefix|UseComma"
                })
            },
            strata: {
                el: new dstVariable(config, {
                    label: enetCoxPro.t('stratalabel'),
                    no: "strata",
                    filter: "Numeric|Scale|Nominal|Character",
					wrapped: ', strata=data_for_mod$%val%',
                    extraction: "NoPrefix|UseComma"
                })
            },			
			alpha: {
				el: new advancedSlider(config,{
					no: 'alpha',
					label: enetCoxPro.t('alphalabel'),
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
                    label: enetCoxPro.t('cvmeaslabel'),
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
					label: enetCoxPro.t('nfoldslabel'),
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
					label: enetCoxPro.t('seedlabel'),
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
					label: enetCoxPro.t('outputallestlabel'),
					no: "outputallest",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			outputdatasetname: {
                el: new input(config, {
                    no: 'outputdatasetname',
                    label: enetCoxPro.t('outputdatasetlabel'),
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
					label: enetCoxPro.t('onesetablelabel'),
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
                name: enetCoxPro.t('navigation'),
                icon: "icon-variance",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: enetCoxPro.t('help.title'),
            r_help: enetCoxPro.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: enetCoxPro.t('help.body')
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

module.exports = {
    render: () => new enetCoxPro().render()
}
