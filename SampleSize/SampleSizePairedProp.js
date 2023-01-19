
var localization = {
    en: {
        title: "Sample Size, Test Two Paired Proportions",
        navigation: "Two Paired Proportions",
		howtouse: "To compute sample size (number of pairs): specify power\nTo compute power: specify sample size (number of pairs)",
		n: "Sample Size (number of pairs)",
		power: "Power (0-1)",
		
		pdisc: "Discordant Pairs Proportion (PD) (0-1)",
		pdiff: "Difference in Proportions, must be between -PD and PD",
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
        help: {
            title: "Sample Size, Test Two Paired Proportions",
            r_help: "help(qnorm, package ='stats')",
            body: `
This is an assessment of sample size for a paired test of proportions using McNemar's Test.  It computes the sample size (number of pairs) or power when the user 
specifies the other.  The computations use a normal approximation conditional on the proportion of discordant pairs.  See Connor R. J. 1987. Sample size for testing 
differences in proportions for the paired-sample design. Biometrics 43(1):207-211.
<br/><br/>
<b>Sample Size (number of pairs):</b> Specify the sample size in the study.  This is the number of subjects that will provide binary outcome values at both time points
in a pre vs post design or the number of pairs in a matched subject (e.g. matched case-control) design. 
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Discordant Pairs Proportion:</b> Specify the expected proportion of pairs that will disagree, e.g. 'yes'/'no' or 'no'/'yes' responses, out of the total number of pairs
<br/><br/>
<b>Difference in Proportions:</b> Specify the difference in outcome proportions (i.e. proportion that are 'yes') that is desired to detect.  For example, in a matched case-control
study this is the difference between the proportion of cases that are 'yes' and the proportion of controls that are 'yes'. 
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Required R Packages:</b> stats
			`}
    }
}









class SampleSizeTwoPairedProp extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeTwoPairedProp",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
pdisc <- {{selected.pdisc | safe}}\n
pdiff <- {{selected.pdiff | safe}}\n

{{if ((options.selected.n=="") & (options.selected.altgrp==2))}}
# computing n, two-sided test
n_result <- ceiling(((qnorm(1-{{selected.siglevel | safe}}/{{selected.altgrp | safe}})*sqrt(pdisc)+qnorm({{selected.power | safe}})*sqrt(pdisc-pdiff^2))/pdiff)^2)
power_table <- data.frame(n_pairs=n_result, power={{selected.power | safe}}, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.power=="") & (options.selected.altgrp==2))}}
# computing power, two-sided test
x1 <- (pdiff*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel | safe}}/2)*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
x2 <- (-pdiff*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel}}/2)*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
power_result <- pnorm(x1)+pnorm(x2)
power_table <- data.frame(n_pairs={{selected.n | safe}}, power=power_result, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.n=="") & (options.selected.altgrp==1))}}
# computing n, one-sided test
n_result <- ceiling(((qnorm(1-{{selected.siglevel | safe}})*sqrt(pdisc)+qnorm({{selected.power | safe}})*sqrt(pdisc-pdiff^2))/pdiff)^2)
power_table <- data.frame(n_pairs=n_result, power={{selected.power | safe}}, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.power=="") & (options.selected.altgrp==1))}}
# computing power, one-sided test
x <- (abs(pdiff)*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel | safe}})*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
power_result <- pnorm(x)
power_table <- data.frame(n_pairs={{selected.n | safe}}, power=power_result, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
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
			pdisc: {
				el: new input(config, {
					no: 'pdisc',
					label: localization.en.pdisc,
					style: "mt-5",
					required: true,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			pdiff: {
				el: new input(config, {
					no: 'pdiff',
					label: localization.en.pdiff,
					required: true,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.pdisc.el.content, objects.pdiff.el.content, 
					objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-pairedprop",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
}
module.exports.item = new SampleSizeTwoPairedProp().render()