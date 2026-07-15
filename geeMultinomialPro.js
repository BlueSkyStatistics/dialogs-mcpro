
var localization = {
    en: {
        title: "Generalized Estimating Equations, Multinomial",
        navigation: "GEE, Multinominal",
		modellabel: "Enter Model Name",
		depvarlabel: "Dependent Variable",
		formulalabel: "Model expression builder",
		idlabel: "Variable to identify clusters",
		repeatedlabel: "Variable for order within clusters (if not specified, assumes data are ordered with no gaps)",
		offsetlabel: "Offset",
		strlabel: "Local odds ratio structure",
		esttypelabel: "Local odds ratio estimation type",
		homogenlabel: "Homogeneous score parameters when time.exch or RC structure",
		addamountlabel: "Positive constant to add if zero observed counts",
		intrinsiclabel: "Show intrinsic parameter estimates",
		convergelabel: "Show convergence information",
		localorlabel: "Show local odds ratio estimate matrix",
        help: {
            title: "Generalized Estimating Equations, Multinomial",
            r_help: "help(nomLORgee, package ='multgee')",
            body: `
This fits a generalized estimating equations model for a multinomial (>2 category) response variable with nominal (unordered) categories.
The robust variance estimator of Liang and Zeger (1986) is used for the model standard errors.  This is a consistent estimator, even if the correlation pattern within clusters has been misspecified.
The model uses the methods of Touloumus et al. (2013)
<br/><br/>
<b>Dependent Variable:</b></br>
The nominal categorical response variable (required).  Can be numeric, nominal, or character. The categories will be ordered by value where the last category will be the 
baseline/reference category for the paramter estimates and odds ratios.<br/><br/>

<b>Model expression builder:</b></br>
Construct the model for the response variable (required)</br></br>

<b>Variable to identify clusters:</b></br>
Specify the variable that identifies the clusters (required).  Observations with the same value will be assigned to the same cluster. Observations with the same value are potentially correlated.  
Observations with different values are uncorrelated.</br></br>

<b>Variable for order within clusters:</b></br>
An optional variable that is used to identify the order of observations within clusters. Can be numeric, character, nominal, or ordinal.  This argument is crucial when there are missing values and gaps 
in the data. As default, it is equal to the integers from 1 to the size of each cluster according to the row-order of the data.  It's highly recommended to specify this parameter to ensure that the correlations are estimated correctly.  For example, If the maximum cluster size is 6 and for a cluster 
of size 4 the values are set to 2, 4, 5, 6, then it means that the data at times 1 and 3 are missing. If in this scenario the parameter is not specified, then the model assumes that the available 
data for this cluster were taken at times 1, 2, 3 and 4.</br></br>

<b>Offset:</b></br>
Specify an optional offset variable. Must be numeric.  This incorporates an independent variable in the model with fixed values.  No coefficient is estimated for this variable and is taken to be 1.</br></br>  

<b>Local odds ratio structure:</b></br>
Specifies the structure of the odds ratios between response variable levels and between within-cluster levels.  See Touloumis et al. (2013) and Touloumis (2015) for more details.
<ul>
	<li>time.exch: time-exchangeable structure.  This assumes a common local odds ratio for all within-cluster pairs but can have different odds ratios between response categories.</li>
	<li>RC: row and column dependent structure.  This assumes different odds ratios for both within-cluster levels and between response categories.</li>
	<li>independence: independence structure.  This assumes the odds ratios are 1 (no relationship) between within-cluster levels and between response categories</li>
</ul>

The RC local odds ratio structure is probably best used only in large sample size cases (say N>100).  Time-exchangeable and RC structures will provide smaller standard errors than independent when covariates can 
differ within clusters.  Use the independent structure as a last resort if non-convergence is an issue with other methods. </br></br>

The Quasi Information Criterion (QIC) (Pan, 2001), the Correlation Information Criterion (CIC) (Hin and Wang, 2009), and the Rotnitzky and Jewell's Criterion (RJC) (Rotnitzky and Jewell, 1990) 
can be used for selecting the the best working association structure.  The QICu criterion (Pan, 2001) can be used for selecting the best subset of covariates.  In all cases, smaller values are preferred.</br></br>

<b>Local odds ratio estimation type:</b></br>
Whether the local odds ratios are estimated simultaneously ("3way") or independently at each within-cluster pair ("2way")</br></br>

<b>Homogeneous score parameters when time.exch or RC structure:</b></br>
Whether homogeneous score parameters are used</br></br>

<b>Positive constant to add if zero observed counts:</b></br>
What number to add to cells in cases of no observed data in the contingency tables that define the local odds ratios.</br></br>

<b>Show intrinsic parameter estimates:</b></br>
Whether to show the intrinsic parameter estimates.  These describe the overall strength of the pairwise associations between the within-cluster levels. 
If the differences between them are small (say <2 (Touloumis et al. (2013)), this suggests that the time-exchangeable local odds ratio structure may be sufficient.
The intrinsic parameters are estimated under the RC-G(1) model (Becker and Clogg, 1989) with homogeneous score parameters.</br></br>

<b>Show convergence information:</b></br>
Whether to show convergence information from the models (number of iterations, criterion value, and whether the model converged). </br></br>

<b>Show local odds ratio estmate matrix:</b></br>
Whether to show the local odds ratio estimates matrix.</br></br>

<b>References:</b></br>
Touloumis A, Agresti A, Kateri M. GEE for Multinomial Responses Using a Local Odds Ratios Parameterization. Biometrics (2013) 69: 633-640.</br></br>
Touloumis A. R Package multgee: A Generalized Estimating Equations Solver for Multnomial Responses. Journal of Statistical Software (2015), Volume 64, Issue 8.</br></br>

<b>Required R Packages:</b> multgee, broom.helpers, tidyverse
			`}
    }
}









class geeMultinomialPro extends baseModal {
    constructor() {
        var config = {
            id: "geeMultinomialPro",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(multgee)
library(broom.helpers)
library(tidyverse)

{{selected.modelname | safe}} <- nomLORgee({{selected.depvar | safe}} ~ {{selected.formula | safe}}{{selected.offset | safe}}, data={{dataset.name}}, id={{selected.id | safe}}{{selected.repeated | safe}},
                LORstr="{{selected.str | safe}}", LORem="{{selected.esttype | safe}}", add={{selected.addamount | safe}}, homogeneous={{selected.homogen | safe}})
				
# model information
mod_info <- data.frame(Link={{selected.modelname | safe}}$link, 
					  Structure={{selected.modelname | safe}}$local.odds.ratios$structure,
                      Model="{{selected.esttype | safe}}",
                      Homogeneous_scores={{selected.modelname | safe}}$local.odds.ratios$homogeneous,
                      Adding_constant="{{selected.addamount | safe}}",
                      N={{selected.modelname | safe}}$nobs,
                      Number_clusters={{selected.modelname | safe}}$max.id,
                      Min_cluster_size=min({{selected.modelname | safe}}$clusz),
                      Max_cluster_size=max({{selected.modelname | safe}}$clusz),
                      Number_categories={{selected.modelname | safe}}$categories)

# convergence
convergence_info <- data.frame(Num_iterations={{selected.modelname | safe}}$convergence$niter,
                              Criterion={{selected.modelname | safe}}$convergence$criterion,
                              Converged=as.character({{selected.modelname | safe}}$convergence$conv))

# paramester estimates
param_est <- tidy_multgee({{selected.modelname | safe}}) %>%
	dplyr::select(-conf.level, -df.error, -original_term) %>%
	relocate(y.level)

# null model p-value
null_pvalue <- data.frame(p.value={{selected.modelname | safe}}$pvalue)

# odds ratio estimates
or_est <- tidy_multgee({{selected.modelname | safe}}, exponentiate=TRUE) %>%
	dplyr::select(-conf.level, -df.error, -original_term, -std.error, -statistic) %>%
	relocate(y.level) %>%
	filter(term != "(Intercept)")

{{if (options.selected.intrinsic == "TRUE")}}
# intrinsic parameter estimates
intrinsic_param <- intrinsic.pars(y={{selected.depvar | safe}}, data={{dataset.name}}, id={{selected.id | safe}}{{selected.repeated | safe}}, rscale="nominal")
{{/if}}

# local odds ratio estimates
local_ors <- {{selected.modelname | safe}}$local.odds.ratios$theta
dimnames(local_ors) <- list(1:nrow(local_ors), 1:ncol(local_ors))

BSkyFormat(t(mod_info), singleTableOutputHeader="Model Summary for {{selected.depvar | safe}}")
BSkyFormat(gee_criteria({{selected.modelname | safe}}), singleTableOutputHeader="Model Fit Statistics")
{{if (options.selected.intrinsic == "TRUE")}}
BSkyFormat(intrinsic_param, singleTableOutputHeader="Intrinsic Parameter Estimates")
{{/if}}
{{if (options.selected.converge == "TRUE")}}
BSkyFormat(convergence_info, singleTableOutputHeader="Convergence Summary")
{{/if}}
BSkyFormat(param_est, singleTableOutputHeader="Parameter Estimates and 95% Confidence Intervals")
BSkyFormat(null_pvalue, singleTableOutputHeader="p-value of Null model")
BSkyFormat(or_est, singleTableOutputHeader="Odds Ratios and 95% Confidence Intervals")
{{if (options.selected.localor == "TRUE")}}
BSkyFormat(local_ors, singleTableOutputHeader="Local Odds Ratio Estimates")
{{/if}}				

`
        };
        var objects = {

			modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modellabel,
                    placeholder: "",
                    value:"GEEModel1",
					enforceRobjectRules:true,
                    extraction: "TextAsIs",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },		
			content_var: {
				el: new srcVariableList(config, {
					action: "copy"
				}) 
			},
			depvar: {
                el: new dstVariable(config, {
                    label: localization.en.depvarlabel,
                    no: "depvar",
                    filter: "Numeric|Scale|Nominal|String",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },			
            formula: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true,
                    label: localization.en.formulalabel
                })
            },
			id: {
                el: new dstVariable(config, {
                    label: localization.en.idlabel,
                    no: "id",
                    filter: "Numeric|Scale|String|Nominal|Ordinal",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			repeated: {
                el: new dstVariable(config, {
                    label: localization.en.repeatedlabel,
                    no: "repeated",
                    filter: "Numeric|Scale|Nominal|String",
                    extraction: "NoPrefix|UseComma",
					wrapped: ", repeated=%val%",
					required: false
                })
            },			
            offset: {
                el: new dstVariable(config, {
                    label: localization.en.offsetlabel,
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ' + offset(%val%)',
                    extraction: "NoPrefix|UseComma",
                })
            },
		    str: {
                el: new selectVar(config, {
                    no: 'str',
                    label: localization.en.strlabel,
                    multiple: false,
					width: "w-50",
					style: "mt-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["time.exch", "RC", "independence"],
                    default: "time.exch",
					required: true
                })
            },			
		    esttype: {
                el: new selectVar(config, {
                    no: 'esttype',
                    label: localization.en.esttypelabel,
                    multiple: false,
					width: "w-25",
                    extraction: "NoPrefix|UseComma",
                    options: ["3way", "2way"],
                    default: "3way",
					required: true
                })
            },			
			homogen: {
				el: new checkbox(config, {
					label: localization.en.homogenlabel,
					no: "homogen",
					state: "checked",
					extraction: "Boolean"
				})
			},
			addamount: {
                el: new input(config, {
                    no: 'addamount',
                    label: localization.en.addamountlabel,
                    value: ".0001",
                    type: "numeric",
					allow_spaces: true,
					style: "mt-2 mb-3",
					width: "w-25",
                    extraction: "TextAsIs",
					required: true
                })
            },
			intrinsic: {
				el: new checkbox(config, {
					label: localization.en.intrinsiclabel,
					no: "intrinsic",
					newline: true,
					extraction: "Boolean"
				})
			},			
			converge: {
				el: new checkbox(config, {
					label: localization.en.convergelabel,
					no: "converge",
					newline: true,
					extraction: "Boolean"
				})
			},
			localor: {
				el: new checkbox(config, {
					label: localization.en.localorlabel,
					no: "localor",
					extraction: "Boolean"
				})
			}
			
		}

        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.depvar.el.content, objects.formula.el.content, objects.id.el.content, objects.repeated.el.content, objects.offset.el.content,
					objects.str.el.content, objects.esttype.el.content, objects.homogen.el.content, objects.addamount.el.content,
					objects.intrinsic.el.content, objects.converge.el.content, objects.localor.el.content],					
            nav: {
                name: localization.en.navigation,
                icon: "icon-link",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new geeMultinomialPro().render()