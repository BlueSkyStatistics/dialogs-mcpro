var localization = {
    en: {
        title: "ROC Curve, time-dependent competing risks",
        navigation: "ROC Curve, time-dependent competing risks",
		timevarlabel: "Time to event or censor",
		eventvarlabel: "Events (0 = censor, 1 = event 1, 2 = event 2, ...)",
		eventcodelabel: "Event Code",
		markerlabel: "Marker (larger values must correspond to higher event risk)",
		timeslabel: "Follow-up times to compute ROC curves (separate with commas, e.g. 100, 200)",
		controldeflabel: "Control definition",
		outputallestlabel: "Output dataset with ROC curve estimates for all marker cutoffs",
		outputdatasetlabel: "Output dataset name",
		themedropdownlabel: "Theme",
		plottitlelabel: "Title",
		linewidthlabel: "Line width",
		aucchkboxlabel: "Include AUC on plot",
		reflinelabel: "Include reference line",
		aucxlabel: "X axis location",
		aucylabel: "Y axis location",
		aucroundlabel: "Number of decimal places",
		aucsizelabel: "Size",
        help: {
            title: "ROC Curve, time-dependent competing risks",
            r_help: "help(timeROC, package ='timeROC')",
            body: `
This creates receiver operating characteristic curves for time-to-event data with competing risks using nonparametric inverse probability of censoring weighting estimators.
</br></br>
The methods are described in "Estimating and comparing time-dependent areas under receiver operating characteristic curves for censored event times with 
competing risks", Blanche P, Dartigues J, and Jacqmin-Gadda H. 2013, Statistics in Medicine, 32: 5381-5397.

<br/><br/>
The areas under the ROC curves with 95% confidence intervals are provided using two control definitions: 1) a subject that is free of any event, and 2) a subject that is not a case.  
ROC curve plots for each time point and a table of marker cutpoints 
that maximize Youden's Index are also created.  AUC's under both control definitions are provided.  The chosen control definition affects which ROC curve is shown, the marker cutpoints, and 
output dataset containing sensitivities, specificities, etc.  If the sample size is larger than 2000, it might take some time to run. 

<br/><br/>

<b>Time to event or censor:</b></br>
Variable for the time to the events (for those with events) and the time to censor (for those without any event) (required). Numeric only. </br></br>

<b>Events (0=censor, 1=event 1, 2=event 2, ...):</b></br>
Variable indicating those who are censored (=0) and who have each event type (= 1, 2, etc.)(required). Numeric only. </br></br>

<b>Event code:</b></br>
Variable indicating which event type (1, 2, etc.) defines the specific event for the ROC curve calculations (required). Numeric only. </br></br>

<b>Marker:</b> </br>
Specify the marker variable to compute the ROC curve for.  Larger values must correspond to higher event risk.  
Negate values if negatively associated with event risk.  Must be numeric. (required)</br></br>

<b>Follow-up times to compute ROC curves:</b></br>
Indicate the specific follow-up times that you want to compute ROC curves for.  Can be one or more values.  Must be on the same scale 
as the time variable. (required)</br></br> 

<b>Control definition:</b></br>
Indicate which subjects should be considered controls.  "Free of any event" means subjects with event times larger than the specified times (subjects who experience events with times larger than the specified times or 
censored times larger than the specified times).  Subjects with competing events before the specified times are not controls in this definition.  "Not a case" means subjects with event times larger than the specified times and those with competing events prior to the specfied times. 
Subjects with competing events before the specified times are considered controls in this definition. In both definitions, censored subjects before the specified times are not considered controls.  These censored 
subjects are only used to estimate the weights (the probability of being observed). (required)</br></br>  

<b>Output dataset with ROC curve estimates for all marker cutoffs:</b></br>
This produces an output dataset of all marker values for each specified follow-up time.  Sensitivities, specificities, positive predictive values, 
negative predictive values, and Youden's Index are provided. </br></br>

<b>Output dataset name:</b></br>
Specify the name of the dataset that will store the marker values, sensitivities, specificities, etc. </br></br>

<b>Plot Options</b>
</br></br>

<b>Theme:</b></br>
Choose a plot theme for the ROC curve plot</br></br>

<b>Title:</b></br>
Specify a title for the ROC curve plot</br></br>

<b>Line width:</b></br>
Specify the line width for the ROC curve lines on the plot.  Default is 1. </br></br>

<b>Include reference line:</b></br>
Specify whether to include a reference line on the ROC curve plot.  This is a diagnoal line that would correspond to an AUC of 0.50.</br></br>

<b>Include AUC on plot:</b></br>
Specify whether to include the specific AUC values and 95% confidence intervals on the ROC curve plot</br></br>

<b>X axis location:</b></br>
X axis location for placement of the AUC values on the ROC curve plot. Default is .75. </br></br>

<b>Y axis location:</b></br>
Y axis location for placement of the AUC values on the ROC curve plot. Default is .1. </br></br>

<b>Number of decimal places:</b></br>
Specify the number of decimals places to round to for the AUC values on the plot. Default is 2. </br></br>

<b>Size:</b></br>
Specify the size for the AUC values on the plot. Default is 4. </br></br>

<b>R Packages Required:</b> timeROC, ggplot2, tidyverse, ggthemes, survival
			`}
    }
}



class roctdcomprisk extends baseModal {
    constructor() {
        var config = {
            id: "roctdcomprisk",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(timeROC)
library(ggplot2)
library(tidyverse)
library(ggthemes)
library(survival)


ROC_output <- timeROC(T={{selected.timevar | safe}},
					delta={{selected.eventvar | safe}},
					marker={{selected.markervar | safe}},
					cause={{selected.eventcode | safe}}, weighting="marginal",
					times=c({{selected.times | safe}}),
					iid=TRUE)

# summary

ROC_summary <- data.frame(N=ROC_output$n, marker="{{selected.markeronly | safe}}", event="{{selected.eventonly | safe}}", event_code={{selected.eventcode | safe}}, time="{{selected.timeonly | safe}}")
BSkyFormat(ROC_summary, singleTableOutputHeader="Sample size and variables")

# AUC table

AUC_mat1 <- as.matrix(ROC_output$AUC_1)
dimnames(AUC_mat1)[[2]] <- "AUC1"
AUC_mat2 <- as.matrix(ROC_output$AUC_2)
dimnames(AUC_mat2)[[2]] <- "AUC2"

AUC_se_mat1 <- as.matrix(ROC_output$inference$vect_sd_1)
dimnames(AUC_se_mat1)[[2]] <- "SE1"
AUC_se_mat2 <- as.matrix(ROC_output$inference$vect_sd_2)
dimnames(AUC_se_mat2)[[2]] <- "SE2"

CI_table1 <- as.data.frame(confint(ROC_output)$CI_AUC_1)/100
dimnames(CI_table1)[[2]] <- c("CI_lower1", "CI_upper1")

CI_table2 <- as.data.frame(confint(ROC_output)$CI_AUC_2)/100
dimnames(CI_table2)[[2]] <- c("CI_lower2", "CI_upper2")

AUC_table <- as.data.frame(cbind(AUC_mat1, AUC_se_mat1, CI_table1,
                                 AUC_mat2, AUC_se_mat2, CI_table2))

AUC_table <- AUC_table[dimnames(AUC_table)[[1]]!="t=0", ]

BSkyFormat(as.data.frame(ROC_output$Stats), singleTableOutputHeader="Subject totals at each time")
BSkyFormat(AUC_table, singleTableOutputHeader="Time-dependent ROC curve using IPCW with 95% confidence intervals", perTableFooter="AUC1=control defined as a subject that is free of any event \nAUC2=control defined as a subject that is not a case")

# plots
# FP depends on which control definition is desired

{{if (options.selected.controldef=="free of any event")}}
FP_data <- as.data.frame(ROC_output$FP_1)
{{#else}}
FP_data <- as.data.frame(ROC_output$FP_2)
{{/if}}
TP_data <- as.data.frame(ROC_output$TP)

FP_long <- pivot_longer(data=FP_data, cols=names(FP_data), names_to="time", values_to="FP")

TP_long <- pivot_longer(data=TP_data, cols=names(TP_data), names_to="time", values_to="TP") %>%
	select(-time)

FP_TP_data <- bind_cols(FP_long, TP_long) %>%
	filter(time!="t=0") %>%
  mutate(time_f=factor(as.numeric(str_remove_all(time, "t=")),
                      labels=unique(time))) %>%
	arrange(time_f)

{{if (options.selected.controldef=="free of any event")}}
annot_labels <- rownames_to_column(AUC_table, var="time") %>%
	mutate(AUC=AUC1, lower=CI_lower1, upper=CI_upper1) %>%
  mutate(time_f=factor(as.numeric(str_remove_all(time, "t=")),
                       labels=unique(time)))
{{#else}}
annot_labels <- rownames_to_column(AUC_table, var="time") %>%
	mutate(AUC=AUC2, lower=CI_lower2, upper=CI_upper2) %>%
  mutate(time_f=factor(as.numeric(str_remove_all(time, "t=")),
                       labels=unique(time)))
{{/if}}

ggplot(FP_TP_data, aes(x=FP, y=TP)) +
	geom_step(linewidth={{selected.linewidth | safe}}) +
	{{if (options.selected.reflinechkbox=="TRUE")}}
	geom_segment(x=0, y=0, xend=1, yend=1, linetype=3) +
	{{/if}}
	labs(x="1-Specificity", y="Sensitivity", title="{{selected.plottitle | safe}}") +
	facet_wrap(~time_f) +
	{{if (options.selected.aucchkbox=="TRUE")}} 
	geom_text(data=annot_labels, 
            aes(x={{selected.aucx | safe}}, 
                y={{selected.aucy | safe}},				
                label=paste0("AUC: ", round(AUC, {{selected.aucround | safe}}), "\n95% CI: ", round(lower, {{selected.aucround | safe}}), "-", round(upper, {{selected.aucround | safe}}))), 
				size={{selected.aucsize | safe}}) +
	{{/if}}
	{{selected.themedropdown | safe}}


# sensitivity, etc. for all cutoffs

{{selected.outputdatasetname | safe}} <- NULL

for (i in sort(unique({{selected.markervar | safe}}))) {

sens_spec_output <- SeSpPPVNPV(cutpoint=i,
                               T={{selected.timevar | safe}},
                  			   delta={{selected.eventvar | safe}},
							   marker={{selected.markervar | safe}},
                    		   cause={{selected.eventcode | safe}}, weighting="marginal",
                  			   times=c({{selected.times | safe}}),   
                  			   iid=FALSE)

{{if (options.selected.controldef=="free of any event")}}  
sens_spec_tab <- cbind(sens_spec_output$Stats[, 1:4], sens_spec_output$TP,
            (1 - sens_spec_output$FP_1), sens_spec_output$PPV,
            sens_spec_output$NPV_1)
{{#else}}
sens_spec_tab <- cbind(sens_spec_output$Stats[, 1:4], sens_spec_output$TP,
            (1 - sens_spec_output$FP_2), sens_spec_output$PPV,
            sens_spec_output$NPV_2)
{{/if}}			

colnames(sens_spec_tab) <- c("Cases", "Survivors", "Other Events", "Censored",
            "Se", "Sp", "PPV", "NPV")

sens_spec_tab <- as.data.frame(sens_spec_tab) %>%
	rownames_to_column(var="time") %>%
	mutate(cutpoint=i) %>%
	relocate(cutpoint)
  
{{selected.outputdatasetname | safe}} <- bind_rows({{selected.outputdatasetname | safe}}, sens_spec_tab)  
}

{{selected.outputdatasetname | safe}} <- mutate({{selected.outputdatasetname | safe}}, youden=Se+Sp-1) %>%
	filter(time!="t=0")

{{selected.outputdatasetname | safe}} <- {{selected.outputdatasetname | safe}} %>%
	mutate(time=as.numeric(str_remove_all(time, "t="))) %>%
	arrange(time) %>%
	group_by(time) %>%
	mutate(max_youden=ifelse(youden==max(youden), "*", NA)) %>%
  ungroup()

{{if (options.selected.outputallest=="TRUE")}}
BSkyLoadRefresh("{{selected.outputdatasetname | safe}}")
{{/if}}

cutpoint_best <- filter({{selected.outputdatasetname | safe}}, max_youden=="*") %>%
	dplyr::select(time, cutpoint, Se, Sp, PPV, NPV, youden)

BSkyFormat(as.data.frame(cutpoint_best), singleTableOutputHeader="Marker cutpoints that maximize Youden's Index")

suppressWarnings(rm("ROC_output", "ROC_summary", "AUC_mat1", "AUC_mat2", "AUC_se_mat1", "AUC_se_mat2", "AUC_table",
	"CI_table", "FP_data", "TP_data", "FP_long", "TP_long", "FP_TP_data", "annot_labels", "i", "sens_spec_output",
	"sens_spec_tab", "cutpoint_best"))

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
                    extraction: "Prefix|UseComma",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvarlabel,
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "Prefix|UseComma",
					required: true
                })
            },
			eventcode: {
				el: new inputSpinner(config, {
					no: 'eventcode',
					label: localization.en.eventcodelabel,
					min: 1,
					max: 100,
					step: 1,
					value: 1,
					style: "ml-5 mb-4",
					extraction: "NoPrefix|UseComma"
				})
			},			
			markervar: {
                el: new dstVariable(config, {
                    label: localization.en.markerlabel,
                    no: "markervar",
                    filter: "Numeric|Scale",
                    extraction: "Prefix|UseComma",
					required: true
                })
            },			
			times: {
                el: new input(config, {
                    no: 'times',
                    label: localization.en.timeslabel,
                    placeholder: "",
                    required: true,
                    type: "character",
					allowSpacesNew: true,
                    enforceRobjectRules: false,
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
			outputallest: {
				el: new checkbox(config, {
					label: localization.en.outputallestlabel,
					no: "outputallest",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			outputdatasetname: {
                el: new input(config, {
                    no: 'outputdatasetname',
                    label: localization.en.outputdatasetlabel,
                    value: "sens_spec_data",
					enforceRobjectRules:true,
					style: "ml-5 mb-5",
                    extraction: "TextAsIs",
                    required: false,
                    type: "character"
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
                    value: "Time-dependent ROC Curve",
                    required: false,
                    type: "character",
					style: "mb-3",
					width: "w-50",
                    enforceRobjectRules:false,
                    extraction: "TextAsIs"
				})
            },
			linewidth: {
				el: new inputSpinner(config, {
					no: 'linewidth',
					label: localization.en.linewidthlabel,
					min: .25,
					max: 10,
					step: 0.25,
					value: 1,
					extraction: "NoPrefix|UseComma"
				})
			},
			reflinechkbox: {
				el: new checkbox(config, {
					label: localization.en.reflinelabel,
					no: "reflinechkbox",
					state: "checked",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			aucchkbox: {
				el: new checkbox(config, {
					label: localization.en.aucchkboxlabel,
					no: "aucchkbox",
					state: "checked",
					style: "mt-4",
					extraction: "Boolean",
					newline: true
				})
			},
			aucx: {
                el: new input(config, {
                    no: 'aucx',
                    label: localization.en.aucxlabel,
                    placeholder: ".75",
                    type: "numeric",
					allow_spaces: true,
                    extraction: "TextAsIs",
					style: "ml-5",
					width: "w-25",
                    value: ".75",
                })
            },
			aucy: {
                el: new input(config, {
                    no: 'aucy',
                    label: localization.en.aucylabel,
                    placeholder: ".1",
                    type: "numeric",
					allow_spaces: true,
                    extraction: "TextAsIs",
					style: "ml-5",
					width: "w-25",
                    value: ".1",
                })
            },
			aucround: {
				el: new inputSpinner(config, {
					no: 'aucround',
					label: localization.en.aucroundlabel,
					min: 1,
					max: 10,
					step: 1,
					value: 2,
					style: "ml-4",
					extraction: "NoPrefix|UseComma"
				})
			},
			aucsize: {
				el: new inputSpinner(config, {
					no: 'aucsize',
					label: localization.en.aucsizelabel,
					min: 1,
					max: 10,
					step: .5,
					value: 4,
					style: "ml-4",
					extraction: "NoPrefix|UseComma"
				})
			}				
		}
		
		var plotpanel = {
            el: new optionsVar(config, {
                no: "plotpanel",
                name: "Plot Options",
                content: [
                    objects.themedropdown.el, objects.plottitle.el, objects.linewidth.el,
					objects.reflinechkbox.el, objects.aucchkbox.el, objects.aucx.el, objects.aucy.el, objects.aucround.el, objects.aucsize.el
					]
				})
		}	
		
			
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.timevar.el.content, objects.eventvar.el.content, objects.eventcode.el.content, objects.markervar.el.content, objects.times.el.content, 
					objects.controldef.el.content, objects.outputallest.el.content, objects.outputdatasetname.el.content],
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
		let markervarapp=code_vars.selected.markervar
		let eventvarapp=code_vars.selected.eventvar
		let timevarapp=code_vars.selected.timevar
		
		let markerwords=markervarapp.split('$')
		let eventwords=eventvarapp.split('$')
		let timewords=timevarapp.split('$')
		
		let markeronly=markerwords[1]
		let eventonly=eventwords[1]
		let timeonly=timewords[1]
	
		//create new variables under code_vars
		code_vars.selected.markeronly = markeronly
		code_vars.selected.eventonly = eventonly
		code_vars.selected.timeonly = timeonly
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}				


	
	
}
module.exports.item = new roctdcomprisk().render()