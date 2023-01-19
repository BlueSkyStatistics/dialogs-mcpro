
var localization = {
    en: {
        title: "Sample Size, Test Two Means",
        navigation: "Two Means",
		howtouse: "To compute sample size: specify both group means and power\nTo compute power: specify both group means and sample size\nTo compute detectable mean difference: specify sample size and power",
		n: "Sample Size",
		power: "Power (0-1)",
		meangrp1: "Treatment Group Mean",
		meangrp2: "Control Group Mean",

		ratio: "Treatment vs Control Sample Size Ratio",
		sd: "Standard Deviation",
		siglevel: "Significance Level (0-1)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
        help: {
            title: "Sample Size, Test Two Means",
            r_help: "help(epi.sscompc, package ='epiR')",
            body: `
This is an assessment of sample size for a two-sample t-test of means.  It computes the sample size, power, or mean difference (delta) when the user 
specifies the other two.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Treatment Group Mean:</b> Specify the mean for the treatment group
<br/><br/>
<b>Control Group Mean:</b> Specify the mean for the control group
<br/><br/>
<b>Treatment vs Control Sample Size Ratio:</b> Specify the desired ratio of the sample sizes (treatment N divided by control N). A ratio of 1 means equal sample sizes.
<br/><br/>
<b>Standard Deviation:</b> Estimate of the pooled standard deviation of the groups
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Required R Packages:</b> epiR
			`}
    }
}









class SampleSizeTwoMeans extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeTwoMeans",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)
result <- epi.sscompc({{selected.meangrp1final | safe}}{{selected.meangrp2final | safe}}{{selected.nfinal | safe}}{{selected.powerfinal | safe}}sigma={{selected.sd | safe}}, r={{selected.ratio | safe}},
   sided.test={{selected.altgrp | safe}}, conf.level=1-{{selected.siglevel | safe}})

inputparms <- data.frame(n="{{selected.n | safe}}", power="{{selected.power | safe}}", treatment_mean="{{selected.meangrp1 | safe}}", control_mean="{{selected.meangrp2 | safe}}", n_ratio={{selected.ratio | safe}}, sd={{selected.sd | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})

BSkyFormat(inputparms, singleTableOutputHeader="Input Parameters")   
BSkyFormat(as.data.frame(result), singleTableOutputHeader="Power Results")
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
			meangrp1: {
				el: new input(config, {
					no: 'meangrp1',
					label: localization.en.meangrp1,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			meangrp2: {
				el: new input(config, {
					no: 'meangrp2',
					label: localization.en.meangrp2,
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
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.meangrp1.el.content, objects.meangrp2.el.content, 
					objects.ratio.el.content, objects.sd.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-t2",
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
		let meangrp1spec=code_vars.selected.meangrp1.toString();
		let meangrp2spec=code_vars.selected.meangrp2.toString();
		
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

		let meangrp1final="";
		if (meangrp1spec=="") {
			meangrp1final="treat=NA, ";
		} else {
			meangrp1final="treat="+meangrp1spec+", ";
		}		

		let meangrp2final="";
		if (meangrp2spec=="") {
			meangrp2final="control=NA, ";
		} else {
			meangrp2final="control="+meangrp2spec+", ";
		}		
	
		//create new variables under code_vars
		code_vars.selected.nfinal = nfinal
		code_vars.selected.powerfinal = powerfinal
		code_vars.selected.meangrp1final = meangrp1final
		code_vars.selected.meangrp2final = meangrp2final
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
		
	
}
module.exports.item = new SampleSizeTwoMeans().render()