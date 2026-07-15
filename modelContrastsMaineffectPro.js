


class modelContrastsMaineffectPro extends baseModal {
    static dialogId = 'modelContrastsMaineffectPro'
    static t = baseModal.makeT(modelContrastsMaineffectPro.dialogId)

    constructor() {
        var config = {
            id: modelContrastsMaineffectPro.dialogId,
            label: modelContrastsMaineffectPro.t('title'),
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
					label: modelContrastsMaineffectPro.t('notelabel1'),
					style: "mt-3",
					h:5
				})
			},
			label2: {
				el: new labelVar(config, {
					label: modelContrastsMaineffectPro.t('notelabel2'),
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
                    label: modelContrastsMaineffectPro.t('modelselectorlabel'),
                    multiple: false,
                    required: true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: ""
                })
            },			
			pairvars: {
				el: new dstVariableList(config,{
					label: modelContrastsMaineffectPro.t('plotvarslabel'),
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
                    label: modelContrastsMaineffectPro.t('multadjlabel'),
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
                name: modelContrastsMaineffectPro.t('navigation'),
                icon: "icon-brightness-and-contrast",
				onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: modelContrastsMaineffectPro.t('help.title'),
            r_help: modelContrastsMaineffectPro.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: modelContrastsMaineffectPro.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new modelContrastsMaineffectPro().render()
}
