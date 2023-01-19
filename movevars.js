var localization = {
    en: {
        title: "Move Variables",
        navigation: "Move Variables",
        varstomovelabel: "Variables to Move",
        locationlabel: "Location",
		firstlabel: "First",
		lastlabel: "Last",
		afterselectedlabel: "After Selected Variable",
		aftervarlabel: "",
        help: {
            title: "Move Variables",
            r_help: "help(relocate, package ='dplyr')",
            body: `
This will move variables to a specified location in the data set.
<br/><br/>
<b>Variables to Move:</b> Variables to move to a different location.  They will be placed in the order specified in this box.
<br/><br/>
<b>Location:</b> Location in the data set to move the variables. <b>First</b> places the variables at the beginning of the data set.  
<b>Last</b> places the variables at the end of the data set.  <b>After Selected Variable</b> places the variables after this variable in the data set.
<br/><br/>
<b>Required R Packages:</b> dplyr
			`}
    }
}









class movevars extends baseModal {
    constructor() {
        var config = {
            id: "movevars",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(dplyr)

{{if (options.selected.locationgrp=="C")}}
{{dataset.name}} <- relocate({{dataset.name}}, {{selected.varstomove | safe}}, .after={{selected.aftervar | safe}})
{{#else}}
	{{if (options.selected.locationgrp=="A")}}
	{{dataset.name}} <- relocate({{dataset.name}}, {{selected.varstomove | safe}})
	{{#else}}
	{{dataset.name}} <- relocate({{dataset.name}}, {{selected.varstomove | safe}} {{selected.locationgrp | safe}})
	{{/if}}
{{/if}}

BSkyLoadRefreshDataframe("{{dataset.name}}")
`
        };
        var objects = {
			content_var: { el: new srcVariableList(config, {action: "move"}) },
            varstomove: {
                el: new dstVariableList(config, {
                    label: localization.en.varstomovelabel,
                    no: "varstomove",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                })
            },
			locationlabel: { el: new labelVar(config, { label: localization.en.locationlabel, style: "mt-3",h: 5 }) },
			first: {
				el: new radioButton(config, {
				label: localization.en.firstlabel,
				no: "locationgrp",
				increment: "first",
				value: "A",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			last: {
				el: new radioButton(config, {
				label: localization.en.lastlabel,
				no: "locationgrp",
				increment: "last",
				value: ", .after=last_col()",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			after: {
				el: new radioButton(config, {
				label: localization.en.afterselectedlabel,
				no: "locationgrp",
				increment: "after",
				value: "C",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			aftervar: {
				el: new dstVariable(config, {
				label: localization.en.aftervarlabel,
				no: "aftervar",
				filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				required: false,
				}),
			},
			
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.varstomove.el.content, objects.locationlabel.el.content, objects.first.el.content, objects.last.el.content, 
					objects.after.el.content, objects.aftervar.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sort_horizontal",
				positionInNav: 0,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new movevars().render()