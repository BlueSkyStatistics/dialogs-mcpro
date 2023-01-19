
var localization = {
    en: {
        title: "Sample Size, Precision of One Proportion",
        navigation: "One Proportion",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		prop: "Outcome Proportion",
		conflevel: "Confidence Level (0-1)",
		method: "Confidence Interval Method",
        help: {
            title: "Sample Size, Precision of One Proportion",
            r_help: "help(prec_prop, package ='presize')",
            body: `
This is an assessment of sample size for a proportion based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Outcome Proportion:</b> Specify the proportion of subjects with the 'positive' outcome
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Confidence Interval Method:</b> Specify the type of confidence interval method to use. The wilson method is suggested for small n (< 40), and the agresti-coull method is 
suggested for larger n. The wald method is not suggested, but provided due to its widely distributed use.
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionOneProp extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionOneProp",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_prop({{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, p={{selected.prop | safe}}, method="{{selected.method | safe}}") 

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
			prop: {
				el: new input(config, {
					no: 'prop',
					label: localization.en.prop,
					style: "mt-5",
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
			method: {
				el: new comboBox(config, {
					no: "method",
					label: localization.en.method,
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["wilson", "agresti-coull", "exact", "wald"],
					default: "wilson"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.prop.el.content, objects.conflevel.el.content, objects.method.el.content
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
module.exports.item = new PrecisionOneProp().render()