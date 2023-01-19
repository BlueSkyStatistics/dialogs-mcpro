
var localization = {
    en: {
        title: "Sample Size, Test Two Proportions",
        navigation: "Two Proportions",
		howtouse: "To compute sample size: specify both group proportions and power\nTo compute power: specify both group proportions and sample size\nTo compute detectable proportion difference: specify sample size, power, and group 2 proportion",
		n: "Sample Size",
		power: "Power (0-1)",
		propgrp1: "Group 1 Proportion",
		propgrp2: "Group 2 Proportion",

		ratio: "Group 1 vs Group 2 Sample Size Ratio",
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
        help: {
            title: "Sample Size, Test Two Proportions",
            r_help: "help(epi.sscohortc, package ='epiR')",
            body: `
This is an assessment of sample size for a two-sample test of proportions.  It computes the sample size, power, or effect size (difference in proportions, rate ratio, odds ratio) when the user 
specifies the other two.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Group 1 Proportion:</b> Specify the proportion in group 1
<br/><br/>
<b>Group 2 Proportion:</b> Specify the proportion in group 2
<br/><br/>
<b>Group 1 vs Group 2 Sample Size Ratio:</b> Specify the desired ratio of the sample sizes (group 1 N divided by group 2 N). A ratio of 1 means equal sample sizes.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Required R Packages:</b> epiR
			`}
    }
}









class SampleSizeTwoProp extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeTwoProp",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)

result <- epi.sscohortc({{selected.propgrp1final}}{{selected.propgrp2final}}{{selected.powerfinal}}r={{selected.ratio | safe}}, {{selected.nfinal}}sided.test={{selected.altgrp | safe}}, conf.level=1-{{selected.siglevel | safe}})
power_table <- unlist(result)
names(power_table)[c(2,3)] <- c("n.group1", "n.group2")

inputparms <- data.frame(n="{{selected.n | safe}}", power="{{selected.power | safe}}", group1_prop="{{selected.propgrp1 | safe}}", group2_prop="{{selected.propgrp2 | safe}}", n_ratio={{selected.ratio | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})

{{if (options.selected.propgrp1=="")}}
# adding detected group 1 proportion and 2 odds ratios 
props <- result$irr*{{selected.propgrp2 | safe}}\n
oneminusprops <- 1-props
oddsratios <- (props/oneminusprops)/({{selected.propgrp2 | safe}}/(1-{{selected.propgrp2 | safe}}))
names(oddsratios) <- c("or.group1.low", "or.group1.high")
names(props) <- c("group1_prop.low", "group2_prop.high")
power_table <- c(power_table, oddsratios, props)
names(power_table)[c(5,6)] <- c("irr.group1.low", "irr.group1.high")
{{/if}}

BSkyFormat(inputparms, singleTableOutputHeader="Input Parameters")
BSkyFormat(power_table, singleTableOutputHeader="Power Results{{if (options.selected.propgrp1=='')}}, with detectable IRRs, ORs, and group 1 proportions in both directions{{/if}}")
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
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			propgrp2: {
				el: new input(config, {
					no: 'propgrp2',
					label: localization.en.propgrp2,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			ratio: {
				el: new input(config, {
					no: 'ratio',
					label: localization.en.ratio,
					style: "mt-5",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "1",
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.propgrp1.el.content, objects.propgrp2.el.content, 
					objects.ratio.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-p2",
				datasetRequired: false,
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
		
		//user-specified inputs
		let nspec=code_vars.selected.n.toString();
		let powerspec=code_vars.selected.power.toString();
		let propgrp1spec=code_vars.selected.propgrp1.toString();
		let propgrp2spec=code_vars.selected.propgrp2.toString();
		
		//changing to what the R functions need
		
		let nfinal="";
		if (nspec=="") {
			nfinal="n=NA, ";
		} else {
			nfinal="n="+nspec+", ";
		}
		
		let powerfinal="";
		if (powerspec=="") {
			powerfinal="power=NA, ";
		} else {
			powerfinal="power="+powerspec+", ";
		}		

		let propgrp1final="";
		if (propgrp1spec=="") {
			propgrp1final="irexp1=NA, ";
		} else {
			propgrp1final="irexp1="+propgrp1spec+", ";
		}		

		let propgrp2final="";
		if (propgrp2spec=="") {
			propgrp2final="irexp0=NA, ";
		} else {
			propgrp2final="irexp0="+propgrp2spec+", ";
		}		
	
		//create new variables under code_vars
		code_vars.selected.nfinal = nfinal
		code_vars.selected.powerfinal = powerfinal
		code_vars.selected.propgrp1final = propgrp1final
		code_vars.selected.propgrp2final = propgrp2final
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
		
	
}
module.exports.item = new SampleSizeTwoProp().render()