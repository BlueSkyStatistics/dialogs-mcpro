var localization = {
    en: {
        title: "Compare ROC Curves, time-dependent competing risks",
        navigation: "Compare ROC Curves, time-dependent competing risks",
		timevarlabel: "Time to event or censor",
		eventvarlabel: "Events (1=event, 0=censor)",
		eventcodelabel: "Event code",
		markerslabel: "Markers (specify at least two; larger values must correspond to higher event risk)",
		timelabel: "Follow-up time to compute ROC curves",
		controldeflabel: "Control definition",
		multcompopt: "Multiple comparison adjustment",
		multcompmethod: "Multiple comparison method",
		
		themedropdownlabel: "Theme",
		plottitlelabel: "Title",
		plottitlesize: "Plot Title Size (5-50)",
		
		lineoptionslabel: "Line Options",
		linewidthlabel: "Line width",
		reflinelabel: "Include reference line",
		colorpalette: "Color Palette",

		axisoptionslabel: "Axis Options",
		axislabelsize: "Axis Label Size (5-50)",
		ticklabelsize: "Axis Tick Mark Label Size (5-50)",

		legendoptionslabel: "Legend Options",
		legendtitle: "Title",
        legendpos : "Position",
		curvelabels: "Curve Labels, specify as 'Label 1', 'Label 2', 'Label 3'; use \\n within a label for a line break",
		legendfontsize: "Legend Labels Size (5-50)",		

        help: {
            title: "Compare ROC Curves, time-dependent competing risks",
            r_help: "help(compare, package ='timeROC')",
            body: `
This creates receiver operating characteristic curves for time-to-event data using nonparametric inverse probability of censoring weighting estimators.
</br></br>
The methods are described in "Estimating and comparing time-dependent areas under receiver operating characteristic curves for censored event times with 
competing risks", Blanche P, Dartigues J, and Jacqmin-Gadda H. 2013, Statistics in Medicine, 32: 5381-5397.

<br/><br/>
A table of pairwise comparisons of the ROC curve areas for the specified follow-up time is provided.  A plot of overlaid ROC curves is also created.  
If the sample size is larger than 2000, it might take some time to run. 

<br/><br/>

<b>Time to event or censor:</b></br>
Variable for the time to event (for those with the event) and the time to censor (for those without the event) (required). Numeric only. </br></br>

<b>Events (1=event, 0=censor):</b></br>
Variable indicating those with the event (=1) and those censored (=0) (required). Numeric only. </br></br>

<b>Event code:</b></br>
Which numeric code of the events variable defines the event of interest for the ROC plots. </br></br>

<b>Markers:</b> </br>
Specify at least two marker variables to compute the ROC curves for.  Larger values must correspond to higher event risk.  
Negate values if negatively associated with event risk.  Must be numeric. (required)</br></br>

<b>Follow-up time to compute ROC curves:</b></br>
Indicate the specific follow-up time that you want to compute ROC curves for.  Must be on the same scale 
as the time variable. (required)</br></br> 

<b>Control definition:</b></br>
Indicate which subjects should be considered controls.  "Free of any event" means subjects with event times larger than the specified times (subjects who experience events with times larger than the specified times or 
censored times larger than the specified times).  Subjects with competing events before the specified times are not controls in this definition.  "Not a case" means subjects with event times larger than the specified times and those with competing events prior to the specfied times. 
Subjects with competing events before the specified times are considered controls in this definition. In both definitions, censored subjects before the specified times are not considered controls.  These censored 
subjects are only used to estimate the weights (the probability of being observed). (required)</br></br>   

<b>Multiple comparison adjustment:</b></br>
This produces a table of the pairwise ROC curve areas when doing a multiple comparison adjusment. 
Options are: "holm","hochberg","hommel","bonferroni","fdr" (false discovery rate),"BY" (Benjamini & Yekutieli) </br></br>


<b>Plot Options</b>
</br></br>

<b>Plot Theme:</b> Specify the general theme for the plot
<br/><br/>

<b>Plot Title:</b> Specify the title for the plot.  Can be removed.
<br/><br/>

<b>Plot Title Size:</b> Specify the size of the plot title.
<br/><br/>

<b>Line Options:</b>
<br/><br/>

<b>Include reference line:</b> Specify the inclusion of a diagonal line indicating an ROC curve area of 0.50.
<br/><br/>

<b>Line width:</b> Specify the size of the lines on the ROC curve plot
<br/><br/>

<b>Color Palette:</b> Specify the color palette used for the ROC curve lines
<br/><br/>

<b>Axis Options:</b>
<br/><br/>

<b>Axis Label Size:</b> Specify the size of the axis labels used on the plot.
<br/><br/>

<b>Axis Tick Mark Label Size:</b> Specify the size of the axis tick mark labels.
<br/><br/>

<b>Legend Options:</b>
<br/><br/>

<b>Position:</b> Specify the position of the legend in the plot.  Can be right, top, bottom, or left.
<br/><br/>

<b>Title:</b> Specify the title for the legend.  Can be removed.
<br/><br/>

<b>Curve Labels:</b> Specify the curve labels used in the legend corresponding to the order of the curves (marker 1, marker 2, marker 3, etc.).  Specifying nothing will yield curve 
labels using the original marker variable names.  If you specify any labels, you must specify labels for all curves.  The order of the curves is the same as the specified order of the marker variables.
<br/><br/>

<b>Legend Labels Size:</b> Size of all text in the legend.
<br/><br/>

<b>R Packages Required:</b> timeROC, ggplot2, tidyverse, ggthemes, RColorBrewer, ggsci, survival
			`}
    }
}



class rocTdCompriskComparePro extends baseModal {
    constructor() {
        var config = {
            id: "rocTdCompriskComparePro",
            label: localization.en.title,
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
                 cause={{selected.eventcode | safe}},
                 weighting="marginal",
                 times={{selected.time | safe}},
                 iid=TRUE) 
}

# pairwise AUC tests

rocname1_vec <- c()
rocname2_vec <- c()
auc1_vec_def1 <- c()
auc2_vec_def1 <- c()
auc1_vec_def2 <- c()
auc2_vec_def2 <- c()
zpvalue_vec_def1 <- c()
zpvalue_vec_def2 <- c()
aucdiff_vec_def1 <- c()
aucdiff_vec_def2 <- c()

for (i in 1:(num_vars-1)) {
 for (j in (i+1):num_vars) {
    roc_pair <- compare(roc_list[[i]], roc_list[[j]])
    rocname1_vec <- c(rocname1_vec, pred_vars[i])
    rocname2_vec <- c(rocname2_vec, pred_vars[j])
    auc1_vec_def1 <- c(auc1_vec_def1, roc_list[[i]]$AUC_1[[2]])
    auc2_vec_def1 <- c(auc2_vec_def1, roc_list[[j]]$AUC_1[[2]])
    auc1_vec_def2 <- c(auc1_vec_def2, roc_list[[i]]$AUC_2[[2]])
    auc2_vec_def2 <- c(auc2_vec_def2, roc_list[[j]]$AUC_2[[2]])
    zpvalue_vec_def1 <- c(zpvalue_vec_def1, roc_pair$p_values_AUC_1[[2]])
    zpvalue_vec_def2 <- c(zpvalue_vec_def2, roc_pair$p_values_AUC_2[[2]])
    aucdiff_vec_def1 <- c(aucdiff_vec_def1, roc_list[[i]]$AUC_1[[2]]-roc_list[[j]]$AUC_1[[2]])
    aucdiff_vec_def2 <- c(aucdiff_vec_def2, roc_list[[i]]$AUC_2[[2]]-roc_list[[j]]$AUC_2[[2]])
 }
}

# sample size and variable output

ROC_summary <- data.frame(N=num_nonmiss, event={{selected.eventvar | safe}}, event_code={{selected.eventcode | safe}}, 
	time={{selected.timevar | safe}}, followup_time={{selected.time | safe}}, control="{{selected.controldef | safe}}")
BSkyFormat(ROC_summary, singleTableOutputHeader="Sample size and variables")

# pairwise AUC test output

{{if (options.selected.controldef=="free of any event")}}
rocpairs_table_def1 <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec_def1, Variable2=rocname2_vec,
                             AUC2=auc2_vec_def1, AUC_diff=aucdiff_vec_def1, p.value=zpvalue_vec_def1)
BSkyFormat(rocpairs_table_def1, singleTableOutputHeader="Pairwise Comparisons of ROC Curve Areas, control=free of any event")
{{#else}}
rocpairs_table_def2 <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec_def2, Variable2=rocname2_vec,
                             AUC2=auc2_vec_def2, AUC_diff=aucdiff_vec_def2, p.value=zpvalue_vec_def2)
BSkyFormat(rocpairs_table_def2, singleTableOutputHeader="Pairwise Comparisons of ROC Curve Areas, control=not a case")
{{/if}}

{{if (options.selected.multcompopt=="TRUE" & options.selected.controldef=="free of any event")}}
# multiple comparison adjustments

rocpairs_adjtable_def1 <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec_def1, Variable2=rocname2_vec,
                                AUC2=auc2_vec_def1, AUC_diff=aucdiff_vec_def1,
                                p.value=p.adjust(zpvalue_vec_def1,method="{{selected.multcompmethod | safe}}"))

BSkyFormat(rocpairs_adjtable_def1, singleTableOutputHeader="Multiple Comparison Adjusted Pairwise Comparisons of ROC Curve Areas, control=free of any event")
{{/if}}

{{if (options.selected.multcompopt=="TRUE" & options.selected.controldef=="not a case")}}
# multiple comparison adjustments

rocpairs_adjtable_def2 <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec_def2, Variable2=rocname2_vec,
                                AUC2=auc2_vec_def2, AUC_diff=aucdiff_vec_def2,
                                p.value=p.adjust(zpvalue_vec_def2,method="{{selected.multcompmethod | safe}}"))

BSkyFormat(rocpairs_adjtable_def2, singleTableOutputHeader="Multiple Comparison Adjusted Pairwise Comparisons of ROC Curve Areas, control=not a case")
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
  FP_TP_data_temp <- cbind(as.data.frame(roc_list[[i]]$FP_1), as.data.frame(roc_list[[i]]$FP_2), as.data.frame(roc_list[[i]]$TP))
	FP_TP_data_temp <- FP_TP_data_temp[, c(2,4,6)]
	names(FP_TP_data_temp) <- c("FP_1", "FP_2", "TP")
	FP_TP_data_temp <- mutate(FP_TP_data_temp, marker=pred_vars[i])
  FP_TP_data <- rbind(FP_TP_data, FP_TP_data_temp)
}

# making marker level order match the specified variable order

FP_TP_data <- mutate(FP_TP_data,
	marker=factor(marker, levels=pred_vars))

# plot

{{if (options.selected.controldef=="free of any event")}}
# control definition free of any event
ggplot(FP_TP_data, aes(x=FP_1, y=TP, color=marker)) +
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
{{#else}}
# control definition not a case
ggplot(FP_TP_data, aes(x=FP_2, y=TP, color=marker)) +
	geom_step(linewidth=1) +
	geom_segment(x=0, y=0, xend=1, yend=1, linetype=3, color="black") +
	labs(x="1-Specificity", y="Sensitivity", title="ROC Curve Comparison") +
	theme_classic() +
	theme(plot.title=element_text(size=20), axis.title=element_text(size=16),
        axis.text=element_text(size=12), legend.position="right", 
        legend.title=element_text(size=12), legend.text=element_text(size=12)) +
	scale_color
{{/if}}
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
                    label: localization.en.timevarlabel,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "UseComma|Enclosed",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvarlabel,
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "UseComma|Enclosed",
					required: true
                })
            },
			eventcode: {
				el: new inputSpinner(config, {
					no: 'eventcode',
					label: localization.en.eventcodelabel,
					min: 1,
					max: 1000,
					step: 1,
					value: 1,
					style: "ml-5 mb-3",
					extraction: "NoPrefix|UseComma"
				})
			},			
			markervars: {
                el: new dstVariableList(config, {
                    label: localization.en.markerslabel,
                    no: "markervars",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
					required: true
                })
            },			
			time: {
                el: new input(config, {
                    no: 'time',
                    label: localization.en.timelabel,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					enforceRobjectRules: false,
					width: "w-25",
                    extraction: "TextAsIs"
                })
            },
			controldef: {
                el: new selectVar(config, {
                    no: 'controldef',
                    label: localization.en.controldeflabel,
                    multiple: false,
					width: "w-50",
					style: "mt-3",
                    extraction: "NoPrefix|UseComma",
                    options: ["free of any event", "not a case"],
                    default: "free of any event"
                })
            },			
			multcompopt: {
				el: new checkbox(config, {
				label: localization.en.multcompopt,
				no: "multcompopt",
				style: "mt-3",
				extraction: "Boolean"
				})
			},
            multcompmethod: {
                el: new comboBox(config, {
                    no: 'multcompmethod',
                    label: localization.en.multcompmethod,
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
                    label: localization.en.themedropdownlabel,
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
                    label: localization.en.plottitlelabel,
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
				label: localization.en.plottitlesize,
				style: "mt-3",
				min: 5,
				max: 50,
				step: 1,
				value: 20,
				extraction: "NoPrefix|UseComma"
				})
			},
			lineoptionslabel: { el: new labelVar(config, { label: localization.en.lineoptionslabel, h: 5, style: "mt-4" }) },			
			linewidth: {
				el: new inputSpinner(config, {
					no: 'linewidth',
					label: localization.en.linewidthlabel,
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
					label: localization.en.reflinelabel,
					no: "reflinechkbox",
					state: "checked",
					style: "mt-2 ml-3 mb-3",
					extraction: "Boolean"
				})

			},
            colorpalette: {
                el: new comboBox(config, {
                    no: 'colorpalette',
                    label: localization.en.colorpalette,
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue"
                })
            },
			axisoptionslabel: { el: new labelVar(config, { label: localization.en.axisoptionslabel, h: 5, style: "mt-4" }) },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: localization.en.axislabelsize,
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
				label: localization.en.ticklabelsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},
			legendoptionslabel: { el: new labelVar(config, { label: localization.en.legendoptionslabel, h: 5, style: "mt-4" }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: localization.en.legendpos,
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
                    label: localization.en.legendtitle,
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
                    label: localization.en.curvelabels,
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
				label: localization.en.legendfontsize,
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
            right: [objects.timevar.el.content, objects.eventvar.el.content, objects.eventcode.el.content, objects.markervars.el.content, 
					objects.time.el.content, objects.controldef.el.content, objects.multcompopt.el.content, objects.multcompmethod.el.content],
			bottom: [plotpanel.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-icc",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
	

	
}
module.exports.item = new rocTdCompriskComparePro().render()