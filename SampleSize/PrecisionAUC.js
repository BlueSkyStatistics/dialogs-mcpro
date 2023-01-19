
var localization = {
    en: {
        title: "Sample Size, Precision of the AUC",
        navigation: "AUC",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		auc: "AUC (area under ROC curve, 0.5-1)",
		conflevel: "Confidence Level (0-1)",
		prev: "Outcome Prevalence (0-1)",
        help: {
            title: "Sample Size, Precision of the AUC",
            r_help: "help(prec_auc, package ='presize')",
            body: `
This is an assessment of sample size for the area under a receiver operating characteristic curve based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>AUC:</b> Specify the expected AUC value
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Outcome Prevalence:</b> Specify the proportion of subjects with the 'positive' outcome.  This corresponds to the level being modelled with the candidate statistical model.
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionAUC extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionAUC",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_auc(auc={{selected.auc | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, prev={{selected.prev | safe}}) 

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
			auc: {
				el: new input(config, {
					no: 'auc',
					label: localization.en.auc,
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
			prev: {
				el: new input(config, {
					no: 'prev',
					label: localization.en.prev,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "",
					width:"w-25"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.auc.el.content, objects.conflevel.el.content, objects.prev.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-auc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionAUC().render()