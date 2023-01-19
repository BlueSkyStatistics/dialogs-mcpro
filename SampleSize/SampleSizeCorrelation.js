
var localization = {
    en: {
        title: "Sample Size, Test Correlation",
        navigation: "Correlation",
		howtouse: "To compute sample size: specify correlation and power\nTo compute power: specify sample size and correlation\nTo compute detectable correlation: specify sample size and power",
		n: "Sample Size",
		corr: "Correlation (-1 to 1)",
		power: "Power (0-1)",

		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		greater: "Greater Than",
		less: "Less Than",
        help: {
            title: "Sample Size, Test Correlation",
            r_help: "help(pwr.r.test, package ='pwr')",
            body: `
This is an assessment of sample size for a Pearson correlation coefficient.  It computes the sample size, power, or correlation when the user 
specifies the other two.  The null hypothesis correlation is 0.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Correlation:</b> Specify the correlation to detect
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided, greater than (one-sided), or less than (one-sided)
<br/><br/>
<b>Required R Packages:</b> pwr
			`}
    }
}









class SampleSizeCorrelation extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeCorrelation",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(pwr)

power_result <- pwr.r.test({{selected.n | safe}} {{selected.corr | safe}} {{selected.power | safe}} sig.level = {{selected.siglevel | safe}}, alternative = "{{selected.altgrp | safe}}")
BSkyFormat(unlist(power_result), singleTableOutputHeader="Power Results")
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
					wrapped: "n=%val%, ",
					width:"w-25"
				})
			},
			corr: {
				el: new input(config, {
					no: 'corr',
					label: localization.en.corr,
					value: ".3",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					wrapped: "r=%val%, ",
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
					wrapped: "power=%val%, ",
					width:"w-25"
				})
			},			
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: localization.en.siglevel,
					style: "mt-5",
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
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			greater: {
				el: new radioButton(config, {
					label: localization.en.greater,
					no: "altgrp",
					increment: "greater",
					value: "greater",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			less: {
				el: new radioButton(config, {
					label: localization.en.less,
					no: "altgrp",
					increment: "less",
					value: "less",
					state: "",
					extraction: "ValueAsIs"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.corr.el.content, objects.power.el.content, 
					objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.greater.el.content, objects.less.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-link",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
}
module.exports.item = new SampleSizeCorrelation().render()