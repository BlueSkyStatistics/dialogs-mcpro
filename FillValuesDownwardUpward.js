/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Fill Values Downward or Upward",
        navigation: "Fill Values Downward or Upward",
        fillinvars: "Variables to Fill In Values",
        groupbyvars: "Variables to Group By",
        directionlabel: "Direction",
		downward: "Downward",
		upward: "Upward",
        help: {
            title: "Fill Values Downward or Upward",
            r_help: "help(fill, package ='tidyr')",
            body: `
This dialog fills in missing values in dataset columns by using the previous entry in each column.  This can be useful in cases where values are not repeated, but recorded each time they change.  Typically, this means the dataset is sorted in a meaningful way.  The variables where values are filled in will be overwritten.
<br/><br/>
<b>Variables to Fill In Values:</b> Specify variables for which missing values will be filled in
<br/><br/>
<b>Variables to Group By:</b> Specify variables that group rows together.  Missing values will be filled in within groups defined by these variables.  For example, grouping by a subject identifier would fill in values within subjects.
<br/><br/>
<b>Direction:</b> Specify the direction for which the values will be filled in.
<br/><br/>
<b>R Packages Required:</b> tidyverse
			`}
    }
}









class FillValuesDownwardUpward extends baseModal {
    constructor() {
        var config = {
            id: "FillValuesDownwardUpward",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(tidyverse)

{{dataset.name}} <- {{dataset.name}} %>% 
	dplyr::group_by({{selected.groupbyvars | safe}}) %>% 
	fill({{selected.fillinvars | safe}}, .direction="{{selected.directiongrp | safe}}")

BSkyLoadRefreshDataframe("{{dataset.name}}")
`
        };
        var objects = {
			content_var: { el: new srcVariableList(config, {action: "move"}) },
            fillinvars: {
                el: new dstVariableList(config, {
                    label: localization.en.fillinvars,
                    no: "fillinvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: localization.en.groupbyvars,
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			directionlabel: { el: new labelVar(config, { label: localization.en.directionlabel, style: "mt-3",h: 5 }) },
			downward: {
				el: new radioButton(config, {
				label: localization.en.downward,
				no: "directiongrp",
				increment: "downward",
				value: "down",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			upward: {
				el: new radioButton(config, {
				label: localization.en.upward,
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
                name: localization.en.navigation,
                icon: "icon-fill",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new FillValuesDownwardUpward().render()