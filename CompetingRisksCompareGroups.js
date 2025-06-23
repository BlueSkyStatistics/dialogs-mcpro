/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class CompetingRisksCompareGroups extends baseModal {
    static dialogId = 'CompetingRisksCompareGroups'
    static t = baseModal.makeT(CompetingRisksCompareGroups.dialogId)

    constructor() {
        var config = {
            id: CompetingRisksCompareGroups.dialogId,
            label: CompetingRisksCompareGroups.t('title'),
            modalType: "two",
            RCode: `
library(survival)
library(broom)
library(survminer)
library(dplyr)
library(forcats)
library(arsenal)
library(ggthemes)
library(ggsci)
library(RColorBrewer)
library(scales)
library(cmprsk)

fit1 <- survfit(Surv({{selected.timevar | safe}}, factor({{selected.eventvar | safe}})) ~ {{selected.groupvar | safe}}, data={{dataset.name}})

# event, time, and group variables
eventvar <- data.frame(event.var="{{selected.eventvar | safe}}", time.var="{{selected.timevar | safe}}", group.var="{{selected.groupvar | safe}}")
BSkyFormat(eventvar, singleTableOutputHeader="Event, Time, and Group Variables")

# sample size, number of events, and restricted means for each event
summary_table <- data.frame(group_event=rownames(summary(fit1)$table), summary(fit1)$table)
BSkyFormat(summary_table,singleTableOutputHeader="Sample Size, Number of Events, and Restricted Mean Time in State")
meanmaxtime <- data.frame(max.time=summary(fit1)$rmean.endtime)
BSkyFormat(meanmaxtime, singleTableOutputHeader="Maximum Time")

# median follow-up times and total events
dataforfup <- {{dataset.name}} %>% 
	dplyr::mutate(allevents=ifelse({{selected.eventvar | safe}} != 0, 1, 0))
kmsummary <- tableby({{selected.groupvar | safe}}~Surv({{selected.timevar | safe}},allevents),data=dataforfup,surv.stats=c("N","Nmiss","Nevents","medTime"),test=FALSE)
BSkyFormat(as.data.frame(summary(kmsummary,text=TRUE)),singleTableOutputHeader="Overall Events and Follow-Up Time by Group={{selected.groupvar | safe}}")

# Gray's tests
cuminc_tests <- cuminc(ftime={{dataset.name}}{{selected.timevardollar | safe}}, fstatus={{dataset.name}}{{selected.eventvardollar | safe}}, group={{dataset.name}}{{selected.groupvardollar | safe}}, cencode=0)
cuminc_tests_table <- data.frame({{selected.eventvar | safe}}=rownames(cuminc_tests$Tests), cuminc_tests$Tests)
rownames(cuminc_tests_table) <- NULL
BSkyFormat(cuminc_tests_table, singleTableOutputHeader="Gray's Test Comparing Groups for Each Event")

# cumulative incidence estimates
est1 <- as.data.frame(tidy(fit1))
est1 <- est1 %>% 
	filter(state!="(s0)") %>% 
	dplyr::select(strata, state, time, n.event:std.error, conf.low, conf.high) %>% 
	rename(event_label=state)

# removing unused factor level for censor, assigning event labels, and a numeric event variable
est1$event_label <- fct_drop(est1$event_label, only="(s0)")
est1 <- dplyr::dplyr::mutate(est1, {{selected.eventvar | safe}}=as.numeric(event_label))
{{selected.eventlabels | safe}}

# filling in estimates of 0 so curves start at 0
firstobs_event <- est1 %>% 
	group_by({{selected.eventvar | safe}}) %>% 
	slice_head() %>% 
	dplyr::mutate(time=0,n.event=0,n.censor=0,estimate=0,std.error=0,conf.low=NA_real_,conf.high=NA_real_)

est1 <- bind_rows(est1,firstobs_event)
est1 <- arrange(est1,strata,{{selected.eventvar | safe}},time)

# creating a strata label variable
est1$strata_label <- factor(est1$strata)
{{selected.grouplabels | safe}}\n
est1 <- dplyr::select(est1, strata, strata_label, {{selected.eventvar | safe}}, everything())

{{if (options.selected.printallest=="TRUE")}}
BSkyFormat(est1, singleTableOutputHeader="Cumulative Incidence Estimates for Each Event by Group={{selected.groupvar | safe}}, 95% Confidence Intervals")
{{/if}}

{{if ((options.selected.printspecest=="TRUE") & (options.selected.spectimes!=""))}}
cat("Cumulative Incidence Estimates for Each Event by Group\n")
summary(fit1, times=c({{selected.spectimes | safe}}))
{{/if}}


##### creating plot for all events #####

# set up time axis parameters based on presence of max parameter

xaxis_min <- {{selected.timeaxismin | safe}}\n
xaxis_max <- c({{selected.timeaxismax | safe}})
xaxis_tickfreq <- c({{selected.timeaxisinc | safe}})

# creating time axis limits and tick breaks
if (is.null(xaxis_max)) {
time_limits <- c(xaxis_min,NA)
} else {
time_limits <- c(0,xaxis_max)
}

# tick marks is waiver() when max is NULL or a value
if (is.null(xaxis_tickfreq)) {
time_breaks <- waiver()
} else {
time_breaks <- seq(xaxis_min,xaxis_max,by=xaxis_tickfreq)
}


# setting up colors
color_pal_spec <- "{{selected.colorpalette | safe}}"

if (color_pal_spec=="hue") {
scale_color <- scale_color_hue()
scale_fill <- scale_fill_hue()
} else if (color_pal_spec=="grey") {
scale_color <- scale_color_grey()
scale_fill <- scale_fill_grey()
} else if (color_pal_spec=="Greys") {
scale_color <- scale_color_brewer(palette="Greys")
scale_fill <- scale_fill_brewer(palette="Greys")
} else if (color_pal_spec=="Set1") {
scale_color <- scale_color_brewer(palette="Set1")
scale_fill <- scale_fill_brewer(palette="Set1")
} else if (color_pal_spec=="Set2") {
scale_color <- scale_color_brewer(palette="Set2")
scale_fill <- scale_fill_brewer(palette="Set2")
} else if (color_pal_spec=="Dark2") {
scale_color <- scale_color_brewer(palette="Dark2")
scale_fill <- scale_fill_brewer(palette="Dark2")
} else if (color_pal_spec=="npg") {
scale_color <- scale_color_npg()
scale_fill <- scale_fill_npg()
} else if (color_pal_spec=="aaas") {
scale_color <- scale_color_aaas()
scale_fill <- scale_fill_aaas()
} else if (color_pal_spec=="nejm") {
scale_color <- scale_color_nejm()
scale_fill <- scale_fill_nejm()
} else if (color_pal_spec=="lancet") {
scale_color <- scale_color_lancet()
scale_fill <- scale_fill_lancet()
} else if (color_pal_spec=="jama") {
scale_color <- scale_color_jama()
scale_fill <- scale_fill_jama()
} else if (color_pal_spec=="jco") {
scale_color <- scale_color_jco()
scale_fill <- scale_fill_jco()
}



# grouping strata and event together to create a grouping for plot
est1 <- est1 %>% dplyr::mutate(plot.groupvar=paste0(strata,event_label))

myplot <- ggplot(est1, aes(x = time, y = estimate, color = strata_label, linetype=event_label)) +
  geom_step(lwd = {{selected.linesize | safe}}) +
  scale_y_continuous(labels={{selected.scalebox | safe}}, limits=c({{selected.incaxismin | safe}},{{selected.incaxismax | safe}}), breaks=seq({{selected.incaxismin | safe}}, {{selected.incaxismax | safe}}, by={{selected.incaxisinc | safe}})) +
  scale_x_continuous(limits=time_limits, breaks=time_breaks) +
  {{selected.themedropdown | safe}} +
  scale_color +
  scale_fill +
  theme(legend.position = "{{selected.legendpos | safe}}", legend.key.width=unit({{selected.keywidth | safe}},"cm"), legend.box="vertical", legend.text=element_text(size={{selected.legendfontsize | safe}}), legend.title=element_text(size={{selected.legendfontsize | safe}}), plot.title=element_text(size={{selected.plottitlesize | safe}}), axis.title.x=element_text(size={{selected.axislabelsize | safe}}), axis.text.x=element_text(size={{selected.ticklabelsize | safe}}), axis.title.y=element_text(size={{selected.axislabelsize | safe}}), axis.text.y=element_text(size={{selected.ticklabelsize | safe}})) +
  labs(x = "{{selected.timeaxislabel | safe}}", 
       y = "{{selected.incaxislabelall | safe}}",
       title = "{{selected.titleboxall | safe}}",
       color = " {{selected.grouplegendtitle | safe}}",
       linetype = " {{selected.eventlegendtitle | safe}}")

{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="ribbon"))}}
# addition of ribbon CIs (conditions are want CI and ribbon)
myplot <- myplot+geom_ribbon(aes(ymin=conf.low, ymax=conf.high, fill=strata_label, group=plot.groupvar), alpha={{selected.citransparency | safe}}, linetype=0, show.legend=FALSE)
{{/if}}
{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="step"))}}
# addition of step CIs (conditions are want CI and step)
myplot <- myplot+geom_step(aes(x=time, y=conf.low, color=strata_label, linetype=event_label), lwd=1, na.rm=TRUE, show.legend=FALSE)+geom_step(aes(x=time, y=conf.high, color=strata_label, linetype=event_label), lwd=1, na.rm=TRUE, show.legend=FALSE)
{{/if}}

# extracting time axis limits and tickmarks
# needed for default case when user does not specify
plot_components <- ggplot_build(myplot)
plot_time_limits <- layer_scales(myplot)$x$get_limits()
plot_time_breaks <- plot_components$layout$panel_params[[1]]$x$breaks

plot_time_inc <- plot_time_breaks[2]-plot_time_breaks[1]

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="FALSE"))}}
# addition of number at risk
all_fit <- survfit(Surv({{selected.timevar | safe}},allevents) ~ {{selected.groupvar | safe}}, data=dataforfup)
numatrisk <- ggsurvplot(fit=all_fit, risk.table=TRUE, xlim=plot_time_limits, break.time.by=plot_time_inc, risk.table.fontsize={{selected.risktablevaluesize | safe}}, tables.theme=theme_survminer(font.main=15), legend="none", legend.labs=levels(est1$strata_label), legend.title=" ", xlab="{{selected.timeaxislabel | safe}}")
myplot <- cowplot::plot_grid(myplot, numatrisk$table + {{selected.themedropdown | safe}} + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.text.x=element_text(size={{selected.risktableticklabelsize | safe}}), axis.text.y=element_text(size={{selected.risktableticklabelsize | safe}})), nrow=2, rel_heights=c(1-{{selected.risktableprop | safe}},{{selected.risktableprop | safe}}), align="v", axis="lr")
{{/if}}
{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="TRUE"))}}
# addition of number at risk with clean risk table
all_fit <- survfit(Surv({{selected.timevar | safe}},allevents) ~ {{selected.groupvar | safe}}, data=dataforfup)
numatrisk <- ggsurvplot(fit=all_fit, risk.table=TRUE, xlim=plot_time_limits, break.time.by=plot_time_inc, risk.table.fontsize={{selected.risktablevaluesize | safe}}, tables.theme=theme_survminer(font.main=15), legend="none", legend.labs=levels(est1$strata_label), legend.title=" ", xlab="{{selected.timeaxislabel | safe}}")
myplot <- cowplot::plot_grid(myplot, numatrisk$table + {{selected.themedropdown | safe}} + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x=element_blank(), axis.text.x=element_blank(), axis.text.y=element_text(size={{selected.risktableticklabelsize | safe}}), axis.line=element_blank(), axis.ticks=element_blank(), panel.grid.major=element_blank(), panel.grid.minor=element_blank()), nrow=2, rel_heights=c(1-{{selected.risktableprop | safe}},{{selected.risktableprop | safe}}), align="v", axis="lr")
{{/if}}

myplot



##### facetted plot #####

fac_plot <- ggplot(est1, aes(x = time, y = estimate, color = strata_label, group=strata_label)) +
  geom_step(lwd = {{selected.linesize | safe}}) +
{{if (options.selected.censorchkbox=="TRUE")}} geom_point(data=filter(est1, n.censor>0), shape=3, size={{selected.censorsize | safe}}, show.legend=FALSE) +
{{/if}}
  scale_y_continuous(labels={{selected.scalebox | safe}}, limits=c({{selected.incaxismin | safe}},{{selected.incaxismax | safe}}), breaks=seq({{selected.incaxismin | safe}}, {{selected.incaxismax | safe}}, by={{selected.incaxisinc | safe}})) +
  scale_x_continuous(limits=time_limits, breaks=time_breaks) +
  {{selected.themedropdown | safe}} +
  scale_color +
  scale_fill +
  theme(legend.position = "{{selected.legendpos | safe}}", legend.text=element_text(size={{selected.legendfontsize | safe}}), legend.title=element_text(size={{selected.legendfontsize | safe}}), plot.title=element_text(size={{selected.plottitlesize | safe}}), axis.title.x=element_text(size={{selected.axislabelsize | safe}}), axis.text.x=element_text(size={{selected.ticklabelsize | safe}}), axis.title.y=element_text(size={{selected.axislabelsize | safe}}), axis.text.y=element_text(size={{selected.ticklabelsize | safe}}), strip.text.x=element_text(size={{selected.wraplabelfontsize | safe}})) +
  labs(x = "{{selected.timeaxislabel | safe}}", 
       y = "{{selected.incaxislabelall | safe}}",
       title = "{{selected.titleboxall | safe}}",
       color = " {{selected.grouplegendtitle | safe}}") +
  facet_wrap(~event_label)

{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="ribbon"))}}
# addition of ribbon CIs (conditions are want CI and ribbon)
fac_plot <- fac_plot+geom_ribbon(aes(ymin=conf.low, ymax=conf.high, fill=strata_label), alpha={{selected.citransparency | safe}}, linetype=0, show.legend=FALSE)
{{/if}}
{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="step"))}}
# addition of step CIs (conditions are want CI and step)
fac_plot <- fac_plot+geom_step(aes(x=time, y=conf.low, color=strata_label), lwd=1, linetype=2, na.rm=TRUE)+geom_step(aes(x=time, y=conf.high, color=strata_label), lwd=1, linetype=2, na.rm=TRUE, show.legend=FALSE)
{{/if}}

fac_plot



##### single event plot #####

{{if (options.selected.singleeventchkbox=="TRUE")}}

singleeventspec <- data.frame({{selected.eventvar | safe}}={{selected.eventnum | safe}})
BSkyFormat(singleeventspec, singleTableOutputHeader="Single Event Specified")

singleeventplot <- ggplot(filter(est1, {{selected.eventvar | safe}}=={{selected.eventnum | safe}}), aes(x = time, y = estimate, color=strata_label, group=strata_label)) +
  geom_step(lwd = {{selected.linesize | safe}}) +
{{if (options.selected.censorchkbox=="TRUE")}} geom_point(data=filter(est1, {{selected.eventvar | safe}}=={{selected.eventnum | safe}}, n.censor>0), shape=3, size={{selected.censorsize | safe}}, show.legend=FALSE) +
{{/if}}
  scale_y_continuous(labels={{selected.scalebox | safe}}, limits=c({{selected.incaxismin | safe}},{{selected.incaxismax | safe}}), breaks=seq({{selected.incaxismin | safe}}, {{selected.incaxismax | safe}}, by={{selected.incaxisinc | safe}})) +
  scale_x_continuous(limits=time_limits, breaks=time_breaks) +
  {{selected.themedropdown | safe}} +
  scale_color +
  scale_fill +
{{if (options.selected.pvaluechkbox=="TRUE")}}  annotate("text", label=pvalue(cuminc_tests$Tests[{{selected.eventnum | safe}},2], accuracy={{selected.pvalueaccuracy | safe}}, add_p=TRUE), x={{selected.pvaluelocationx | safe}}, y={{selected.pvaluelocationy | safe}}, hjust=0, size={{selected.pvaluesize | safe}}) +
{{/if}}
  theme(legend.position = "{{selected.legendpos | safe}}", legend.text=element_text(size={{selected.legendfontsize | safe}}), legend.title=element_text(size={{selected.legendfontsize | safe}}), plot.title=element_text(size={{selected.plottitlesize | safe}}), axis.title.x=element_text(size={{selected.axislabelsize | safe}}), axis.text.x=element_text(size={{selected.ticklabelsize | safe}}), axis.title.y=element_text(size={{selected.axislabelsize | safe}}), axis.text.y=element_text(size={{selected.ticklabelsize | safe}})) +
  labs(x = "{{selected.timeaxislabel | safe}}", 
       y = "{{selected.incaxislabelsingle | safe}}",
       title = "{{selected.titleboxsingle | safe}}",
       color = " {{selected.grouplegendtitle | safe}}")

{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="ribbon"))}}
# addition of ribbon CIs (conditions are want CI and ribbon)
singleeventplot <- singleeventplot+geom_ribbon(aes(ymin=conf.low, ymax=conf.high, fill=strata_label), alpha={{selected.citransparency | safe}}, linetype=0, show.legend=FALSE)
{{/if}}
{{if ((options.selected.cichkbox=="TRUE") & (options.selected.cistyle=="step"))}}
# addition of step CIs (conditions are want CI and step)
singleeventplot <- singleeventplot+geom_step(aes(x=time, y=conf.low, color=strata_label), lwd=1, linetype=2, na.rm=TRUE, show.legend=FALSE)+geom_step(aes(x=time, y=conf.high, color=strata_label), lwd=1, linetype=2, na.rm=TRUE, show.legend=FALSE)
{{/if}}

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="FALSE"))}}
# addition of number at risk
singleeventplot <- cowplot::plot_grid(singleeventplot, numatrisk$table + {{selected.themedropdown | safe}} + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.text.x=element_text(size={{selected.risktableticklabelsize | safe}}), axis.text.y=element_text(size={{selected.risktableticklabelsize | safe}})), nrow=2, rel_heights=c(1-{{selected.risktableprop | safe}},{{selected.risktableprop | safe}}), align="v", axis="lr")
{{/if}}
{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="TRUE"))}}
# addition of number at risk with clean risk table
singleeventplot <- cowplot::plot_grid(singleeventplot, numatrisk$table + {{selected.themedropdown | safe}} + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x=element_blank(), axis.text.x=element_blank(), axis.text.y=element_text(size={{selected.risktableticklabelsize | safe}}), axis.line=element_blank(), axis.ticks=element_blank(), panel.grid.major=element_blank(), panel.grid.minor=element_blank()), nrow=2, rel_heights=c(1-{{selected.risktableprop | safe}},{{selected.risktableprop | safe}}), align="v", axis="lr")
{{/if}}

singleeventplot
{{/if}}          
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            timevar: {
                el: new dstVariable(config, {
                    label: CompetingRisksCompareGroups.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CompetingRisksCompareGroups.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            groupvar: {
                el: new dstVariable(config, {
                    label: CompetingRisksCompareGroups.t('groupvarlabel'),
                    no: "groupvar",
                    filter: "String|Numeric|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },			
            singleeventchkbox: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('singleeventchkbox'),
                    no: "singleeventchkbox",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            eventnum: {
                el: new inputSpinner(config, {
                    no: 'eventnum',
                    label: CompetingRisksCompareGroups.t('eventnum'),
					style: "mt-3",
                    min: 1,
                    max: 100,
                    ml: 4,
                    step: 1,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            printallest: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('printallest'),
                    no: "printallest",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('printspecest'),
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },
            spectimes: {
                el: new input(config, {
                    no: 'spectimes',
                    label: CompetingRisksCompareGroups.t('spectimes'),
					style: "ml-5 mb-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type: "character",
                })
            },			

            titleboxall: {
                el: new input(config, {
                    no: 'titleboxall',
                    label: CompetingRisksCompareGroups.t('titleboxall'),
                    placeholder: "Competing Risks Estimates for All Events",
                    extraction: "TextAsIs",
                    value: "Competing Risks Estimates for All Events",
                    allow_spaces:true,
                    type: "character",
                })
            },
            titleboxsingle: {
                el: new input(config, {
                    no: 'titleboxsingle',
                    label: CompetingRisksCompareGroups.t('titleboxsingle'),
                    placeholder: "Competing Risks Estimates for a Single Event",
                    style: "mt-2 mb-3",
                    extraction: "TextAsIs",
                    value: "Competing Risks Estimates for a Single Event",
                    allow_spaces:true,
                    type: "character",
                })
            },
			plottitlesize: {
				el: new inputSpinner(config,{
				no: 'plottitlesize',
				label: CompetingRisksCompareGroups.t('plottitlesizelabel'),
				style: "mt-3",
				min: 5,
				max: 50,
				step: 1,
				value: 20,
				extraction: "NoPrefix|UseComma"
				})
			},				
            themedropdown: {
                el: new comboBox(config, {
                    no: 'themedropdown',
                    label: CompetingRisksCompareGroups.t('themedropdown'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["theme_base()", "theme_bw()", "theme_calc()",
                    "theme_classic()", "theme_clean()", "theme_cleantable()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()","theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_survminer()", "theme_tufte()",
                    "theme_wsj()"],
                    default: "theme_survminer()"
                })
            },
            label1: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label1'), h: 5, style:"mt-3" }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: CompetingRisksCompareGroups.t('legendpos'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["top", "bottom", "left", "right"],
                    default: "top",
                    style: "ml-4"
                })
            },
            keywidth: {
                el: new inputSpinner(config, {
                    no: 'keywidth',
                    label: CompetingRisksCompareGroups.t('keywidthlabel'),
                    min: 1,
                    max: 100,
                    ml: 2,
                    step: 0.25,
                    value: 2,
                    extraction: "NoPrefix|UseComma"
                })
            },
            legendeventslabel: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('legendeventslabel'), h: 5, style:"mt-3 ml-4" }) },
			
            eventlegendtitle: {
                el: new input(config, {
                    no: 'eventlegendtitle',
                    label: CompetingRisksCompareGroups.t('legendtitle'),
                    placeholder: "Event",
                    ml: 5,
                    extraction: "TextAsIs",
                    value: "Event",
                    allow_spaces:true,
                    type: "character",
                })
            },

            eventlabels: {
                el: new input(config, {
                    no: 'eventlabels',
                    label: CompetingRisksCompareGroups.t('eventlabels'),
                    placeholder: "",
                    ml: 5,
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    type: "character",
					wrapped:'levels(est1$event_label) <- c(%val%)'
                })
            },
            legendgroupslabel: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('legendgroupslabel'), h: 5, style:"mt-3 ml-4" }) },			
            grouplegendtitle: {
                el: new input(config, {
                    no: 'grouplegendtitle',
                    label: CompetingRisksCompareGroups.t('legendtitle'),
                    placeholder: "Strata",
                    ml: 5,
                    extraction: "TextAsIs",
                    value: "Strata",
                    allow_spaces:true,
                    type: "character",
                })
            },			
            grouplabels: {
                el: new input(config, {
                    no: 'grouplabels',
                    label: CompetingRisksCompareGroups.t('grouplabels'),
                    placeholder: "",
                    ml: 5,
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    type: "character",
					wrapped:'levels(est1$strata_label) <- c(%val%)'
                })
            },
			legendfontsize: {
				el: new inputSpinner(config,{
				no: 'legendfontsize',
				label: CompetingRisksCompareGroups.t('legendfontsize'),
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},
			wraplabelfontsize: {
				el: new inputSpinner(config,{
				no: 'wraplabelfontsize',
				label: CompetingRisksCompareGroups.t('wraplabelfontsize'),
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			

            label2: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label2'), h: 5, style:"mt-3" }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('natriskchkbox'),
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style:"ml-4"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: CompetingRisksCompareGroups.t('risktableprop'),
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.25,
                    extraction: "NoPrefix|UseComma",
                    style:"mt-3 ml-4"
                })
            },
			risktablevaluesize: {
				el: new inputSpinner(config,{
				no: 'risktablevaluesize',
				label: CompetingRisksCompareGroups.t('risktablevaluesize'),
				style: "mt-3 ml-2",
				min: 1,
				max: 15,
				step: 0.5,
				value: 4.5,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktabletitlesize: {
				el: new inputSpinner(config,{
				no: 'risktabletitlesize',
				label: CompetingRisksCompareGroups.t('risktabletitlesize'),
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktableaxislabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableaxislabelsize',
				label: CompetingRisksCompareGroups.t('risktableaxislabelsize'),
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},			
			risktableticklabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableticklabelsize',
				label: CompetingRisksCompareGroups.t('risktableticklabelsize'),
				style: "ml-2 mb-3",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            risktableclean: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('risktableclean'),
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-4 mb-3"
                })
            },            

            label3: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label3'), h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: CompetingRisksCompareGroups.t('linesize'),
                    min: 0,
                    max: 5,
                    step: 0.5,
                    value: 1,
                    extraction: "NoPrefix|UseComma",
                    style: "ml-4"
                })
            },             
            colorpalette: {
                el: new comboBox(config, {
                    no: 'colorpalette',
                    label: CompetingRisksCompareGroups.t('colorpalette'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue",
                    style: "ml-4"
                })
            },
             
            label4: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label4'), h: 5, style:"mt-3 ml-4" }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('cichkbox'),
                    no: "cichkbox",
                    extraction: "Boolean",
                    style: "ml-5"
                })
            },        
            labelblank : { el: new labelVar(config, {label: CompetingRisksCompareGroups.t('labelblank'), h: 1,}) }, 
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: CompetingRisksCompareGroups.t('cistyle'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["ribbon", "step"],
                    default: "ribbon",
                    style: "ml-5",
                    newline: true
                })
            },
            citransparency: {
                el: new advancedSlider(config, {
                    no: "citransparency",
                    label: CompetingRisksCompareGroups.t('citransparency'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style: "ml-5"
                })
            },
			
            censorlabel: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('censorlabel'), style:"mt-3 ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('censorchkbox'),
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: CompetingRisksCompareGroups.t('censorsize'),
                    min: 0,
                    max: 10,
                    step: 0.5,
                    value: 4.5,
                    extraction: "NoPrefix|UseComma",
                    style:"mt-2 ml-5"
                })
            }, 			

            pvaluelabel: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('pvaluelabel'), h: 5, style:"mt-3" }) },
            pvaluechkbox: {
                el: new checkbox(config, {
                    label: CompetingRisksCompareGroups.t('pvaluechkbox'),
                    no: "pvaluechkbox",
                    extraction: "Boolean",
                    style:"ml-3"
                })
            }, 			
			pvaluelocationx: {
				el: new input(config, {
				no: 'pvaluelocationx',
				label: CompetingRisksCompareGroups.t('pvaluelocationx'),
				allow_spaces: true,
				placeholder: "0",
				value: "0",
				extraction: "TextAsIs",
				type: "numeric",
				ml: 3,
				width:"w-25",
				})
			},
			pvaluelocationy: {
				el: new input(config, {
				no: 'pvaluelocationy',
				label: CompetingRisksCompareGroups.t('pvaluelocationy'),
				allow_spaces: true,
				placeholder: "0.5",
				value: "0.5",
				extraction: "TextAsIs",
				type: "numeric",
				ml: 3,
				width:"w-25",
				})
			},
            pvaluesize: {
                el: new advancedSlider(config, {
                no: "pvaluesize",
                label: CompetingRisksCompareGroups.t('pvaluesize'),
                min: 1,
                max: 20,
                step: 0.5,
                value: 5,
                extraction: "NoPrefix|UseComma",
                style: "ml-3"
                })
            },
			pvalueaccuracy: {
				el: new input(config, {
				no: 'pvalueaccuracy',
				label: CompetingRisksCompareGroups.t('pvalueaccuracy'),
				allow_spaces: true,
				placeholder: "0.0001",
				value: "0.0001",
				extraction: "TextAsIs",
				type: "numeric",
				ml: 3,
				width:"w-25",
				})
			},			
            
            label5: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label5'), h: 5 }) },
            incaxislabelall: {
                el: new input(config, {
                    no: 'incaxislabelall',
                    label: CompetingRisksCompareGroups.t('incaxislabelall'),
                    placeholder: "Probability",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Probability",
                    allow_spaces:true,
                    type: "character",
                })
            },
            incaxislabelsingle: {
                el: new input(config, {
                    no: 'incaxislabelsingle',
                    label: CompetingRisksCompareGroups.t('incaxislabelsingle'),
                    placeholder: "Probability",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Probability",
                    allow_spaces:true,
                    type: "character",
                })
            },  
            
            label6: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label6'), style: "mt-3 ml-3", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: CompetingRisksCompareGroups.t('defbutton'),
                    no: "scalebox",
                    increment: "defbutton",
                    syntax: "waiver()",
                    state: "checked",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },
            pctbutton: {
                el: new radioButton(config, {
                    label: CompetingRisksCompareGroups.t('pctbutton'),
                    no: "scalebox",
                    increment: "pctbutton",
                    syntax: "percent",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },   
            label7: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label7'), style: "mt-3 ml-3", h: 6 }) },

            incaxismin: {
                el: new inputSpinner(config, {
                    no: 'incaxismin',
                    label: CompetingRisksCompareGroups.t('incaxismin'),
                    min: 0,
                    max: 1,
                    ml: 4,
                    step: .01,
                    value: 0,
                    extraction: "NoPrefix|UseComma"
                })
            },            
 
            incaxismax: {
                el: new inputSpinner(config, {
                    no: 'incaxismax',
                    label: CompetingRisksCompareGroups.t('incaxismax'),
                    min: 0,
                    max: 1,
                    ml: 4,
                    step: .01,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },             

            incaxisinc: {
                el: new inputSpinner(config, {
                    no: 'incaxisinc',
                    label: CompetingRisksCompareGroups.t('incaxisinc'),
                    min: 0,
                    max: 1,
                    ml: 4,
                    step: .01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma"
                })
            },                   
            label8: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label8'), style: "mt-3", h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: CompetingRisksCompareGroups.t('timeaxislabel'),
                    placeholder: "Time",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Time",
                    allow_spaces:true,
                    type: "character",
                })
            }, 
            label9: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label9'), style: "mt-3 ml-4", h: 6 }) },
            timeaxismin: {
                el: new input(config, {
                    no: 'timeaxismin',
                    label: CompetingRisksCompareGroups.t('timeaxismin'),
                    placeholder: "0",
                    ml: 5,
					width: "w-25",
					required: true,
                    extraction: "TextAsIs",
                    value: "0",
                    allow_spaces:true,
                    Type: "numeric"
                })
            }, 
            timeaxismax: {
                el: new input(config, {
                    no: 'timeaxismax',
                    label: CompetingRisksCompareGroups.t('timeaxismax'),
                    placeholder: "",
                    ml: 5,
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    Type: "numeric"
                })
            }, 
            timeaxisinc: {
                el: new input(config, {
                    no: 'timeaxisinc',
                    label: CompetingRisksCompareGroups.t('timeaxisinc'),
                    placeholder: "",
                    ml: 5,
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    Type: "numeric"
                })
            },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: CompetingRisksCompareGroups.t('axislabelsize'),
				style: "mt-5",
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
				label: CompetingRisksCompareGroups.t('ticklabelsize'),
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}, 			
            label10: { el: new labelVar(config, { label: CompetingRisksCompareGroups.t('label10'), style: "mt-3 ml-4", h: 6 }) },         

        }
        var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: CompetingRisksCompareGroups.t('styleoptions'),
                content: [
                    objects.titleboxall.el,
                    objects.titleboxsingle.el,
					objects.plottitlesize.el,
                    objects.themedropdown.el,
                    objects.label1.el,
                    objects.legendpos.el,
					objects.keywidth.el,
					objects.legendeventslabel.el,
                    objects.eventlegendtitle.el,
                    objects.eventlabels.el,
					objects.legendgroupslabel.el,
					objects.grouplegendtitle.el,
					objects.grouplabels.el,
					objects.legendfontsize.el,
					objects.wraplabelfontsize.el,
                    objects.label2.el,
                    objects.natriskchkbox.el,
                    objects.risktableprop.el,
					objects.risktablevaluesize.el,
					objects.risktabletitlesize.el,
					objects.risktableaxislabelsize.el,
					objects.risktableticklabelsize.el,
					objects.risktableclean.el,
                    objects.label3.el,
                    objects.linesize.el,
                    objects.colorpalette.el,
                    objects.label4.el,
                    objects.cichkbox.el,
                    objects.labelblank.el,
                    objects.cistyle.el,
                    objects.citransparency.el,
					objects.censorlabel.el,
					objects.censorchkbox.el,
					objects.censorsize.el,
					objects.pvaluelabel.el,
					objects.pvaluechkbox.el,
					objects.pvaluelocationx.el,
					objects.pvaluelocationy.el,
					objects.pvaluesize.el,
					objects.pvalueaccuracy.el
                ]
            })
        };
        var axisoptions = {
            el: new optionsVar(config, {
                no: "axisoptions",
                name: CompetingRisksCompareGroups.t('axisoptions'),
                content: [
                    objects.label5.el,
                    objects.incaxislabelall.el,
                    objects.incaxislabelsingle.el,
                    objects.label6.el,
                    objects.defbutton.el,
                    objects.pctbutton.el,
                    objects.label7.el,
                    objects.incaxismin.el,
                    objects.incaxismax.el,
                    objects.incaxisinc.el,
                    objects.label8.el,
                    objects.timeaxislabel.el,
                    objects.label9.el,
                    objects.timeaxismin.el,
                    objects.timeaxismax.el,
                    objects.timeaxisinc.el,
					objects.label10.el,
					objects.axislabelsize.el,
					objects.ticklabelsize.el
                ]
            })
        };        
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.timevar.el.content,
            objects.eventvar.el.content,
			objects.groupvar.el.content,
            objects.singleeventchkbox.el.content,
            objects.eventnum.el.content,
            objects.printallest.el.content,
			objects.printspecest.el.content,
			objects.spectimes.el.content

            ],
            bottom: [styleoptions.el.content,
            axisoptions.el.content],
            nav: {
                name: CompetingRisksCompareGroups.t('navigation'),
                icon: "icon-competing-risk",
				positionInNav: 0,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CompetingRisksCompareGroups.t('help.title'),
            r_help: CompetingRisksCompareGroups.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: CompetingRisksCompareGroups.t('help.body')
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
		
		//for cuminc call to use dataset$var syntax
		let timevar=code_vars.selected.timevar
		timevar="$"+timevar
		
		let eventvar=code_vars.selected.eventvar
		eventvar="$"+eventvar

		let groupvar=code_vars.selected.groupvar
		groupvar="$"+groupvar				
	
		//create new variables under code_vars
		code_vars.selected.timevardollar = timevar
		code_vars.selected.eventvardollar = eventvar
		code_vars.selected.groupvardollar = groupvar
				
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}			
	
	
}

module.exports = {
    render: () => new CompetingRisksCompareGroups().render()
}
