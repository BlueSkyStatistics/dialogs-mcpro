
var localization = {
    en: {
        title: "Sample Size, Test Two Group Survival",
        navigation: "Two Group Survival",
		howtouse: "To compute sample size: specify power\nTo compute power: specify sample size",		
		n: "Sample Size",
		power: "Power (0-1)",
		
		propgrp1: "Proportion of Sample in Group 1 (0-1)",
		propevent: "Proportion with the Event (0-1)",
		hr: "Hazard Ratio, Group 1 vs Group 2",
		rsquared: "R-squared between group and other covariates (0-1); enter 0 for unadjusted test",
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",		
        help: {
            title: "Sample Size, Test Two Group Survival",
            r_help: "help(ssizeEpiCont.default, package ='powerSurvEpi')",
            body: `
This is an assessment of sample size for a two-sample test of survival.  It computes the sample size or power, when the user specifies the other one, given a hazard ratio to detect.
The computations assume a Cox proportional hazards model.
<br/><br/>
<b>Sample Size:</b> Specify the total number of subjects
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Proportion of Sample in Group 1:</b> Specify the proportion of the total sample that is in group 1.  The proportion of the sample in group 2 will be one minus this quantity.
<br/><br/>
<b>Hazard Ratio, Group 1 vs Group 2:</b> Specify the desired hazard ratio to detect for group 1 relative to group 2
<br/><br/>
<b>Proportion with the Event:</b> Specify the expected proportion of the sample with the event (or one minus the censoring proportion).  If you specify a probability of 1, it assumes no censoring.
<br/><br/>
<b>R-squared between group and other covariates; enter 0 for unadjusted test:</b> Specify the r-squared value (squared multiple correlation), between the grouping variable and 
all other covariates in the Cox model.  A value of 0 corresponds to an anadjusted test with no other covariates.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
This uses the ssizeEpiCont.default and powerEpiCont.default functions in the powerSurvEpi package.  See triple dot menu>Help>R Function Help for more information.
<br/><br/>
<b>Required R Packages:</b> powerSurvEpi
			`}
    }
}









class SampleSizeSurvivalTwoGroup extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeSurvivalTwoGroup",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(powerSurvEpi)

{{if (options.selected.power!="")}}
# computing sample size
alpha_touse <- {{selected.siglevel}}*(2/{{selected.altgrp | safe}})
power_result <- ssizeEpiCont.default(power={{selected.power | safe}}, theta={{selected.hr | safe}}, sigma2={{selected.propgrp1 | safe}}*(1-{{selected.propgrp1 | safe}}), psi={{selected.propevent | safe}}, rho2={{selected.rsquared | safe}}, alpha=alpha_touse)
power_table <- data.frame(power={{selected.power | safe}}, prop.group1={{selected.propgrp1 | safe}}, prop.group2=1-{{selected.propgrp1 | safe}}, hr={{selected.hr | safe}}, prop.event={{selected.propevent | safe}}, r.squared={{selected.rsquared | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}}, n.total=power_result)
{{/if}}
{{if (options.selected.power=="")}}
# computing power
alpha_touse <- {{selected.siglevel}}*(2/{{selected.altgrp | safe}})
power_result <- powerEpiCont.default(n={{selected.n | safe}}, theta={{selected.hr | safe}}, sigma2={{selected.propgrp1 | safe}}*(1-{{selected.propgrp1 | safe}}), psi={{selected.propevent | safe}}, rho2={{selected.rsquared | safe}}, alpha=alpha_touse)
power_table <- data.frame(n.total={{selected.n | safe}}, prop.group1={{selected.propgrp1 | safe}}, prop.group2=1-{{selected.propgrp1 | safe}}, hr={{selected.hr | safe}}, prop.event={{selected.propevent | safe}}, r.squared={{selected.rsquared | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}}, power=power_result)
{{/if}}

BSkyFormat(power_table, singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: localization.en.howtouse, 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: localization.en.n,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					width:"w-25"
				})
			},			
			power: {
				el: new input(config, {
					no: 'power',
					label: localization.en.power,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25"
				})
			},			
			propgrp1: {
				el: new input(config, {
					no: 'propgrp1',
					label: localization.en.propgrp1,
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: ".5",
					width:"w-25"
				})
			},
			hr: {
				el: new input(config, {
					no: 'hr',
					label: localization.en.hr,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "2",
					width:"w-25"
				})
			},
			propevent: {
				el: new input(config, {
					no: 'propevent',
					label: localization.en.propevent,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "1",
					width:"w-25"
				})
			},
			rsquared: {
				el: new input(config, {
					no: 'rsquared',
					label: localization.en.rsquared,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "0",
					width:"w-25"
				})
			},			
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: localization.en.siglevel,
					placeholder: ".05",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".05",
					width:"w-25"
				})
			},
			alternativeopt: {
				el: new labelVar(config, {
					label: localization.en.alternativeopt, 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: localization.en.twosided,
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: localization.en.onesided,
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.propgrp1.el.content, 
					objects.hr.el.content, objects.propevent.el.content, objects.rsquared.el.content, objects.siglevel.el.content, 
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-kaplanc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new SampleSizeSurvivalTwoGroup().render()