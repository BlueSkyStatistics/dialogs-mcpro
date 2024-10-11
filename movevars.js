









class movevars extends baseModal {
    static dialogId = 'movevars'
    static t = baseModal.makeT(movevars.dialogId)

    constructor() {
        var config = {
            id: movevars.dialogId,
            label: movevars.t('title'),
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
                    label: movevars.t('varstomovelabel'),
                    no: "varstomove",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                })
            },
			locationlabel: { el: new labelVar(config, { label: movevars.t('locationlabel'), style: "mt-3",h: 5 }) },
			first: {
				el: new radioButton(config, {
				label: movevars.t('firstlabel'),
				no: "locationgrp",
				increment: "first",
				value: "A",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			last: {
				el: new radioButton(config, {
				label: movevars.t('lastlabel'),
				no: "locationgrp",
				increment: "last",
				value: ", .after=last_col()",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			after: {
				el: new radioButton(config, {
				label: movevars.t('afterselectedlabel'),
				no: "locationgrp",
				increment: "after",
				value: "C",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			aftervar: {
				el: new dstVariable(config, {
				label: movevars.t('aftervarlabel'),
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
                name: movevars.t('navigation'),
                icon: "icon-sort_horizontal",
				positionInNav: 0,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: movevars.t('help.title'),
            r_help: "help(data,package='utils')",
            body: movevars.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new movevars().render()
}
