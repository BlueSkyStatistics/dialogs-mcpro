/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Explore Dataset",
        navigation: "Explore Dataset",
		destdatalabel: "Dataset to Explore",
		htmloutlabel: "Display Output in a Webpage",
		standardgraphlabel: "Include Graphs in Output Window",
		maxdistvalueslabel: "Maximum Distinct Values",
		rounddigitslabel: "Significant Digits",
        help: {
            title: "Explore Dataset",
            r_help: "help(dfSummary, package ='summarytools')",
            body: `
This creates a table describing a dataset.  Descriptions include the dataset name, number of observations, number of variables, number of duplicate records, 
variable names, variable classes, variable summary statistics, and graphs.  This tool is meant more for data exploration and cleaning purposes, rather than data analysis purposes.   
A text version of the table is displayed by default, but a pretty html version can optionally be displayed in the default web browser.
<br/><br/>  
<b>Dataset to Explore:</b> Dataset that you want to describe
<br/><br/>  
<b>Display Output in a Webpage:</b> Check if you want to display a pretty version of the table in the default web browser.  This version will have graphs included.
<br/><br/>
<b>Include Graphs in Output Window:</b> Check if you want to include text versions of the graphs in the BlueSky output window
<br/><br/>
<b>Maximum Distinct Values:</b> The maximum number of values to display frequencies for.  If a variable has more distinct values than this number, the remaining frequencies will be reported 
as a whole category, along with the number of additional distinct values.  For character variables, the most frequent values are displayed, so this also controls how many to show in 
that case.  The default is 10.
<br/><br/>
<b>Significant Digits:</b> Number of significant digits to display.  The default is 2.
<br/><br/>
<b>Required R Packages:</b> summarytools
			`}
    }
}









class ExploreDataset extends baseModal {
    constructor() {
        var config = {
            id: "ExploreDataset",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(summarytools)

dfSummary({{selected.destdata | safe}}, max.distinct.values={{selected.maxdistvalues | safe}}, round.digits={{selected.rounddigits | safe}}, graph.col={{selected.standardgraph | safe}}, 
			labels.col=FALSE, valid.col=FALSE)

{{if (options.selected.htmlout=="TRUE")}}
# if want browser view, valid column and graphs included
view(dfSummary({{selected.destdata | safe}}, max.distinct.values={{selected.maxdistvalues | safe}}, round.digits={{selected.rounddigits | safe}}), labels.col=FALSE, method="browser", silent=TRUE)
{{/if}}
`
        };
        var objects = {
			dataset_var: {
				el: new srcDataSetList(config, {
				action: "move"
				}) 
			},
			destdata: {
				el: new dstVariable(config, {
				label: localization.en.destdatalabel,
				no: "destdata",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},			
			htmlout: {
				el: new checkbox(config, {
				label: localization.en.htmloutlabel,
				no: "htmlout",
				style: "mt-3 mb-2",
				extraction: "Boolean",
				state: "",
				newline: true
				})
			},
			standardgraph: {
				el: new checkbox(config, {
				label: localization.en.standardgraphlabel,
				no: "standardgraph",
				style: "mb-3",
				extraction: "Boolean",
				state: "checked"
				})
			},
			maxdistvalues: {
				el: new inputSpinner(config, {
				no: 'maxdistvalues',
				label: localization.en.maxdistvalueslabel,
				style: "mb-3",
				min: 1,
				max: 1000000,
				step: 1,
				value: 10,
				extraction: "NoPrefix|UseComma"
				})
			},
			rounddigits: {
				el: new inputSpinner(config, {
				no: 'rounddigits',
				label: localization.en.rounddigitslabel,
				min: 1,
				max: 1000000,
				step: 1,
				value: 2,
				extraction: "NoPrefix|UseComma"
				})
			}			
        };
        const content = {
            left: [objects.dataset_var.el.content],
            right: [objects.destdata.el.content, objects.htmlout.el.content, objects.standardgraph.el.content, objects.maxdistvalues.el.content, objects.rounddigits.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-flashlight",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new ExploreDataset().render()