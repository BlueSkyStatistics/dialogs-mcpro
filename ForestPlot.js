/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class ForestPlot extends baseModal {
    static dialogId = 'ForestPlot'
    static t = baseModal.makeT(ForestPlot.dialogId)

    constructor() {
        var config = {
            id: ForestPlot.dialogId,
            label: ForestPlot.t('title'),
			splitprocessing: false,
            modalType: "two",
            RCode: `
library(forestmodel)
library(arsenal)
library(survival)
library(quantreg)
library(insight)

# extracting data from model object and assigning variable labels if specified
data_for_plot <- get_data({{selected.modelselector | safe}})
model_for_plot <- {{selected.modelselector | safe}}

{{if (options.selected.varlabels != "")}}	
# defining variable labels
data_for_plot <- set_labels(data_for_plot, list({{selected.varlabels | safe}}))
# re-fitting model using data with variable labels
model_for_plot <- update({{selected.modelselector | safe}}, data=data_for_plot)
{{/if}}

# make the plot
forest_model(model_for_plot{{selected.estimatelabel | safe}}{{selected.plotvars | safe}}{{selected.exponentiate | safe}}, factor_separate_line={{selected.factorsepline | safe}}, 
	format_options=forest_model_format_options(colour="{{selected.linecolor | safe}}", shape="{{selected.pointshape | safe}}", text_size={{selected.textsize | safe}}, point_size={{selected.pointsize | safe}}, banded={{selected.plotbands | safe}})) +
	theme(axis.text.x=element_text(size={{selected.estticklabelsize | safe}}))

rm(model_for_plot)
detach(package:quantreg)
detach(package:SparseM)
`,
		    pre_start_r: JSON.stringify({
            modelselector: "BSkyGetAvailableModels(c(\"lm\", \"glm\", \"coxph\", \"rq\"), returnClassTrain = FALSE)",
            })
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            label3: { el: new labelVar(config, { label: ForestPlot.t('label3'), h: 6 }) },
            modelselector: {
                el: new comboBox(config, {
                    no: 'modelselector',
                    label: ForestPlot.t('modelselectorlabel'),
                    multiple: false,
                    required: true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: ""
                })
            },			
			plotvars: {
				el: new dstVariableList(config,{
					label: ForestPlot.t('plotvarslabel'),
					no: "plotvars",
					required: false,
					filter:"String|Numeric|Logical|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UseComma|Enclosed",
					wrapped: ", covariates=c(%val%)"
				})
			},
			varlabels: {
				el: new input(config, {
					no: 'varlabels',
					label: ForestPlot.t('varlabelslabel'),
					required: false,
					allow_spaces: true,
					placeholder: "",
					extraction: "TextAsIs",
					type: "character",
					width:"w-100",
				})
			},
			notelabel: {
				el: new labelVar(config, {
					label: ForestPlot.t('notelabel'), 
					style: "mt-3", 
					h:5
				})
			},
			
			estimateoptlabel: {
				el: new labelVar(config, {
					label: ForestPlot.t('estimateoptlabel'), 
					style: "mt-5", 
					h:5
				})
			},
			estimatelabel: {
				el: new input(config, {
					no: 'estimatelabel',
					label: ForestPlot.t('estimatelabellabel'),
					required: false,
					style: "ml-3 mb-3",
					allow_spaces: true,
					extraction: "TextAsIs",
					type: "character",
					width:"w-75",
					wrapped: ", panels=default_forest_panels(measure='%val%')"
				})
			},			
            exponentiate: {
                el: new checkbox(config, {
                    label: ForestPlot.t('exponentiatelabel'),
                    no: "exponentiate",
                    extraction: "TextAsIs",
                    style: "ml-3",
					bs_type: "valuebox",
					true_value: ", exponentiate=TRUE",
					false_value: " "
                })
            },			
			linecolor: {
                el: new comboBox(config, {
                    no: 'linecolor',
                    label: ForestPlot.t('linecolorlabel'),
					style: "ml-3",
					multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["black", "blue", "red", "green", "purple", "cyan", "magenta"],
                    default: "black"
                })
            },
			pointshape: {
                el: new comboBox(config, {
                    no: 'pointshape',
                    label: ForestPlot.t('pointshapelabel'),
					style: "ml-3",
					multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["square", "circle", "triangle", "diamond"],
                    default: "square"
                })
            },
            pointsize: {
                el: new inputSpinner(config, {
                    no: "pointsize",
                    label: ForestPlot.t('pointsizelabel'),
					style: "ml-1",
                    min: 0,
                    max: 10,
                    step: 0.5,
                    value: 4,
                    extraction: "NoPrefix|UseComma"
                })
            },

			styleoptlabel: {
				el: new labelVar(config, {
					label: ForestPlot.t('styleoptlabel'), 
					style: "mt-5", 
					h:5
				})
			},
            factorsepline: {
                el: new checkbox(config, {
                    label: ForestPlot.t('factorseplinelabel'),
                    no: "factorsepline",
                    extraction: "Boolean",
                    style: "mt-3, ml-3"
                })
            },			
            plotbands: {
                el: new checkbox(config, {
                    label: ForestPlot.t('plotbandslabel'),
                    no: "plotbands",
					newline: true,
					state: "checked",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            textsize: {
                el: new inputSpinner(config, {
                    no: "textsize",
                    label: ForestPlot.t('textsizelabel'),
					style: "ml-1",
                    min: 1,
                    max: 10,
                    step: 0.5,
                    value: 4,
                    extraction: "NoPrefix|UseComma"
                })
            },           
            estticklabelsize: {
                el: new inputSpinner(config, {
                    no: "estticklabelsize",
                    label: ForestPlot.t('estticklabelsizelabel'),
					style: "ml-1",
                    min: 1,
                    max: 50,
                    step: 0.5,
                    value: 10,
                    extraction: "NoPrefix|UseComma"
                })
            }            

        }

       
        const content = {
            head: [objects.label3.el.content],
            left: [objects.content_var.el.content],
            right: [
				objects.modelselector.el.content, objects.plotvars.el.content, objects.varlabels.el.content, objects.notelabel.el.content,
				objects.estimateoptlabel.el.content, objects.estimatelabel.el.content, objects.exponentiate.el.content, objects.linecolor.el.content, objects.pointshape.el.content,
				objects.pointsize.el.content,
				objects.styleoptlabel.el.content, objects.factorsepline.el.content, objects.plotbands.el.content, objects.textsize.el.content, objects.estticklabelsize.el.content

            ],
            nav: {
                name: ForestPlot.t('navigation'),
                icon: "icon-tree",
				positionInNav: 6,
				onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: ForestPlot.t('help.title'),
            r_help: ForestPlot.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: ForestPlot.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new ForestPlot().render()
}

