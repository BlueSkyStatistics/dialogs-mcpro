/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class ExploreDataset extends baseModal {
    static dialogId = 'ExploreDataset'
    static t = baseModal.makeT(ExploreDataset.dialogId)

    constructor() {
        var config = {
            id: ExploreDataset.dialogId,
            label: ExploreDataset.t('title'),
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
				label: ExploreDataset.t('destdatalabel'),
				no: "destdata",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},			
			htmlout: {
				el: new checkbox(config, {
				label: ExploreDataset.t('htmloutlabel'),
				no: "htmlout",
				style: "mt-3 mb-2",
				extraction: "Boolean",
				state: "",
				newline: true
				})
			},
			standardgraph: {
				el: new checkbox(config, {
				label: ExploreDataset.t('standardgraphlabel'),
				no: "standardgraph",
				style: "mb-3",
				extraction: "Boolean",
				state: "checked"
				})
			},
			maxdistvalues: {
				el: new inputSpinner(config, {
				no: 'maxdistvalues',
				label: ExploreDataset.t('maxdistvalueslabel'),
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
				label: ExploreDataset.t('rounddigitslabel'),
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
                name: ExploreDataset.t('navigation'),
                icon: "icon-flashlight",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: ExploreDataset.t('help.title'),
            r_help: ExploreDataset.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: ExploreDataset.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new ExploreDataset().render()
}
