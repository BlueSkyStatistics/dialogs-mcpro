
var localization = {
    en: {
        title: "Reorder Variables Alphabetically-",
        navigation: "Reorder Variables23",
        label1: "Reorder variables alphabetically",
        rd1: "A-Z",
        rd2: "Z-A",
        help: {
            title: "Reorder Variables Alphabetically",
            r_help: "help(sort)",
            body: `
<b>Description</b></br>
Re-order variables in the dataset in alphabetical order. We use the sort function to sort the names of the columns/variables in the dataset and the select function in the package dplyr to select the column names in the correct alphabetical order 
<br/>

    `}
    }
}




class sample23 extends baseModal {
    constructor() {
        var config = {
            id: "sample23",
            label: localization.en.title,
            modalType: "one",
            splitProcessing:false,
            RCode: `
require(dplyr)
{{if (options.selected.rdgrp=="TRUE")}}#Reorder variables alphabetically in order A-Z\n{{dataset.name}} <- {{dataset.name}} %>%  dplyr::select(sort(names(.)))\n{{#else}}#Reorder variables alphabetically in order Z-A\n{{dataset.name}} <- {{dataset.name}} %>% dplyr::select(rev(sort(names(.))))\n{{/if}}
BSkyLoadRefresh("{{dataset.name}}" )
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "rdgrp", increment: "rd1", value: "TRUE", state: "checked", extraction: "ValueAsIs" }) },
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "rdgrp", increment: "rd2", value: "FALSE", state: "", extraction: "ValueAsIs" }) },
        }
        const content = {
            items: [objects.rd1.el.content, objects.rd2.el.content,],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sort_horizontal",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new sample23().render()