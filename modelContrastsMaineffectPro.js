
var localization = {
    en: {
        title: "All Pairwise Contrasts",
        navigation: "All Pairwise Contrasts",
		notelabel1: "NOTE: You must have access to the dataset that created the model.",
		notelabel2: "Models supported: linear models (lm) , generalized linear models (glm), Cox proportional hazards (coxph), generalized estimating equation (glmgee), quantile regression (rq), linear mixed models (lmerModLmerTest)", 
        modelselectorlabel:"Select Model Name",
		plotvarslabel: "Variables for all pairwise contrasts",		
		multadjlabel: "Multiple comparison adjustment",
		
        help: {
            title: "All Pairwise Contrasts",
            r_help: "help(emmeans, package = 'emmeans')",
            body: `
This creates a table of all pairwise level comparisons for categorical predictors in a model.  All directions are also provided (e.g. level A relative to level B, and level B 
relative to level A).  Estimates are provided on the outcome response scale (e.g. differences for linear models, hazard ratios for Cox models, odds ratios for logistic models, rate ratios for Poisson models).  
Optional multiple comparison adjustments for each categorical predictor can be specified.  Currently, models of class lm (linear models), glm (generalized linear models, 
which includes logistic and Poisson), coxph (Cox proportional hazards), glmgee (generalized estimation equation), rq (quantile regression), and lmerModLmerTest (linear mixed models) are supported.
<br/><br/>
<b>Select Model Name:</b> Choose the name of the model as specified when the model was fit.  This is a required field.
<br/><br/>
<b>Variables for all pairwise contrasts:</b> Specify which categorical variables to do pairwise level comparisons for.  These must have been included as predictors when the model was fit.
Variables enterered as character, factor, ordinal, logical, or numeric dummy variables can be used.  This is a required field.
<br/><br/>
<b>Multiple comparison adjustment:</b> Specify the multiple comparison adjustment.  Options are none (no adjustment), Tukey, Bonferroni, Sidak, Holm, Hochberg, Hommel, fdr (false discovery rate), 
BH (Benjamini-Hochberg), and BY (Benjamini-Yekutieli).  Notes are provided in the output as to which multiple comparison adjustment was done for the confidence intervals and p-values.
<br/><br/>
<b>Required R Packages:</b> emmeans
`}
    }
}

class modelContrastsMaineffectPro extends baseModal {
    constructor() {
        var config = {
            id: "modelContrastsMaineffectPro",
            label: localization.en.title,
			splitprocessing: false,
            modalType: "two",
            RCode: `
library(emmeans)

for (i in {{selected.pairvars | safe}}) {
  fit.emm <- emmeans({{selected.modelselector | safe}}, i)
  tab_orig <- summary(pairs(fit.emm, adjust="{{selected.multadj | safe}}", type="response"), infer=c(TRUE, TRUE))
  tab_rev <- summary(pairs(fit.emm, adjust="{{selected.multadj | safe}}", type="response", reverse=TRUE), infer=c(TRUE, TRUE))
  tab_comb <- data.frame(rbind(tab_orig, tab_rev))
  
  BSkyFormat(tab_comb, singleTableOutputHeader=paste("Model: {{selected.modelselector | safe}}, Contrasts for:", i))
  BSkyFormat(data.frame(Notes=attr(tab_orig, "mesg")), singleTableOutputHeader="Contrast Notes")
  }
`,
		    pre_start_r: JSON.stringify({
            modelselector: "BSkyGetAvailableModels(c(\"lm\", \"glm\", \"coxph\", \"rq\", \"glmgee\", \"lmerModLmerTest\"))",
            })
        }
        var objects = {
            label1: {
				el: new labelVar(config, {
					label: localization.en.notelabel1,
					style: "mt-3",
					h:5
				})
			},
			label2: {
				el: new labelVar(config, {
					label: localization.en.notelabel2,
					style: "mb-5",
					h:6
				})
			},			
			content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            modelselector: {
                el: new comboBox(config, {
                    no: 'modelselector',
                    label: localization.en.modelselectorlabel,
                    multiple: false,
                    required: true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: ""
                })
            },			
			pairvars: {
				el: new dstVariableList(config,{
					label: localization.en.plotvarslabel,
					no: "pairvars",
					required: true,
					filter:"String|Numeric|Logical|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UseComma|Enclosed",
					wrapped: "c(%val%)"
				})
			},
			multadj: {
                el: new selectVar(config, {
                    no: 'multadj',
                    label: localization.en.multadjlabel,
                    multiple: false,
					width: "w-25",
					style: "mt-3",
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "tukey", "bonferroni", "sidak", "holm", "hochberg", "hommel", "fdr", "BH", "BY"],
                    default: "none"
                })
            }
			
           

        }

       
        const content = {
			head: [objects.label1.el.content, objects.label2.el.content],
            left: [objects.content_var.el.content],
            right: [
				objects.modelselector.el.content, objects.pairvars.el.content, objects.multadj.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-brightness-and-contrast",
				onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new modelContrastsMaineffectPro().render()