
var localization = {
    en: {
        title: "Sample Size, Precision of Cohen's Kappa",
        navigation: "Cohen's Kappa",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		kappa: "Kappa (0-1)",
		conflevel: "Confidence Level (0-1)",
		raters: "Number of Raters (2-6)",
		categories: "Number of Categories (2-5)",
		props: "Proportions in Each Category; separate with commas, e.g. .3, .7; must match the number of categories and sum to 1",
        help: {
            title: "Sample Size, Precision of Cohen's Kappa",
            r_help: "help(prec_kappa, package ='presize')",
            body: `
This is an assessment of sample size for Cohen's kappa based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Kappa:</b> Specify the expected kappa value
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Number of Raters:</b> Specify the number of raters that will provide values for each subject.
<br/><br/>
<b>Number of Categories:</b> Specify the number of categories in the outcome variable
<br/><br/>
<b>Proportions in Each Category:</b> Specify the expected proportion of subjects in each category, separated by commas.  Note that the number of specified values must match the
the number of specified categories and sum to 1.
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionKappa extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionKappa",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_kappa(kappa={{selected.kappa | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, raters={{selected.raters | safe}}, n_category={{selected.categories | safe}}, props=c({{selected.props | safe}})) 
spec_values <- data.frame(raters={{selected.raters | safe}}, n_categories={{selected.categories}}, proportions="{{selected.props | safe}}")

BSkyFormat(spec_values, singleTableOutputHeader="Specified number of raters, number of categories, and proportions in each category")
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
			kappa: {
				el: new input(config, {
					no: 'kappa',
					label: localization.en.kappa,
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
			raters: {
				el: new inputSpinner(config, {
					no: 'raters',
					label: localization.en.raters,
					min: 2,
					max: 6,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},
			categories: {
				el: new inputSpinner(config, {
					no: 'categories',
					label: localization.en.categories,
					style: "mt-5",
					min: 2,
					max: 5,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},
			props: {
				el: new input(config, {
					no: 'props',
					label: localization.en.props,
					style: "ml-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "character",
					allow_spaces: true,
					required: true,
					value: "",
					width:"w-50"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.kappa.el.content, objects.conflevel.el.content, objects.raters.el.content, objects.categories.el.content, objects.props.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-kappa_cohen",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionKappa().render()