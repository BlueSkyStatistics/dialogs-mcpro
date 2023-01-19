
var localization = {
    en: {
        title: "Sample Size, ANOVA",
        navigation: "ANOVA",
		howtouse: "To compute sample size: specify the group means and power\nTo compute power: specify sample size and the group means\nTo compute detectable variance of the group means: specify sample size and power",
		numgrps: "Number of Groups",
		n: "Sample Size per Group",		
		grpmeans: "Group Means, specify as values separated by commas, e.g. 20, 25, 40",
		power: "Power (0-1)",

		sd: "Standard Deviation",
		siglevel: "Significance Level (0-1)",
        help: {
            title: "Sample Size, ANOVA",
            r_help: "help(power.anova.test, package ='stats')",
            body: `
This is an assessment of sample size for a balanced one-way ANOVA.  It computes the sample size, power, or difference in means (calculated as the variance between the means) when the user 
specifies the other two.
<br/><br/>
<b>Number of Groups:</b> Specify the number of groups in the study
<br/><br/>
<b>Sample Size per Group:</b> Specify the number of subjects in each group
<br/><br/>
<b>Group Means:</b> Specify the means in each group that you want to be able to detect.  At least one mean has to be different than the others.
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true.
<br/><br/>
<b>Standard Deviation:</b> Specify the standard deviation of the outcome.  This is assumed to be the same across the groups.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test
<br/><br/>
<b>Required R Packages:</b> stats
			`}
    }
}









class SampleSizeANOVA extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeANOVA",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
power_result <- power.anova.test(groups={{selected.numgrps | safe}}, {{selected.n | safe}} {{selected.grpmeans | safe}} {{selected.power | safe}} within.var={{selected.sd | safe}}^2, sig.level={{selected.siglevel | safe}})

spec_meanssd <- data.frame(means="{{selected.meansonly | safe}}", sd={{selected.sd | safe}})

BSkyFormat(spec_meanssd, singleTableOutputHeader="Specified Group Means and Common Pooled Standard Deviation")
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
			numgrps: {
				el: new inputSpinner(config, {
					no: 'numgrps',
					label: localization.en.numgrps,
					style: "mt-5",
					min: 2,
					max: 10000,
					step: 1,
					value: 3,
					extraction: "NoPrefix|UseComma"
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
			grpmeans: {
				el: new input(config, {
					no: 'grpmeans',
					label: localization.en.grpmeans,
					type: "character",
					allow_spaces: true,
					value: "20, 25, 40",
					extraction: "TextAsIs",
					wrapped: "between.var=var(c(%val%)), ",
					width:"w-50"
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
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
					style: "mt-5",
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
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.numgrps.el.content, objects.n.el.content, objects.grpmeans.el.content, objects.power.el.content, 
					objects.sd.el.content, objects.siglevel.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-variance",
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
		let meansonly=code_vars.selected.grpmeans.slice(18, -4).trim();
	
		//create new variables under code_vars
		code_vars.selected.meansonly = meansonly		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}

	
}
module.exports.item = new SampleSizeANOVA().render()