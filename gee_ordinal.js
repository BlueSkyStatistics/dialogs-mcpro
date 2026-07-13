










class gee_ordinal extends baseModal {
    static dialogId = 'gee_ordinal'
    static t = baseModal.makeT(gee_ordinal.dialogId)

    constructor() {
        var config = {
            id: gee_ordinal.dialogId,
            label: gee_ordinal.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(multgee)
library(broom.helpers)
library(tidyverse)

{{selected.modelname | safe}} <- ordLORgee({{selected.depvar | safe}} ~ {{selected.formula | safe}}{{selected.offset | safe}}, data={{dataset.name}}, id={{selected.id | safe}}{{selected.repeated | safe}},
											link="{{selected.linkfunc | safe}}", LORstr="{{selected.str | safe}}", LORem="{{selected.esttype | safe}}", add={{selected.addamount | safe}}, homogeneous={{selected.homogen | safe}}, restricted={{selected.restrict | safe}})
				
# model information
mod_info <- data.frame(Link={{selected.modelname | safe}}$link, Structure={{selected.modelname | safe}}$local.odds.ratios$structure,
                      Model="{{selected.esttype | safe}}",
                      Homogeneous_scores={{selected.homogen | safe}},
					  Monotone_scores={{selected.restrict | safe}},
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
	dplyr::select(-conf.level, -df.error, -original_term)

# null model p-value
null_pvalue <- data.frame(p.value={{selected.modelname | safe}}$pvalue)

{{if (options.selected.expparm == "TRUE")}}
# odds ratio estimates
or_est <- tidy_multgee({{selected.modelname | safe}}, exponentiate=TRUE) %>%
	dplyr::select(-conf.level, -df.error, -original_term, -std.error, -statistic) %>%
	filter(term != "(Intercept)")
{{/if}}

{{if (options.selected.intrinsic == "TRUE")}}
# intrinsic parameter estimates
intrinsic_param <- intrinsic.pars(y={{selected.depvar | safe}}, data={{dataset.name}}, id={{selected.id | safe}}{{selected.repeated | safe}}, rscale="ordinal")
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
{{if (options.selected.expparm == "TRUE")}}
BSkyFormat(or_est, singleTableOutputHeader="Exponentiated parameter estimates and 95% Confidence Intervals")
{{/if}}
{{if (options.selected.localor == "TRUE")}}
BSkyFormat(local_ors, singleTableOutputHeader="Local Odds Ratio Estimates")
{{/if}}				

`
        };
        var objects = {

			modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: gee_ordinal.t('modellabel'),
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
                    label: gee_ordinal.t('depvarlabel'),
                    no: "depvar",
                    filter: "Numeric|Scale|Nominal|String|Ordinal",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },			
            formula: {
                el: new formulaBuilder(config, {
                    no: "formula",
                    required:true,
                    label: gee_ordinal.t('formulalabel')
                })
            },
			id: {
                el: new dstVariable(config, {
                    label: gee_ordinal.t('idlabel'),
                    no: "id",
                    filter: "Numeric|Scale|String|Nominal|Ordinal",
                    extraction: "NoPrefix|UseComma",
					required: true
                })
            },
			repeated: {
                el: new dstVariable(config, {
                    label: gee_ordinal.t('repeatedlabel'),
                    no: "repeated",
                    filter: "Numeric|Scale|Nominal|String",
                    extraction: "NoPrefix|UseComma",
					wrapped: ", repeated=%val%",
					required: false
                })
            },			
            offset: {
                el: new dstVariable(config, {
                    label: gee_ordinal.t('offsetlabel'),
                    no: "offset",
                    filter: "Numeric|Scale",
                    wrapped: ' + offset(%val%)',
                    extraction: "NoPrefix|UseComma",
                })
            },
		    linkfunc: {
                el: new selectVar(config, {
                    no: 'linkfunc',
                    label: gee_ordinal.t('linkfunclabel'),
                    multiple: false,
					width: "w-25",
					style: "mt-4",					
                    extraction: "NoPrefix|UseComma",
                    options: ["logit", "probit","cauchit","cloglog","acl"],
                    default: "logit",
					required: true
                })
            },				
		    str: {
                el: new selectVar(config, {
                    no: 'str',
                    label: gee_ordinal.t('strlabel'),
                    multiple: false,
					width: "w-50",
                    extraction: "NoPrefix|UseComma",
                    options: ["category.exch", "time.exch", "uniform", "RC", "independence"],
                    default: "category.exch",
					required: true
                })
            },			
		    esttype: {
                el: new selectVar(config, {
                    no: 'esttype',
                    label: gee_ordinal.t('esttypelabel'),
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
					label: gee_ordinal.t('homogenlabel'),
					no: "homogen",
					state: "checked",
					extraction: "Boolean"
				})
			},
			restrict: {
				el: new checkbox(config, {
					label: gee_ordinal.t('restrictlabel'),
					no: "restrict",
					extraction: "Boolean"
				})
			},			
			addamount: {
                el: new input(config, {
                    no: 'addamount',
                    label: gee_ordinal.t('addamountlabel'),
                    value: ".0001",
                    type: "numeric",
					allow_spaces: true,
					style: "mt-2 mb-3",
					width: "w-25",
                    extraction: "TextAsIs",
					required: true
                })
            },
			expparm: {
				el: new checkbox(config, {
					label: gee_ordinal.t('expparmlabel'),
					no: "expparm",
					newline: true,
					extraction: "Boolean"
				})
			},							
			intrinsic: {
				el: new checkbox(config, {
					label: gee_ordinal.t('intrinsiclabel'),
					no: "intrinsic",
					newline: true,
					extraction: "Boolean"
				})
			},			
			converge: {
				el: new checkbox(config, {
					label: gee_ordinal.t('convergelabel'),
					no: "converge",
					newline: true,
					extraction: "Boolean"
				})
			},
			localor: {
				el: new checkbox(config, {
					label: gee_ordinal.t('localorlabel'),
					no: "localor",
					extraction: "Boolean"
				})
			}
			
		}

        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.depvar.el.content, objects.formula.el.content, objects.id.el.content, objects.repeated.el.content, objects.offset.el.content,
					objects.linkfunc.el.content, objects.str.el.content, objects.esttype.el.content, objects.homogen.el.content, objects.restrict.el.content, objects.addamount.el.content,
					objects.expparm.el.content, objects.intrinsic.el.content, objects.converge.el.content, objects.localor.el.content],					
            nav: {
                name: gee_ordinal.t('navigation'),
                icon: "icon-link",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: gee_ordinal.t('help.title'),
            r_help: gee_ordinal.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: gee_ordinal.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new gee_ordinal().render()
}
