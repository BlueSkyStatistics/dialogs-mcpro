


class Separate extends baseModal {
    static dialogId = 'Separate'
    static t = baseModal.makeT(Separate.dialogId)

    constructor() {
        var config = {
            id: Separate.dialogId,
            label: Separate.t('title'),
            modalType: "two",
            RCode: `
library(tidyr)
library(dplyr)

temp_data <- separate_wider_delim({{dataset.name}}, cols={{selected.sepvar | safe}}, delim="{{selected.delimiter | safe}}", 
                                 names_sep="_", cols_remove = FALSE,
                                 too_few="align_start", names_repair="universal")

# places new columns at the spot of the original column
# grabbing the columns at the right spot and isolating
newvars_place <- which(names({{dataset.name}})=="{{selected.sepvar | safe}}")
numvars_added <- length(names(temp_data))-length(names({{dataset.name}}))
temp_data <- dplyr::select(temp_data, names(temp_data)[newvars_place:(newvars_place+numvars_added-1)])

# putting new columns at the end of the dataset
{{dataset.name}} <- bind_cols({{dataset.name}}, temp_data, names_repair="universal") %>%
	dplyr::select(-starts_with("names_repair"))

BSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },		
            sepvar: {
                el: new dstVariable(config, {
                    label: Separate.t('sepvarlabel'),
                    no: "sepvar",
                    filter: "Numeric|Nominal|Ordinal|String|Scale|Date",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },			
			delimiter: {
				el: new input(config, {
					no: 'delimiter',
					label: Separate.t('delimiterlabel'),
					value: ",",
					extraction: "TextAsIs",
					style: "ml-5 mb-3",
					allow_spaces: true,
					required: true,
					width: "w-100"
				})
			}
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.sepvar.el.content, objects.delimiter.el.content
            ],
            nav: {
                name: Separate.t('navigation'),
                icon: "icon-wider",
				positionInNav: 13,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: Separate.t('help.title'),
            r_help: Separate.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: Separate.t('help.body')
        }
;
    }
	
	
}

module.exports = {
    render: () => new Separate().render()
}
