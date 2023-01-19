
var localization = {
    en: {
        title: "Sample Size, Precision of a Mean",
        navigation: "One Mean",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n: "Sample Size",
		width: "Confidence Interval Width",
		mean: "Mean",
		sd: "Standard Deviation",
		conflevel: "Confidence Level (0-1)",
        help: {
            title: "Sample Size, Precision of a Mean",
            r_help: "help(prec_mean, package ='presize')",
            body: `
This is an assessment of sample size for one mean based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Mean:</b> Specify the expected mean value
<br/><br/>
<b>Standard Deviation:</b> Specify the standard deviation of the outcome
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionOneMean extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionOneMean",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_mean(mean={{selected.mean | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, sd={{selected.sd | safe}}) 

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
			mean: {
				el: new input(config, {
					no: 'mean',
					label: localization.en.mean,
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
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
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.mean.el.content, objects.sd.el.content, objects.conflevel.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-t1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionOneMean().render()