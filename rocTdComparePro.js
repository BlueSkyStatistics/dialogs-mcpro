



class rocTdComparePro extends baseModal {
    static dialogId = 'rocTdComparePro'
    static t = baseModal.makeT(rocTdComparePro.dialogId)

    constructor() {
        var config = {
            id: rocTdComparePro.dialogId,
            label: rocTdComparePro.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(timeROC)
library(tidyverse)
library(ggplot2)
library(ggthemes)
library(RColorBrewer)
library(ggsci)
library(survival)

pred_vars <- c({{selected.markervars | safe}})

# removing missing values

dataset_nomiss <- na.omit({{dataset.name}}[, c({{selected.timevar | safe}}, {{selected.eventvar | safe}}, {{selected.markervars | safe}})])
num_nonmiss <- nrow(dataset_nomiss)

# list of ROC objects

num_vars <- length(pred_vars)
roc_list <- list()

for (i in 1:num_vars) {
  roc_list[[i]] <- timeROC(T=dataset_nomiss[, c({{selected.timevar | safe}})],
                 delta=dataset_nomiss[, c({{selected.eventvar | safe}})],
                 marker=dataset_nomiss[, c(pred_vars[i])],
                 cause=1,
                 weighting="marginal",
                 times={{selected.time | safe}},
                 iid=TRUE) 
}

# pairwise AUC tests

rocname1_vec <- c()
rocname2_vec <- c()
auc1_vec <- c()
auc2_vec <- c()
zpvalue_vec <- c()
aucdiff_vec <- c()

for (i in 1:(num_vars-1)) {
 for (j in (i+1):num_vars) {
    roc_pair <- compare(roc_list[[i]], roc_list[[j]])
    rocname1_vec <- c(rocname1_vec, pred_vars[i])
    rocname2_vec <- c(rocname2_vec, pred_vars[j])
    auc1_vec <- c(auc1_vec, roc_list[[i]]$AUC[[2]])
    auc2_vec <- c(auc2_vec, roc_list[[j]]$AUC[[2]])
    zpvalue_vec <- c(zpvalue_vec, roc_pair$p_values_AUC[[2]])
    aucdiff_vec <- c(aucdiff_vec, roc_list[[i]]$AUC[[2]]-roc_list[[j]]$AUC[[2]])
 }
}

# sample size and variable output

ROC_summary <- data.frame(N=num_nonmiss, event={{selected.eventvar | safe}}, time={{selected.timevar | safe}}, followup_time={{selected.time | safe}})
BSkyFormat(ROC_summary, singleTableOutputHeader="Sample size and variables")

# pairwise AUC test output

rocpairs_table <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec, Variable2=rocname2_vec,
                             AUC2=auc2_vec, AUC_diff=aucdiff_vec, p.value=zpvalue_vec)
BSkyFormat(rocpairs_table, singleTableOutputHeader="Pairwise Comparisons of ROC Curve Areas")

{{if (options.selected.multcompopt=="TRUE")}}
# multiple comparison adjustments

rocpairs_adjtable <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec, Variable2=rocname2_vec,
                                AUC2=auc2_vec, AUC_diff=aucdiff_vec,
                                p.value=p.adjust(zpvalue_vec,method="{{selected.multcompmethod | safe}}"))
BSkyFormat(rocpairs_adjtable, singleTableOutputHeader="Multiple Comparison Adjusted Pairwise Comparisons of ROC Curve Areas")
{{/if}}

# overlaid ROC curves

# setting up colors and legend
color_pal_spec <- "{{selected.colorpalette | safe}}"

if (color_pal_spec=="hue") {
scale_color <- scale_color_hue(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="grey") {
scale_color <- scale_color_grey(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="Greys") {
scale_color <- scale_color_brewer(palette="Greys", name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="Set1") {
scale_color <- scale_color_brewer(palette="Set1", name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="Set2") {
scale_color <- scale_color_brewer(palette="Set2", name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="Dark2") {
scale_color <- scale_color_brewer(palette="Dark2", name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="npg") {
scale_color <- scale_color_npg(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="aaas") {
scale_color <- scale_color_aaas(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="nejm") {
scale_color <- scale_color_nejm(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="lancet") {
scale_color <- scale_color_lancet(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="jama") {
scale_color <- scale_color_jama(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
} else if (color_pal_spec=="jco") {
scale_color <- scale_color_jco(name="{{selected.legendtitle | safe}}", labels={{if (options.selected.curvelabels=="")}} pred_vars {{#else}} {{selected.curvelabels | safe}} {{/if}})
}

# creating ROC curve dataset

FP_TP_data <- data.frame()

for (i in 1:num_vars) {
  FP_TP_data_temp <- cbind(as.data.frame(roc_list[[i]]$FP), as.data.frame(roc_list[[i]]$TP))
	FP_TP_data_temp <- FP_TP_data_temp[, c(2,4)]
	names(FP_TP_data_temp) <- c("FP", "TP")
	FP_TP_data_temp <- mutate(FP_TP_data_temp, marker=pred_vars[i])
  FP_TP_data <- rbind(FP_TP_data, FP_TP_data_temp)
}

# making marker level order match the specified variable order

FP_TP_data <- mutate(FP_TP_data,
	marker=factor(marker, levels=pred_vars))

# plot

ggplot(FP_TP_data, aes(x=FP, y=TP, color=marker)) +
	geom_step(linewidth={{selected.linewidth | safe}}) +
	{{if (options.selected.reflinechkbox=="TRUE")}}
	geom_segment(x=0, y=0, xend=1, yend=1, linetype=3, color="black") + 
	{{/if}}
	labs(x="1-Specificity", y="Sensitivity", title="{{selected.plottitle | safe}}") +
	{{selected.themedropdown | safe}} +
	theme(plot.title=element_text(size={{selected.plottitlesize | safe}}), axis.title=element_text(size={{selected.axislabelsize | safe}}),
        axis.text=element_text(size={{selected.ticklabelsize | safe}}), legend.position="{{selected.legendpos | safe}}", 
        legend.title=element_text(size={{selected.legendfontsize | safe}}), legend.text=element_text(size={{selected.legendfontsize | safe}})) +
	scale_color
`
        };
        var objects = {	
			content_var: {
				el: new srcVariableList(config, {
					action: "move"
				}) 
			},
			timevar: {
                el: new dstVariable(config, {
                    label: rocTdComparePro.t('timevarlabel'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "UseComma|Enclosed",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: rocTdComparePro.t('eventvarlabel'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "UseComma|Enclosed",
					required: true
                })
            },
			markervars: {
                el: new dstVariableList(config, {
                    label: rocTdComparePro.t('markerslabel'),
                    no: "markervars",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
					required: true
                })
            },			
			time: {
                el: new input(config, {
                    no: 'time',
                    label: rocTdComparePro.t('timelabel'),
                    placeholder: "",
                    required: true,
                    type: "numeric",
					enforceRobjectRules: false,
					width: "w-25",
                    extraction: "TextAsIs"
                })
            },										
			multcompopt: {
				el: new checkbox(config, {
				label: rocTdComparePro.t('multcompopt'),
				no: "multcompopt",
				style: "mt-3",
				extraction: "Boolean"
				})
			},
            multcompmethod: {
                el: new comboBox(config, {
                    no: 'multcompmethod',
                    label: rocTdComparePro.t('multcompmethod'),
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["holm","hochberg","hommel","bonferroni","fdr","BY"],
                    default: "holm"
                })
            },			
            themedropdown: {
                el: new selectVar(config, {
                    no: 'themedropdown',
                    label: rocTdComparePro.t('themedropdownlabel'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
					width: "w-25",
                    options: ["theme_base()", "theme_bw()", "theme_calc()",
                    "theme_classic()", "theme_clean()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()","theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_test()", "theme_tufte()", "theme_void()",
                    "theme_wsj()"],
                    default: "theme_grey()"
                })
            },			
			plottitle: {
                el: new input(config, {
                    no: 'plottitle',
                    label: rocTdComparePro.t('plottitlelabel'),
                    value: "ROC Curve Comparison",
                    required: false,
                    type: "character",
					style: "mb-3",
                    enforceRobjectRules: false,
                    extraction: "TextAsIs"
				})
            },
			plottitlesize: {
				el: new inputSpinner(config,{
				no: 'plottitlesize',
				label: rocTdComparePro.t('plottitlesize'),
				style: "mt-3",
				min: 5,
				max: 50,
				step: 1,
				value: 20,
				extraction: "NoPrefix|UseComma"
				})
			},
			lineoptionslabel: { el: new labelVar(config, { label: rocTdComparePro.t('lineoptionslabel'), h: 5, style: "mt-4" }) },			
			linewidth: {
				el: new inputSpinner(config, {
					no: 'linewidth',
					label: rocTdComparePro.t('linewidthlabel'),
					min: .25,
					max: 10,
					step: 0.25,
					value: 1,
					style: "ml-1 mb-2",
					extraction: "NoPrefix|UseComma"
				})
			},
			reflinechkbox: {
				el: new checkbox(config, {
					label: rocTdComparePro.t('reflinelabel'),
					no: "reflinechkbox",
					state: "checked",
					style: "mt-2 ml-3 mb-3",
					extraction: "Boolean"
				})

			},
            colorpalette: {
                el: new comboBox(config, {
                    no: 'colorpalette',
                    label: rocTdComparePro.t('colorpalette'),
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue"
                })
            },
			axisoptionslabel: { el: new labelVar(config, { label: rocTdComparePro.t('axisoptionslabel'), h: 5, style: "mt-4" }) },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: rocTdComparePro.t('axislabelsize'),
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},
			ticklabelsize: {
				el: new inputSpinner(config,{
				no: 'ticklabelsize',
				label: rocTdComparePro.t('ticklabelsize'),
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},
			legendoptionslabel: { el: new labelVar(config, { label: rocTdComparePro.t('legendoptionslabel'), h: 5, style: "mt-4" }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: rocTdComparePro.t('legendpos'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["top", "bottom", "left", "right"],
                    default: "top",
                    style: "ml-3"
                })
            },
            legendtitle: {
                el: new input(config, {
                    no: 'legendtitle',
                    label: rocTdComparePro.t('legendtitle'),
                    placeholder: "Marker",
                    ml: 3,
                    extraction: "TextAsIs",
                    value: "Marker",
                    allow_spaces:true,
                    type: "character",
                })
            },            
            curvelabels: {
                el: new input(config, {
                    no: 'curvelabels',
                    label: rocTdComparePro.t('curvelabels'),
                    placeholder: "",
                    ml: 3,
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    type: "character",
					width: "w-100",
					wrapped:'c(%val%)'
                })
            },
			legendfontsize: {
				el: new inputSpinner(config,{
				no: 'legendfontsize',
				label: rocTdComparePro.t('legendfontsize'),
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}			
		}
		
		var plotpanel = {
            el: new optionsVar(config, {
                no: "plotpanel",
                name: "Plot Options",
                content: [
                    objects.themedropdown.el, objects.plottitle.el, objects.plottitlesize.el, 
					objects.lineoptionslabel.el, objects.reflinechkbox.el, objects.linewidth.el, objects.colorpalette.el,
					objects.axisoptionslabel.el, objects.axislabelsize.el, objects.ticklabelsize.el,
					objects.legendoptionslabel.el, objects.legendpos.el, objects.legendtitle.el, objects.curvelabels.el, objects.legendfontsize.el]
				})
		}	
		
			
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.timevar.el.content, objects.eventvar.el.content, objects.markervars.el.content, objects.time.el.content, objects.multcompopt.el.content, objects.multcompmethod.el.content],
			bottom: [plotpanel.el.content],
            nav: {
                name: rocTdComparePro.t('navigation'),
                icon: "icon-icc",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: rocTdComparePro.t('help.title'),
            r_help: rocTdComparePro.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: rocTdComparePro.t('help.body')
        }
;
    }
	

	
}

module.exports = {
    render: () => new rocTdComparePro().render()
}
