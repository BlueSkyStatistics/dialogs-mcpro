



class rocTdPro extends baseModal {
    static dialogId = 'rocTdPro'
    static t = baseModal.makeT(rocTdPro.dialogId)

    constructor() {
        var config = {
            id: rocTdPro.dialogId,
            label: rocTdPro.t('title'),
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
					cause=1, weighting="marginal",
					times=c({{selected.times | safe}}),
					iid=TRUE)

# summary

ROC_summary <- data.frame(N=ROC_output$n, marker="{{selected.markeronly | safe}}", event="{{selected.eventonly | safe}}", time="{{selected.timeonly | safe}}")
BSkyFormat(ROC_summary, singleTableOutputHeader="Sample size and variables")

# AUC table

AUC_mat <- as.matrix(ROC_output$AUC)
dimnames(AUC_mat)[[2]] <- "AUC"

AUC_se_mat <- as.matrix(ROC_output$inference$vect_sd_1)
dimnames(AUC_se_mat)[[2]] <- "SE"

AUC_table <- as.data.frame(cbind(ROC_output$Stats, 
                   AUC_mat, 
                   AUC_se_mat))

AUC_table <- AUC_table[dimnames(AUC_table)[[1]]!="t=0", ]

CI_table <- as.data.frame(confint(ROC_output)$CI_AUC)/100

AUC_table <- cbind(AUC_table, CI_table)

BSkyFormat(AUC_table, singleTableOutputHeader="Time-dependent ROC curve using IPCW with 95% confidence interval")

# plots

FP_data <- as.data.frame(ROC_output$FP)
TP_data <- as.data.frame(ROC_output$TP)

FP_long <- pivot_longer(data=FP_data, cols=names(FP_data), names_to="time", values_to="FP")

TP_long <- pivot_longer(data=TP_data, cols=names(TP_data), names_to="time", values_to="TP") %>%
	dplyr::select(-time)

FP_TP_data <- bind_cols(FP_long, TP_long) %>%
	filter(time!="t=0") %>%
	mutate(time_f=factor(as.numeric(str_remove_all(time, "t=")),
                      labels=unique(time))) %>%
	arrange(time_f)

annot_labels <- rownames_to_column(AUC_table, var="time") %>%
	rename(lower="2.5%", upper="97.5%") %>%
	mutate(time_f=factor(as.numeric(str_remove_all(time, "t=")),
						labels=unique(time)))

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
                    		   cause=1, weighting="marginal",
                  			   times=c({{selected.times | safe}}),   
                  			   iid=FALSE)
  
sens_spec_tab <- cbind(sens_spec_output$Stats[, 1:3], sens_spec_output$TP,
            (1 - sens_spec_output$FP), sens_spec_output$PPV,
            sens_spec_output$NPV) 

colnames(sens_spec_tab) <- c("Cases", "Survivors", "Censored",
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

suppressWarnings(rm("ROC_output", "ROC_summary", "AUC_mat", "AUC_se_mat", "AUC_table",
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
                    label: rocTdPro.t('timevarlabel'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "Prefix|UseComma",
					required: true
                })
            },
			eventvar: {
                el: new dstVariable(config, {
                    label: rocTdPro.t('eventvarlabel'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    extraction: "Prefix|UseComma",
					required: true
                })
            },
			markervar: {
                el: new dstVariable(config, {
                    label: rocTdPro.t('markerlabel'),
                    no: "markervar",
                    filter: "Numeric|Scale",
                    extraction: "Prefix|UseComma",
					required: true
                })
            },			
			times: {
                el: new input(config, {
                    no: 'times',
                    label: rocTdPro.t('timeslabel'),
                    placeholder: "",
                    required: true,
                    type: "character",
					allowSpacesNew: true,
                    enforceRobjectRules: false,
                    extraction: "TextAsIs"
                })
            },										
			outputallest: {
				el: new checkbox(config, {
					label: rocTdPro.t('outputallestlabel'),
					no: "outputallest",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			outputdatasetname: {
                el: new input(config, {
                    no: 'outputdatasetname',
                    label: rocTdPro.t('outputdatasetlabel'),
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
                    label: rocTdPro.t('themedropdownlabel'),
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
                    label: rocTdPro.t('plottitlelabel'),
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
					label: rocTdPro.t('linewidthlabel'),
					min: .25,
					max: 10,
					step: 0.25,
					value: 1,
					extraction: "NoPrefix|UseComma"
				})
			},
			reflinechkbox: {
				el: new checkbox(config, {
					label: rocTdPro.t('reflinelabel'),
					no: "reflinechkbox",
					state: "checked",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			aucchkbox: {
				el: new checkbox(config, {
					label: rocTdPro.t('aucchkboxlabel'),
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
                    label: rocTdPro.t('aucxlabel'),
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
                    label: rocTdPro.t('aucylabel'),
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
					label: rocTdPro.t('aucroundlabel'),
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
					label: rocTdPro.t('aucsizelabel'),
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
            right: [objects.timevar.el.content, objects.eventvar.el.content, objects.markervar.el.content, objects.times.el.content, objects.outputallest.el.content, objects.outputdatasetname.el.content],
			bottom: [plotpanel.el.content],
            nav: {
                name: rocTdPro.t('navigation'),
                icon: "icon-icc",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: rocTdPro.t('help.title'),
            r_help: rocTdPro.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: rocTdPro.t('help.body')
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

module.exports = {
    render: () => new rocTdPro().render()
}
