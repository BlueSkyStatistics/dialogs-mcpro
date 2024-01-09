
var localization = {
    en: {
        title: "Forest Plot",
        navigation: "Forest Plot",
        modelselectorlabel:"Select Model Name",
		plotvarslabel: "Variables to Plot (none specified plots all variables)",
		varlabelslabel: "Variable Labels (specify as varname='label' separated by commas, e.g. age='Age in years', bmi='Body Mass Index'); can use \\n for line breaks within a label",
		notelabel: "NOTE: Changing labels requires a model re-fit, so large data could take time",
		
		estimateoptlabel: "Estimate Options",
		estimatelabellabel: "Label",
		exponentiatelabel: "Force Parameter Estimate Exponentiation",
		linecolorlabel: "Line Color",
		pointshapelabel: "Point Shape",
		pointsizelabel: "Point Size (0-10 mm)",
		
		styleoptlabel: "Style Options",
		factorseplinelabel: "Factor Names on Separate Lines",
		plotbandslabel: "Plot Bands",
		textsizelabel: "Text Size (1-10 mm)",
		estticklabelsizelabel: "Estimate Tick Mark Label Size (1-50)",
		

        help: {
            title: "Forest Plot",
            r_help: "help(forest_model, package = 'forestmodel')",
            body: `
This creates a plot of model coefficients, or exponentiated coefficients, from a regression model.  Each variable is plotted in its own row with totals, parameter estimates, 
95% confidence intervals, and p-values. Variables can be labelled to allow for a nicer presentation.  Currently, models of class lm (linear models), glm (generalized linear models, 
which includes logistic and Poisson), coxph (Cox proportional hazards), and rq (quantile regression) are supported.
<br/><br/>
<b>Select Model Name:</b> Choose the name of the model as specified when the model was fit.  This is a required field.
<br/><br/>
<b>Variables to Plot:</b> If you have access to the data that created the model, you can specify a subset of the variables in the model to include in the plot.  If no variables 
are specified, then it defaults to all variables included.
<br/><br/>
<b>Variable Labels:</b> Specify nicer labels to use instead of the variable names.  If a variable does not get labelled, the variable name or the existing variable label used when 
the model was fit (if it exists) will be plotted.  These must be specified in a variablename="label" format, separated by commas. Note that including \\n in a label will force
a line break within the label.  This means you can specify multi-line labels and might be advantageous for long labels, as long labels left on one line leave less space for the estimates.  Doing 
a summary of the model with Model Evaluation -> Summarize -> Summarize a Model will print the model variables used in case you don't have access to the dataset.  NOTE: There is a 
current bug in the forestmodel R package that does not use variable labels for factors in Cox models - the package developer has been notified.  An alternative until the package is 
fixed is to refit the model with dummy-coded variables instead of factors.
<br/><br/><br/>
<b>Estimate Options:</b>
<br/><br/>
<b>Label:</b> Optional label for the estimate column in the plot. Logistic regression and Cox models will automatically be detected and estimates labeled as "Odds Ratio" and 
"Hazard Ratio", respectively.  Other models will use the default of "Estimate" if you don't specify anything.
<br/><br/>   
<b>Force Parameter Estimate Exponentiation:</b> Choose this to force values of exp(coefficient) to be displayed, i.e. 2.718 raised to the power of the coefficient.  Exponentiated 
coefficients are commonly used in Cox proportional hazards models (for hazard ratios), logistic regression (for odds ratios), log-binomial models (for relative risks), and Poisson 
regression (for rate ratios).  By default, logistic regression and Cox models will automatically be detected and exp(coefficient) will be used.
<br/><br/>
<b>Line Color:</b> Line color for the confidence intervals.
<br/><br/>
<b>Point Shape:</b> The shape of the points for the parameter estimates in the plot.
<br/><br/>
<b>Point Size (0-10 mm):</b>  The size of the points, in millimeters, for the parameter estimates in the plot.  0 mm would remove the points.  The default is 4 mm.
<br/><br/><br/>
<b>Style Options:</b>
<br/><br/>
<b>Factor Names on Separate Lines:</b> Choose this to display factor variable names on a separate line from the levels of the factor.
<br/><br/>
<b>Plot Bands:</b> Choose this to display alternating shaded regions for each row of the plot.
<br/><br/>
<b>Text Size (1-10 mm):</b> Size of the text, in millimeters, in the plot.  The default is 4 mm.
<br/><br/>
Note: If you want to change the overall size of the plot, the plot size can be set using the Themes button in the triple dot menu.
<br/><br/>
<b>Estimate Tick Mark Label Size (1-50):</b> Size of the tick mark labels for the estimate axis.
<br/><br/>
<b>Required R Packages:</b>  forestmodel, arsenal, survival, quantreg, insight
`}
    }
}

class ForestPlot extends baseModal {
    constructor() {
        var config = {
            id: "ForestPlot",
            label: localization.en.title,
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
			plotvars: {
				el: new dstVariableList(config,{
					label: localization.en.plotvarslabel,
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
					label: localization.en.varlabelslabel,
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
					label: localization.en.notelabel, 
					style: "mt-3", 
					h:5
				})
			},
			
			estimateoptlabel: {
				el: new labelVar(config, {
					label: localization.en.estimateoptlabel, 
					style: "mt-5", 
					h:5
				})
			},
			estimatelabel: {
				el: new input(config, {
					no: 'estimatelabel',
					label: localization.en.estimatelabellabel,
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
                    label: localization.en.exponentiatelabel,
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
                    label: localization.en.linecolorlabel,
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
                    label: localization.en.pointshapelabel,
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
                    label: localization.en.pointsizelabel,
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
					label: localization.en.styleoptlabel, 
					style: "mt-5", 
					h:5
				})
			},
            factorsepline: {
                el: new checkbox(config, {
                    label: localization.en.factorseplinelabel,
                    no: "factorsepline",
                    extraction: "Boolean",
                    style: "mt-3, ml-3"
                })
            },			
            plotbands: {
                el: new checkbox(config, {
                    label: localization.en.plotbandslabel,
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
                    label: localization.en.textsizelabel,
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
                    label: localization.en.estticklabelsizelabel,
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
            left: [objects.content_var.el.content],
            right: [
				objects.modelselector.el.content, objects.plotvars.el.content, objects.varlabels.el.content, objects.notelabel.el.content,
				objects.estimateoptlabel.el.content, objects.estimatelabel.el.content, objects.exponentiate.el.content, objects.linecolor.el.content, objects.pointshape.el.content,
				objects.pointsize.el.content,
				objects.styleoptlabel.el.content, objects.factorsepline.el.content, objects.plotbands.el.content, objects.textsize.el.content, objects.estticklabelsize.el.content

            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-tree",
				positionInNav: 6,
				onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new ForestPlot().render()
