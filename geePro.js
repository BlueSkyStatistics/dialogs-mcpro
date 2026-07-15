var localization = {
    en: {
        title: "Generalized Estimating Equations",
        navigation: "GEE",
		modellabel: "Enter Model Name",
		depvarlabel: "Dependent Variable",
		formulalabel: "Model expression builder",
		idlabel: "Variable to identify clusters",
		waveslabel: "Variable for order and spacing within clusters",
		offsetlabel: "Offset",
		weightslabel: "Weights",
		familylabel: "Select a family and link function",
		workingcorrlabel: "Working correlation structure",
		mdeplabel: "m for M-dependent correlation structure",
		varestlabel: "Variance estimator",
		thetalabel: "Negative binomial theta parameter (theta>0, required if negative binomial family, smaller value=more dispersion, larger value=less dispersion)",
		varpowerlabel: "Tweedie variance power (required if tweedie family)",
		linkpowerlabel: "Tweedie link power (required if tweedie family)",
		expcoeflabel: "Exponentiate coefficients",
		seqtermlabel: "Sequential model term ANOVA tests",
		seqtesttypelabel: "ANOVA test type",
		showworkinglabel: "Show working correlation matrix",
		pearsonreslabel: "Pearson residuals vs fitted values",
		deviancereslabel: "Deviance residuals vs fitted values",
		mahalreslabel: "Mahalanobis residuals vs cluster index",
		clusterlevellabel: "Cluster level",
		obslevellabel: "Observation level",
		methodlabel: "Method",
		coeflabel: "Coefficients",
		speccoeflabel: "Specify coefficients (only one string allowed, all model parameters that (partially) match will be included)",
		localinftypelabel: "Type",
		perturbclusterlabel: "Case weight perturbation of clusters",
		perturbobslabel: "Case weight perturbation of observations",
		perturbresplabel: "Perturbation of response",
        help: {
            title: "Generalized Estimating Equations",
            r_help: "help(glmgee, package ='glmtoolbox')",
            body: `
This dialog fits generalized estimating equations models (GEE) models for a wide range of distributions.  These models estimate marginal effects of parameters on the outcome while 
adjusting for the potential correlation of observations within clusters.
<br/><br/>

<b>Dependent Variable:</b></br>
Outcome variable for the model (required). Can be numeric or factor. </br></br>

<b>Model exression builder:</b> </br>
Construct the model for the mean response (required)</br></br>

<b>Variable to identify clusters:</b></br>
Specify the variable that identifies the clusters (required).  Observations with the same value will be assigned to the same cluster. Observations with the same value are potentially correlated.  
Observations with different values are uncorrelated.</br></br>

<b>Variable for order and spacing within clusters:</b></br>
An optional positive integer-valued variable that is used to identify the order and spacing of observations within clusters. Must be numeric.  This argument is crucial when there are missing values and gaps 
in the data. As default, it is equal to the integers from 1 to the size of each cluster according to the row-order of the data.  For correlation structures that depend on within-cluster order
and relative spacing, it's highly recommended to specify this parameter to ensure that the correlations are estimated correctly.  For example, If the maximum cluster size is 6 and for a cluster 
of size 4 the values are set to 2, 4, 5, 6, then it means that the data at times 1 and 3 are missing, which should be taken into account when the structure of the correlation 
matrix is assumed to be "Unstructured", "Stationary-M-dependent", "Non-Stationary-M-dependent" or "AR-M-dependent". If in this scenario the parameter is not specified, then the model assumes that the available 
data for this cluster were taken at times 1, 2, 3 and 4.</br></br>

<b>Offset:</b></br>
Specify an optional offset variable. Must be numeric.  This incorporates an independent variable in the model with fixed values.  No coefficient is estimated for this variable and is taken to be 1.</br></br>  

<b>Weights:</b></br>
Specify an optional weights variable.  Must be numeric.  This specifies positive "prior weights" to be used in the fitting process.</br></br>

<b>Working correlation structure:</b></br>
This specifies the working-correlation structure. The possible values are:</br>
<ul>
	<li>"Indepedence": assumes observations in the same cluster are independent (correlation=0)</li>
	<li>"Unstructured": assumes all pairs of observations in the same cluster have a different correlation</li>
	<li>"Stationary-M-dependent(m)": Assumes pairs of observations in the same cluster are correlated within m levels of each other. For observations m levels apart, a separate, fixed correlation is estimated for each value of m.
	This correlation does not depend on the specific pair of levels.  Observations more than m-levels apart are considered uncorrelated.</li>
	<li>"Non-Stationary-M-dependent(m)": Assumes pairs of observations in the same cluster are correlated within m levels of each other.  For observations m levels apart, separate correlations are estimated for each value of m
	and the specific pair of levels. Observations more than m-levels apart are considered uncorrelated.</li>
	<li>"AR-M-dependent(m)": Assumes all pairs of observations in the same cluster are correlated.  The correlation decreases as the number of levels between pairs increases.  All pairs m levels
	apart have equal correlation.  m controls how fast the correlation decreases with increasing level distance between pairs.</li>
	<li>"Exchangeable (default)": Assumes all pairs of observations in the same cluster are correlated.  All pairs have the same correlation, no matter how many levels apart the pairs are.</li>
</ul>
</br></br>

<b>m for M-dependent correlation structure:</b></br>
This specifies the lag of the dependence between levels in the same cluster for correlation structures that account for distance.</br></br>

<b>Variance estimator:</b></br>
This specifies the estimation method for the variance/covariance matrix of the model coefficients.  The possible values are:</br>
<ul>
	<li>"robust" (default): This is the robust "sandwich" estimator from Liang and Zeger (1996). It is robust to misspecification of the working correlation matrix. It is a consistent estimator provided that the mean model
	is correctly specified.</li>
	<li>"df-adjusted"</li>
	<li>"bias-corrected": This is the bias-corrected estimator from Mancl and DeRouen (2001).  It is robust to misspecification of the working correlation matrix, and is very useful when the sample size is "small" due to its improved finite sample properties.</li>
	<li>"model": This is the model-based (naive) estimator.</li>
</ul>

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
Whether to compute exp(coefficient) and confidence intervals.  Useful for log and logit link functions (e.g. odds ratios in logistic models, incidence rate ratios in Poisson models)</br></br>

<b>Sequential model term ANOVA tests:</b></br>
Whether to compute sequential nested model tests for all model terms. Order of entry into the model formula dictates the models tested.  Wald and score tests are options. </br></br>

<b>Show working correlation matrix:</b></br>
Whether to show the working correlation matrix used in the models.  Large number of levels within clusters will produce large matrices for display purposes. Can be useful as one thinks about appropriate correlation structures.</br></br>

<b>Residual Plots:</b></br>
Whether to produce diagnostic plots of Pearson, Deviance, or Mahalanobis residuals. Pearson and Deviance residual plots can be useful to assess goodness-of-fit at the observation level, 
e.g. whether the variance function specified aqequately represents the data dispersion.  Mahalanobis residual plots can be useful to assess goodness-of-fit at the cluster level.</br></br>

<b>Dfbeta Plots:</b></br>
Whether to produce Dfbeta diagnostic plots. Dfbeta plots are useful to assess whether removing a cluster ("cluster level") or an observation ("observation level") changes the coefficient estimates by relatively large amounts as a measure of influence.  
These can be done for specific coefficients only.
Specify the coefficients to get measures for specific coefficients.
Two methods are provided for Dfbeta computation: the one-step approximation from Preisser and Qaqish (1996) in which the working-correlation is assumed to be known, and the "authentic"
one-step approximation ("full").  The Preisser and Qaquish method is only available for observation-level Dfbetas.</br></br>

<b>Cook's Distance Plots:</b></br>
Whether to produce Cooks' distance diagnostic plots. Cook's distance plots are useful to assess whether removing a cluster ("cluster level") or an observation ("observation level") changes the coefficient estimates by relatively large amounts as a measure of influence.  
Cook's distance scales the difference in the coefficients by the variance.  These can be done for all coefficients together or for specific coefficients.
The default is all coefficients.  Select "specific coefficients" and specify the coefficients to get measures for specific coefficients.
Two methods are provided for Cooks' distance computation: the one-step approximation from Preisser and Qaqish (1996) in which the working-correlation is assumed to be known, and the "authentic"
one-step approximation ("full").  The Preisser and Qaquish method is only available for observation-level Cook's distances.</br></br>

<b>Leverage Plots:</b></br>
Whether to produce diagnostic leverage plots at the cluster level or the observation level. </br></br>

<b>Local Infludence Plots:</b></br>
Whether to produce local influence plots based on the approach by Cook (1986).
Two types of local influence are provided: "total" and "local" ("total" is the default).    
Case weight cluster perturbations, case weight observation perturbations, and response perturbations options are provided.
These can be done for all coefficients together or for specific coefficients.
The default is all coefficients.  Select "specific coefficients" and specify the coefficients to get measures for specific coefficients. 
See Cook (1986), Assessment of local influence. Journal of the Royal Staistical Society. Series B (Methodological) 48: 133-169 for details. </br></br>

</br></br>
References: </br></br>
Vanegas, et al., "Generalized Estimating Equations using the new R package glmtoolbox", The R Journal, 2023 </br></br>
Smyth, et al. R statmod package documentation</br></br>
See <a href="https://journal.r-project.org/articles/RJ-2023-056/">Vanegas, et al.</a> for more information on the supported distributions, correlation structures, and other statistical details.
<br/><br/>
<b>R Packages Required:</b> glmtoolbox, broom, MASS, statmod
			`}
    }
}



class geePro extends baseModal {
    constructor() {
        var config = {
            id: "geePro",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(glmtoolbox)
library(broom)
library(MASS)
library(statmod)

# fit model
{{if (options.selected.family == "tweedie")}}
{{selected.modelname | safe}} <- glmgee({{selected.depvar | safe}} ~ {{selected.formula | safe}}{{selected.offset | safe}}, 
		data={{dataset.name}}, family=tweedie(var.power={{selected.varpower | safe}}, link.power={{selected.linkpower | safe}}), id={{selected.id | safe}}, corstr="{{selected.workingcorrfinal | safe}}", na.action=na.exclude{{selected.waves | safe}}{{selected.weights | safe}} )
{{#else}}
{{selected.modelname | safe}} <- glmgee({{selected.depvar | safe}} ~ {{selected.formula | safe}}{{selected.offset | safe}}, 
		data={{dataset.name}}, family={{selected.family | safe}}(link="{{selected.combokid | safe}}"{{selected.theta | safe}}), id={{selected.id | safe}}, corstr="{{selected.workingcorrfinal | safe}}", na.action=na.exclude{{selected.waves | safe}}{{selected.weights | safe}} )
{{/if}}

# model output
BSkyFormat(as.data.frame(glance({{selected.modelname | safe}})), 
           singleTableOutputHeader="GEE Model Summary for {{selected.depvar | safe}}")

BSkyFormat(as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE, varest="{{selected.varest | safe}}")),
           singleTableOutputHeader="Parameter Estimates and 95% Confidence Intervals")

BSkyFormat(data.frame(dispersion={{selected.modelname | safe}}$phi), singleTableOutputHeader="Dispersion")

# model fit statistics
modfit <- data.frame(Statistic=c("Quasi-likelihood under Independence model Criterion (QIC)",
                                 "Correlation Information Criterion (CIC)",
                                 "Gosho-Hamada-Yoshimura’s Criterion (GHYC)",
                                 "Pardo-Alonso’s Criterion (PAC)",
                                 "Rotnitzky-Jewell’s Criterion (RJC)",
                                 "Akaike-type penalized Gaussian Pseudo-likelihood Criterion (AGPC)",
                                 "Schwarz-type penalized Gaussian Pseudo-likelihood Criterion (SGPC)"),
                     Value=c(QIC=QIC({{selected.modelname | safe}}), CIC=CIC({{selected.modelname | safe}}), GHYC({{selected.modelname | safe}}), PAC({{selected.modelname | safe}}), RJC({{selected.modelname | safe}}), AGPC({{selected.modelname | safe}}), SGPC({{selected.modelname | safe}})))
BSkyFormat(modfit, singleTableOutputHeader="Model Fit Statistics")                       

{{if (options.selected.seqterm == "TRUE")}}
# sequential anova tests
anova({{selected.modelname | safe}}, test="{{selected.seqtesttype | safe}}", varest="{{selected.varest | safe}}")
{{/if}}

{{if (options.selected.expcoef == "TRUE")}}
# exponentiated coefficients
BSkyFormat(as.data.frame(tidy({{selected.modelname | safe}}, exponentiate=TRUE, conf.int=TRUE, varest="{{selected.varest | safe}}")),
           singleTableOutputHeader="Exponentiated Parameter Estimates and 95% Confidence Intervals")
{{/if}}

{{if (options.selected.showworking == "TRUE")}}
# working correlation matrix
BSkyFormat({{selected.modelname | safe}}$corr, singleTableOutputHeader="Working Correlation Matrix")
{{/if}}

{{if (options.selected.pearsonres == "TRUE")}}
# Pearson residuals
pearson_resid <- residuals({{selected.modelname | safe}}, type="pearson", plot.it=TRUE, main="Pearson Residuals")
{{/if}}
{{if (options.selected.devianceres == "TRUE")}}
# deviance residuals
dev_resid <- residuals({{selected.modelname | safe}}, type="deviance", plot.it=TRUE, main="Deviance Residuals")
{{/if}}
{{if (options.selected.mahalres == "TRUE")}}
# Mahalanobis residuals
mah_resid <- residuals({{selected.modelname | safe}}, type="mahalanobis", plot.it=TRUE, main="Mahalanobis Residuals")
{{/if}}

{{if (options.selected.dfbetacluster == "TRUE" & options.selected.dfbetaclustervar != "")}}
# dfbeta, cluster level, specific coefficients
dfbeta_plot <- dfbeta({{selected.modelname | safe}}, level="clusters", method="{{selected.dfbetaclustermethod | safe}}", coefs="{{selected.dfbetaclustervar | safe}}", ylab="Dfbeta")
{{/if}}
{{if (options.selected.dfbetaobs == "TRUE" & options.selected.dfbetaobsvar != "")}}
# dfbeta, observation level, specific coefficients
dfbeta_plot <- dfbeta({{selected.modelname | safe}}, level="observations", method="Preisser-Qaqish", coefs="{{selected.dfbetaobsvar | safe}}", ylab="Dfbeta")
{{/if}}

{{if (options.selected.cookscluster == "TRUE" & options.selected.cooksclustercoef == "All coefficients")}}
# Cook's distance, cluster level, all coefficients
cooksdist_plot <- cooks.distance({{selected.modelname | safe}}, level="clusters", method="{{selected.cooksclustermethod | safe}}", plot.it=TRUE, varest="{{selected.varest | safe}}", ylab="Cook's Distance")
{{/if}}
{{if (options.selected.cookscluster == "TRUE" & options.selected.cooksclustercoef == "Specific coefficients" & options.selected.cooksclustervar != "")}}
# Cook's distance, cluster level, specific coefficients
cooksdist_plot <- cooks.distance({{selected.modelname | safe}}, level="clusters", method="{{selected.cooksclustermethod | safe}}", plot.it=TRUE, varest="{{selected.varest | safe}}", coefs="{{selected.cooksclustervar | safe}}", ylab="Cook's Distance")
{{/if}}
{{if (options.selected.cooksobs == "TRUE" & options.selected.cooksobscoef == "All coefficients")}}
# Cook's distance, observation level, all coefficients
cooksdist_plot <- cooks.distance({{selected.modelname | safe}}, level="observations", method="Preisser-Qaqish", plot.it=TRUE, varest="{{selected.varest | safe}}", ylab="Cook's Distance")
{{/if}}
{{if (options.selected.cooksobs == "TRUE" & options.selected.cooksobscoef == "Specific coefficients" & options.selected.cooksobsvar != "")}}
# Cook's distance, observation level, specific coefficients
cooksdist_plot <- cooks.distance({{selected.modelname | safe}}, level="observations", method="Preisser-Qaqish", plot.it=TRUE, varest="{{selected.varest | safe}}", coefs="{{selected.cooksobsvar | safe}}", ylab="Cook's Distance")
{{/if}}

{{if (options.selected.leveragecluster == "TRUE")}}
# leverage, cluster level
leverage_plot <- leverage({{selected.modelname | safe}}, level="cluster", plot.it=TRUE, main="Leverage")
{{/if}}
{{if (options.selected.leverageobs == "TRUE")}}
# leverage, observation level
leverage_plot <- leverage({{selected.modelname | safe}}, level="observations", plot.it=TRUE, main="Leverage")
{{/if}}

{{if (options.selected.localinfcluster == "TRUE" & options.selected.localinfclustercoef == "All coefficients")}}
# local influence, cluster perturbations, all coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="cw-clusters",
                                plot.it=TRUE, main="Local Influence")
{{/if}}

{{if (options.selected.localinfcluster == "TRUE" & options.selected.localinfclustercoef == "Specific coefficients" & options.selected.localinfclustervar != "")}}
# local influence, cluster perturbations, specific coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="cw-clusters",
                                coefs="{{selected.localinfclustervar | safe}}", plot.it=TRUE, main="Local Influence")
{{/if}}

{{if (options.selected.localinfobs == "TRUE" & options.selected.localinfobscoef == "All coefficients")}}
# local influence, observation perturbations, all coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="cw-observations",
                                plot.it=TRUE, main="Local Influence")
{{/if}}

{{if (options.selected.localinfobs == "TRUE" & options.selected.localinfobscoef == "Specific coefficients" & options.selected.localinfobsvar != "")}}
# local influence, observation perturbations, specific coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="cw-observations",
                                coefs="{{selected.localinfobsvar | safe}}", plot.it=TRUE, main="Local Influence")
{{/if}}

{{if (options.selected.localinfresp == "TRUE" & options.selected.localinfrespcoef == "All coefficients")}}
# local influence, response perturbations, all coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="response",
                                plot.it=TRUE, main="Local Influence")
{{/if}}

{{if (options.selected.localinfresp == "TRUE" & options.selected.localinfrespcoef == "Specific coefficients" & options.selected.localinfrespvar != "")}}
# local influence, response perturbations, specific coefficients
localinf_plot <- localInfluence({{selected.modelname | safe}}, type="{{selected.localinftype | safe }}", perturbation="response",
                                coefs="{{selected.localinfrespvar | safe}}", plot.it=TRUE, main="Local Influence")
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
                    filter: "Numeric|Scale|Nominal",
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
			waves: {
                el: new dstVariable(config, {
                    label: localization.en.waveslabel,
                    no: "waves",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					wrapped: ", waves=%val%",
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
            weights: {
                el: new dstVariable(config, {
                    label: localization.en.weightslabel,
                    no: "weights",
                    filter: "Numeric|Scale",
					wrapped: ', weights=%val%',
                    extraction: "NoPrefix|UseComma"
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
                        { "name": "negative.binomial", "value": ["log", "identity", "sqrt"] },
                        { "name": "poisson", "value": [ "log","identity", "sqrt"] },
                        { "name": "quasi", "value": [ "logit","probit","cloglog","identity","inverse", "log", "1/mu^2","sqrt" ] },
						{ "name": "quasibinomial", "value": ["logit", "probit", "cauchit","log","cloglog"] },
						{ "name": "quasipoisson", "value": [ "log","identity", "sqrt"] },
						{ "name": "tweedie", "value": [ " " ] }
                    ]
                })
            },
		    workingcorr: {
                el: new selectVar(config, {
                    no: 'workingcorr',
                    label: localization.en.workingcorrlabel,
                    multiple: false,
					width: "w-50",
                    extraction: "NoPrefix|UseComma",
                    options: ["Independence", "Unstructured", "Stationary-M-dependent(m)", "Non-Stationary-M-dependent(m)", "AR-M-dependent(m)", "Exchangeable"],
                    default: "Exchangeable",
					required: true
                })
            },
			mdep: {
				el: new inputSpinner(config, {
					no: 'mdep',
					label: localization.en.mdeplabel,
					min: 1,
					max: 100000,
					step: 1,
					value: 1,
					extraction: "NoPrefix|UseComma"
				})
			},
		    varest: {
                el: new selectVar(config, {
                    no: 'varest',
                    label: localization.en.varestlabel,
                    multiple: false,
					width: "w-25",
                    extraction: "NoPrefix|UseComma",
                    options: ["robust", "df-adjusted", "bias-corrected", "model"],
                    default: "robust",
					required: true
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
					extraction: "Boolean"
				})
			},
			seqterm: {
				el: new checkbox(config, {
					label: localization.en.seqtermlabel,
					no: "seqterm",
					newline: true,
					extraction: "Boolean"
				})
			},
		    seqtesttype: {
                el: new selectVar(config, {
                    no: 'seqtesttype',
                    label: localization.en.seqtesttypelabel,
                    multiple: false,
					width: "w-25",
					style: "ml-5",
                    extraction: "NoPrefix|UseComma",
                    options: ["wald", "score"],
                    default: "wald",
					required: false
                })
            },
			showworking: {
				el: new checkbox(config, {
					label: localization.en.showworkinglabel,
					no: "showworking",
					extraction: "Boolean"
				})
			},
			reslabel: {
				el: new labelVar(config, {
					label: "Residual Plots", 
					h:5
				})
			},
			pearsonres: {
				el: new checkbox(config, {
					label: localization.en.pearsonreslabel,
					no: "pearsonres",
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			devianceres: {
				el: new checkbox(config, {
					label: localization.en.deviancereslabel,
					no: "devianceres",
					newline: true,
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			mahalres: {
				el: new checkbox(config, {
					label: localization.en.mahalreslabel,
					no: "mahalres",
					newline: true,
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			
			dfbetalabel: {
				el: new labelVar(config, {
					label: "Dfbeta Plots",
					style: "mt-4",
					h:5
				})
			},			
			dfbetacluster: {
				el: new checkbox(config, {
					label: localization.en.clusterlevellabel,
					no: "dfbetacluster",
					style: "ml-3 mt-2",
					extraction: "Boolean"
				})
			},
		    dfbetaclustermethod: {
                el: new selectVar(config, {
                    no: 'dfbetaclustermethod',
                    label: localization.en.methodlabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["Preisser-Qaqish", "full"],
                    default: "Preisser-Qaqish",
					required: false
                })
            },
			dfbetaclustervar: {
                el: new input(config, {
                    no: 'dfbetaclustervar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-4",
                    extraction: "TextAsIs",
                })
            },


			dfbetaobs: {
				el: new checkbox(config, {
					label: localization.en.obslevellabel,
					no: "dfbetaobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
			dfbetaobsvar: {
                el: new input(config, {
                    no: 'dfbetaobsvar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-4",
                    extraction: "TextAsIs",
                })
            },	


			cookslabel: {
				el: new labelVar(config, {
					label: "Cook's Distance Plots",
					style: "mt-4",
					h:5
				})
			},			
			cookscluster: {
				el: new checkbox(config, {
					label: localization.en.clusterlevellabel,
					no: "cookscluster",
					style: "ml-3 mt-2",
					extraction: "Boolean"
				})
			},
		    cooksclustermethod: {
                el: new selectVar(config, {
                    no: 'cooksclustermethod',
                    label: localization.en.methodlabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["Preisser-Qaqish", "full"],
                    default: "Preisser-Qaqish",
					required: false
                })
            },
		    cooksclustercoef: {
                el: new selectVar(config, {
                    no: 'cooksclustercoef',
                    label: localization.en.coeflabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["All coefficients", "Specific coefficients"],
                    default: "All coefficients",
					required: false
                })
            },
			cooksclustervar: {
                el: new input(config, {
                    no: 'cooksclustervar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-5",
                    extraction: "TextAsIs",
                })
            },


			cooksobs: {
				el: new checkbox(config, {
					label: localization.en.obslevellabel,
					no: "cooksobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    cooksobscoef: {
                el: new selectVar(config, {
                    no: 'cooksobscoef',
                    label: localization.en.coeflabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["All coefficients", "Specific coefficients"],
                    default: "All coefficients",
					required: false
                })
            },
			cooksobsvar: {
                el: new input(config, {
                    no: 'cooksobsvar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-5",
                    extraction: "TextAsIs",
                })
            },

			leveragelabel: {
				el: new labelVar(config, {
					label: "Leverage Plots",
					style: "mt-4",
					h:5
				})
			},	
			leveragecluster: {
				el: new checkbox(config, {
					label: localization.en.clusterlevellabel,
					no: "leveragecluster",
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			leverageobs: {
				el: new checkbox(config, {
					label: localization.en.obslevellabel,
					no: "leverageobs",
					newline: true,
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			
			localinflabel: {
				el: new labelVar(config, {
					label: "Local Influence Plots",
					style: "mt-4",
					h:5
				})
			},		
		    localinftype: {
                el: new selectVar(config, {
                    no: 'localinftype',
                    label: localization.en.localinftypelabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4 mt-2",
                    extraction: "NoPrefix|UseComma",
                    options: ["total", "local"],
                    default: "total",
					required: false
                })
            },
			
			localinfcluster: {
				el: new checkbox(config, {
					label: localization.en.perturbclusterlabel,
					no: "localinfcluster",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfclustercoef: {
                el: new selectVar(config, {
                    no: 'localinfclustercoef',
                    label: localization.en.coeflabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["All coefficients", "Specific coefficients"],
                    default: "All coefficients",
					required: false
                })
            },
			localinfclustervar: {
                el: new input(config, {
                    no: 'localinfclustervar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-5",
                    extraction: "TextAsIs",
                })
            },			

			localinfobs: {
				el: new checkbox(config, {
					label: localization.en.perturbobslabel,
					no: "localinfobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfobscoef: {
                el: new selectVar(config, {
                    no: 'localinfobscoef',
                    label: localization.en.coeflabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["All coefficients", "Specific coefficients"],
                    default: "All coefficients",
					required: false
                })
            },
			localinfobsvar: {
                el: new input(config, {
                    no: 'localinfobsvar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-5",
                    extraction: "TextAsIs",
                })
            },

			localinfresp: {
				el: new checkbox(config, {
					label: localization.en.perturbresplabel,
					no: "localinfresp",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfrespcoef: {
                el: new selectVar(config, {
                    no: 'localinfrespcoef',
                    label: localization.en.coeflabel,
                    multiple: false,
					width: "w-25",
					style: "ml-4",
                    extraction: "NoPrefix|UseComma",
                    options: ["All coefficients", "Specific coefficients"],
                    default: "All coefficients",
					required: false
                })
            },
			localinfrespvar: {
                el: new input(config, {
                    no: 'localinfrespvar',
                    label: localization.en.speccoeflabel,
                    placeholder: "",
                    type: "character",
					allowspacesNew: false,
					width: "w-50",
					style: "ml-5",
                    extraction: "TextAsIs",
                })
            }			
		}
		
		var resdiagnosticspanel = {
            el: new optionsVar(config, {
                no: "resdiagnosticspanel",
                name: "Diagnostics - Residuals",
                content: [
                    objects.reslabel.el,
					objects.pearsonres.el, objects.devianceres.el, objects.mahalres.el
					]
				})
		}

		var dfbetadiagnosticspanel = {
            el: new optionsVar(config, {
                no: "dfbetadiagnosticspanel",
                name: "Diagnostics - Dfbeta",
                content: [
					objects.dfbetalabel.el,
					objects.dfbetacluster.el, objects.dfbetaclustermethod.el, objects.dfbetaclustervar.el,
					objects.dfbetaobs.el, objects.dfbetaobsvar.el
					]
				})
		}

		var cooksdiagnosticspanel = {
            el: new optionsVar(config, {
                no: "cooksdiagnosticspanel",
                name: "Diagnostics - Cook's Distance",
                content: [
					objects.cookslabel.el,
					objects.cookscluster.el, objects.cooksclustermethod.el, objects.cooksclustercoef.el, objects.cooksclustervar.el,
					objects.cooksobs.el, objects.cooksobscoef.el, objects.cooksobsvar.el
					]
				})
		}
		
		var levdiagnosticspanel = {
            el: new optionsVar(config, {
                no: "levdiagnosticspanel",
                name: "Diagnostics - Leverage",
                content: [
					objects.leveragelabel.el,
					objects.leveragecluster.el, objects.leverageobs.el
					]
				})
		}		
		
		var localinfdiagnosticspanel = {
            el: new optionsVar(config, {
                no: "localinfdiagnosticspanel",
                name: "Diagnostics - Local Influence",
                content: [
                    objects.localinflabel.el,
					objects.localinftype.el,
					objects.localinfcluster.el, objects.localinfclustercoef.el, objects.localinfclustervar.el,
					objects.localinfobs.el, objects.localinfobscoef.el, objects.localinfobsvar.el,
					objects.localinfresp.el, objects.localinfrespcoef.el, objects.localinfrespvar.el]
				})
		}		
		
			
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.depvar.el.content, objects.formula.el.content, objects.id.el.content, objects.waves.el.content, objects.offset.el.content, objects.weights.el.content,
					objects.workingcorr.el.content, objects.mdep.el.content, objects.varest.el.content],
			bottom: [objects.family.el.content, objects.theta.el.content, objects.varpower.el.content, objects.linkpower.el.content, objects.expcoef.el.content, objects.seqterm.el.content, objects.seqtesttype.el.content, objects.showworking.el.content,
					resdiagnosticspanel.el.content, dfbetadiagnosticspanel.el.content, cooksdiagnosticspanel.el.content, levdiagnosticspanel.el.content, localinfdiagnosticspanel.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-link",
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
		
		let workcorrapp=code_vars.selected.workingcorr
		let mdepapp=code_vars.selected.mdep

		let workingcorrfinal=workcorrapp.replace("m", mdepapp)
	
		//create new variables under code_vars
		code_vars.selected.workingcorrfinal = workingcorrfinal
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new geePro().render()