
var localization = {
    en: {
        title: "Sample Size, Precision of a Correlation",
        navigation: "Correlation",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		corr: "Correlation (-1 to 1)",
		conflevel: "Confidence Level (0-1)",
		corrtype: "Correlation Type",
        help: {
            title: "Sample Size, Precision of a Correlation",
            r_help: "help(prec_cor, package ='presize')",
            body: `
This is an assessment of sample size for a Pearson, Spearman, or Kendall correlation based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Correlation:</b> Specify the expected correlation value
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Correlation Type:</b> Specify the type of correlation being computed
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionCorrelation extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionCorrelation",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_cor(r={{selected.corr | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, method="{{selected.corrtype | safe}}") 

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
			corr: {
				el: new input(config, {
					no: 'corr',
					label: localization.en.corr,
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
			corrtype: {
				el: new comboBox(config, {
					no: "corrtype",
					label: localization.en.corrtype,
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["pearson", "spearman", "kendall"],
					default: "pearson"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.corr.el.content, objects.conflevel.el.content, objects.corrtype.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-link",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionCorrelation().render()