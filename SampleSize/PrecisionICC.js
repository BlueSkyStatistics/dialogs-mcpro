
var localization = {
    en: {
        title: "Sample Size, Precision of the ICC",
        navigation: "ICC",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		icc: "ICC (intraclass correlation coefficient, 0-1)",
		conflevel: "Confidence Level (0-1)",
		raters: "Number of Raters",
        help: {
            title: "Sample Size, Precision of the AUC",
            r_help: "help(prec_icc, package ='presize')",
            body: `
This is an assessment of sample size for an intraclass correlation coefficient (ICC) based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.  Whether ICC is calculated for a one-way or a two-way ANOVA does not matter in the approximation used.  See Bonett DG (2002), Sample size requirements for estimating intraclass 
correlations with desired precision, Statistics in Medicine, 21:1331-1335.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>ICC:</b> Specify the expected ICC value
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Number of Raters:</b> Specify the number of raters that will provide values for each subject.
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionICC extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionICC",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_icc(rho={{selected.icc | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, k={{selected.raters | safe}}) 
names(precision_result)[names(precision_result)=="rho"] <- "ICC"
names(precision_result)[names(precision_result)=="k"] <- "Raters"
precision_result[names(precision_result)=="note"] <- NULL

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
			icc: {
				el: new input(config, {
					no: 'icc',
					label: localization.en.icc,
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
					max: 10000,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.icc.el.content, objects.conflevel.el.content, objects.raters.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-icc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionICC().render()