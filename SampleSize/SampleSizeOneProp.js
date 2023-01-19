
var localization = {
    en: {
        title: "Sample Size, Test One Proportion",
        navigation: "One Proportion",
		howtouse: "Specify either sample size or power, and the other will be computed",
		n: "Sample Size",
		power: "Power (0-1)",
		prop: "Alternative Proportion (0-1)",
		prop0: "Null Proportion (0-1)",
		
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
        help: {
            title: "Sample Size, Test One Proportion",
            r_help: "help(pnorm, package ='stats')",
            body: `
This is an assessment of sample size for a one-sample proportion test.  It computes the sample size or the power, when the user 
specifies one of them.  The computation uses the formula as found in Chow S, Shao J, Wang H. Sample Size Calculations in Clinical Research (2008).  It uses a normal approximation with
the standard deviation based on the alternative proportion.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Alternative Proportion (0-1):</b> Specify the proportion under the alternative hypothesis
<br/><br/>
<b>Null Proportion (0-1):</b> Specify the proportion under the null hypothesis
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Required R Packages:</b> stats
			`}
    }
}









class SampleSizeOneProp extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeOneProp",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
{{if ((options.selected.n=="") & (options.selected.altgrp=="two.sided"))}}
# computing sample size, two-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
power <- {{selected.power | safe}}\n
n_result <- p*(1-p)*((qnorm(1-alpha/2)+qnorm(power))/(p-p0))^2

power_table <- data.frame(n=n_result, p=p, p0=p0, sig.level=alpha, power=power, sides="two-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n=="") & (options.selected.altgrp=="one.sided"))}}
# computing sample size, one-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
power <- {{selected.power | safe}}\n
n_result <- p*(1-p)*((qnorm(1-alpha)+qnorm(power))/(p-p0))^2

power_table <- data.frame(n=n_result, p=p, p0=p0, sig.level=alpha, power=power, sides="one-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n!="") & (options.selected.altgrp=="two.sided"))}}
# computing power, two-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
n <- {{selected.n | safe}}\n
z <- (p-p0)/sqrt(p*(1-p)/n)
power_result <- pnorm(z-qnorm(1-alpha/2))+pnorm(-z-qnorm(1-alpha/2))

power_table <- data.frame(n=n, p=p, p0=p0, sig.level=alpha, power=power_result, sides="two-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n!="") & (options.selected.altgrp=="one.sided"))}}
# computing power, one-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
n <- {{selected.n | safe}}\n
z <- (p-p0)/sqrt(p*(1-p)/n)
power_result <- pnorm(z-qnorm(1-alpha))+pnorm(-z-qnorm(1-alpha))

power_table <- data.frame(n=n, p=p, p0=p0, sig.level=alpha, power=power_result, sides="one-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}
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
			prop: {
				el: new input(config, {
					no: 'prop',
					label: localization.en.prop,
					required: true,
					style: "mt-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			prop0: {
				el: new input(config, {
					no: 'prop0',
					label: localization.en.prop0,
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.prop.el.content, objects.prop0.el.content, objects.siglevel.el.content,
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-p1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new SampleSizeOneProp().render()