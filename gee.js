



class GEE extends baseModal {
    static dialogId = 'GEE'
    static t = baseModal.makeT(GEE.dialogId)

    constructor() {
        var config = {
            id: GEE.dialogId,
            label: GEE.t('title'),
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
                    label: GEE.t('modellabel'),
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
                    label: GEE.t('depvarlabel'),
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
                    label: GEE.t('formulalabel')
                })
            },
			id: {
                el: new dstVariable(config, {
                    label: GEE.t('idlabel'),
                    no: "id",
                    filter: "Numeric|Scale|String|Nominal|Ordinal",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			waves: {
                el: new dstVariable(config, {
                    label: GEE.t('waveslabel'),
                    no: "waves",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
					wrapped: ", waves=%val%",
					required: false
                })
            },			
            offset: {
                el: new dstVariable(config, {
                    label: GEE.t('offsetlabel'),
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ' + offset(%val%)',
                    extraction: "NoPrefix|UseComma",
                })
            },
            weights: {
                el: new dstVariable(config, {
                    label: GEE.t('weightslabel'),
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
                    label: GEE.t('familylabel'),
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
                    label: GEE.t('workingcorrlabel'),
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
					label: GEE.t('mdeplabel'),
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
                    label: GEE.t('varestlabel'),
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
                    label: GEE.t('thetalabel'),
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
                    label: GEE.t('varpowerlabel'),
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
                    label: GEE.t('linkpowerlabel'),
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
					label: GEE.t('expcoeflabel'),
					no: "expcoef",
					extraction: "Boolean"
				})
			},
			seqterm: {
				el: new checkbox(config, {
					label: GEE.t('seqtermlabel'),
					no: "seqterm",
					newline: true,
					extraction: "Boolean"
				})
			},
		    seqtesttype: {
                el: new selectVar(config, {
                    no: 'seqtesttype',
                    label: GEE.t('seqtesttypelabel'),
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
					label: GEE.t('showworkinglabel'),
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
					label: GEE.t('pearsonreslabel'),
					no: "pearsonres",
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			devianceres: {
				el: new checkbox(config, {
					label: GEE.t('deviancereslabel'),
					no: "devianceres",
					newline: true,
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			mahalres: {
				el: new checkbox(config, {
					label: GEE.t('mahalreslabel'),
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
					label: GEE.t('clusterlevellabel'),
					no: "dfbetacluster",
					style: "ml-3 mt-2",
					extraction: "Boolean"
				})
			},
		    dfbetaclustermethod: {
                el: new selectVar(config, {
                    no: 'dfbetaclustermethod',
                    label: GEE.t('methodlabel'),
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
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('obslevellabel'),
					no: "dfbetaobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
			dfbetaobsvar: {
                el: new input(config, {
                    no: 'dfbetaobsvar',
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('clusterlevellabel'),
					no: "cookscluster",
					style: "ml-3 mt-2",
					extraction: "Boolean"
				})
			},
		    cooksclustermethod: {
                el: new selectVar(config, {
                    no: 'cooksclustermethod',
                    label: GEE.t('methodlabel'),
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
                    label: GEE.t('coeflabel'),
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
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('obslevellabel'),
					no: "cooksobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    cooksobscoef: {
                el: new selectVar(config, {
                    no: 'cooksobscoef',
                    label: GEE.t('coeflabel'),
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
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('clusterlevellabel'),
					no: "leveragecluster",
					style: "ml-3",
					extraction: "Boolean"
				})
			},
			leverageobs: {
				el: new checkbox(config, {
					label: GEE.t('obslevellabel'),
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
                    label: GEE.t('localinftypelabel'),
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
					label: GEE.t('perturbclusterlabel'),
					no: "localinfcluster",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfclustercoef: {
                el: new selectVar(config, {
                    no: 'localinfclustercoef',
                    label: GEE.t('coeflabel'),
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
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('perturbobslabel'),
					no: "localinfobs",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfobscoef: {
                el: new selectVar(config, {
                    no: 'localinfobscoef',
                    label: GEE.t('coeflabel'),
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
                    label: GEE.t('speccoeflabel'),
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
					label: GEE.t('perturbresplabel'),
					no: "localinfresp",
					style: "ml-3 mt-4",
					extraction: "Boolean"
				})
			},
		    localinfrespcoef: {
                el: new selectVar(config, {
                    no: 'localinfrespcoef',
                    label: GEE.t('coeflabel'),
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
                    label: GEE.t('speccoeflabel'),
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
                name: GEE.t('navigation'),
                icon: "icon-link",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: GEE.t('help.title'),
            r_help: GEE.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: GEE.t('help.body')
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

module.exports = {
    render: () => new GEE().render()
}
