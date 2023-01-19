
var localization = {
    en: {
        title: "Sample Size, Precision of a Mean Difference",
        navigation: "Difference of Means",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n1: "Group 1 Sample Size",
		width: "Confidence Interval Width",
		ratio: "Ratio of Group 2 to Group 1 Sample Size",
		meandiff: "Mean Difference",
		sd1: "Group 1 Standard Deviation",
		sd2: "Group 2 Standard Deviation",		
		conflevel: "Confidence Level (0-1)",
		variance: "Variance Assumption",
        help: {
            title: "Sample Size, Precision of a Mean Difference",
            r_help: "help(prec_meandiff, package ='presize')",
            body: `
This is an assessment of sample size for a difference of means based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Group 1 Sample Size:</b> Specify the number of subjects in group 1
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Ratio of Group 2 to Group 1 Sample Size:</b> Specify the ratio of the group 2 sample size to the group 1 sample size.  A value of 1 means equal sample sizes.
<br/><br/>
<b>Mean Difference:</b> Specify the expected difference in group means 
<br/><br/>
<b>Group 1 Standard Deviation:</b> Specify the standard deviation of the outcome in group 1
<br/><br/>
<b>Group 2 Standard Deviation:</b> Specify the standard deviation of the outcome in group 2
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Variance Assumption:</b> Specify whether the group variances are assumed to be equal or unequal.  Specifying equal variances uses a pooled common estimate of the variance.
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionMeanDiff extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionMeanDiff",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_meandiff(delta={{selected.meandiff | safe}}, {{selected.n1 | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, r={{selected.ratio | safe}}, sd1={{selected.sd1 | safe}}, sd2={{selected.sd2 | safe}}, variance="{{selected.variance | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
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
			n1: {
				el: new input(config, {
					no: 'n1',
					label: localization.en.n1,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "n1=%val%, "
				})
			},
			width: {
				el: new input(config, {
					no: 'width',
					label: localization.en.width,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			ratio: {
				el: new input(config, {
					no: 'ratio',
					label: localization.en.ratio,
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "1",
					width:"w-25"
				})
			},			
			meandiff: {
				el: new input(config, {
					no: 'meandiff',
					label: localization.en.meandiff,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd1: {
				el: new input(config, {
					no: 'sd1',
					label: localization.en.sd1,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd2: {
				el: new input(config, {
					no: 'sd2',
					label: localization.en.sd2,
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},			
			conflevel: {
				el: new input(config, {
					no: 'conflevel',
					label: localization.en.conflevel,
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			variance: {
				el: new comboBox(config, {
					no: "variance",
					label: localization.en.variance,
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["equal", "unequal"],
					default: "equal"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n1.el.content, objects.width.el.content, 
					objects.ratio.el.content, objects.meandiff.el.content, objects.sd1.el.content, objects.sd2.el.content, objects.conflevel.el.content, objects.variance.el.content
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
		
	
}
module.exports.item = new PrecisionMeanDiff().render()