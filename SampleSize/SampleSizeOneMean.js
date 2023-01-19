
var localization = {
    en: {
        title: "Sample Size, Test One Mean or Paired Means",
        navigation: "One Mean or Paired Means",
		howtouse: "Specify two of sample size, difference between means, and power, and the third will be computed",
		n: "Sample Size",
		delta: "Difference Between Means",
		power: "Power (0-1)",
		sd: "Standard Deviation",
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
        help: {
            title: "Sample Size, Test One Mean",
            r_help: "help(power.t.test, package ='stats')",
            body: `
This is an assessment of sample size for a one-sample t-test of a mean or a test of paired means.  It computes the sample size, difference between means, or the power, when the user 
specifies two of them.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Difference Between Means:</b> If a one-sample t-test, specify the difference between the mean under the alternative hypothesis and the mean under the null hypothesis.  If a
paired t-test, specify the difference between the paired means under the alternative hypothesis.
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Standard Deviation:</b> Specify an estimate of the standard deviation of the outcome measure.  For paired tests, this is the standard deviation of the paired differences.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Required R Packages:</b> stats, broom
			`}
    }
}









class SampleSizeOneMean extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeOneMean",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(broom)
power_result <- power.t.test({{selected.n | safe}} {{selected.delta | safe}} {{selected.power | safe}} sd={{selected.sd | safe}}, sig.level={{selected.siglevel | safe}}, type="one.sample", alternative="{{selected.altgrp | safe}}")
power_table <- as.data.frame(tidy(power_result))
power_table$sides <- "{{selected.altgrp}}"

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: localization.en.howtouse, 
					style: "mb-3", 
					h:8
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
					value: "",
					width:"w-25",
					wrapped: "n=%val%, "
				})
			},
			delta: {
				el: new input(config, {
					no: 'delta',
					label: localization.en.delta,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "delta=%val%, "
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
					width:"w-25",
					wrapped: "power=%val%, "
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
					style: "mt-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "",
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
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: localization.en.onesided,
					no: "altgrp",
					increment: "onesided",
					value: "one.sided",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.delta.el.content, objects.power.el.content, objects.sd.el.content, objects.siglevel.el.content,
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-t1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new SampleSizeOneMean().render()