
var localization = {
    en: {
        title: "Separate Variable",
        navigation: "Separate",
		sepvarlabel: "Variable to separate",
		delimiterlabel: "Characters used to separate",
        help: {
            title: "Separate Variable",
			r_help: "help(separate_wider_delim, package = 'tidyr')",
            body: `
            This separates a variable's values into parts (one variable for each part) based on characters that define the separate parts.
			<br/><br/>
			For example, if the character used to separate is a comma (,) , it will separate the values into parts around the commas.  
			<br/><br/>
			The number of variables added to the dataset will be the maximum number of parts that any observation was separated into.  The names of the new variables will be the variable name being separated, plus a numbered suffix that corresponds to each part.  The variables will contain missing values if an observation cannot be separated into the maximum number of variables.  If the characters used to separate cannot be found in the value, then the original value will be returned (i.e. there is only one part).
			<br/><br/>
			<b>Variable to separate:</b>
			<br/>Specify the variable you want to separate into parts.  This can be a character, numeric, factor, ordinal factor, or a date variable.  A non-character variable will be coerced to a character variable for the purposes of separating, but the original variable will be left as-is.
			<br/><br/>
			<b>Characters used to separate:</b>
			<br/>Specify the character pattern that is the separator of the parts.  This can be one or more characters.
			<br/><br/>
            <b>Required R packages:</b> tidyr, dplyr
`}
    }
}

class Separate extends baseModal {
    constructor() {
        var config = {
            id: "Separate",
            label: localization.en.title,
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
                    label: localization.en.sepvarlabel,
                    no: "sepvar",
                    filter: "Numeric|Nominal|Ordinal|String|Scale|Date",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },			
			delimiter: {
				el: new input(config, {
					no: 'delimiter',
					label: localization.en.delimiterlabel,
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
                name: localization.en.navigation,
                icon: "icon-wider",
				positionInNav: 13,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	
}
module.exports.item = new Separate().render()