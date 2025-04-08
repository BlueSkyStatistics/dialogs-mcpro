/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class FillValuesDownwardUpward extends baseModal {
    static dialogId = 'FillValuesDownwardUpward'
    static t = baseModal.makeT(FillValuesDownwardUpward.dialogId)

    constructor() {
        var config = {
            id: FillValuesDownwardUpward.dialogId,
            label: FillValuesDownwardUpward.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(tidyverse)

{{dataset.name}} <- {{dataset.name}} %>% 
	group_by({{selected.groupbyvars | safe}}) %>% 
	fill({{selected.fillinvars | safe}}, .direction="{{selected.directiongrp | safe}}")

BSkyLoadRefreshDataframe("{{dataset.name}}")
`
        };
        var objects = {
			content_var: { el: new srcVariableList(config, {action: "move"}) },
            fillinvars: {
                el: new dstVariableList(config, {
                    label: FillValuesDownwardUpward.t('fillinvars'),
                    no: "fillinvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: FillValuesDownwardUpward.t('groupbyvars'),
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			directionlabel: { el: new labelVar(config, { label: FillValuesDownwardUpward.t('directionlabel'), style: "mt-3",h: 5 }) },
			downward: {
				el: new radioButton(config, {
				label: FillValuesDownwardUpward.t('downward'),
				no: "directiongrp",
				increment: "downward",
				value: "down",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			upward: {
				el: new radioButton(config, {
				label: FillValuesDownwardUpward.t('upward'),
				no: "directiongrp",
				increment: "upward",
				value: "up",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.fillinvars.el.content, objects.groupbyvars.el.content, objects.directionlabel.el.content, objects.downward.el.content, objects.upward.el.content],
            nav: {
                name: FillValuesDownwardUpward.t('navigation'),
                icon: "icon-fill",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: FillValuesDownwardUpward.t('help.title'),
            r_help: FillValuesDownwardUpward.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: FillValuesDownwardUpward.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new FillValuesDownwardUpward().render()
}
