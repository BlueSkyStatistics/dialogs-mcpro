
var localization = {
    en: {
        title: "Crosstab List",
        navigation: "Crosstab List",
        destvarslabel: "Variables for Table",
        missinglabel: "Missing Values",
		removelabel: "Remove",
		showexcludelabel: "Show and Exclude from Percentages",
		includelabel: "Show and Include in Percentages",
		sparseoptlabel: "Include Combinations with 0 Counts",
		toplistoptlabel: "Show Top N Most Frequent Values",
		topnumlabel: "N",
        help: {
            title: "Crosstab List",
            r_help: "help(freqlist, package ='arsenal')",
            body: `
This creates frequency tables in a list format for combinations of one or more variables.  Every combination of values across all specified variables will be tabled, 
with their observed frequencies.  The specified variables can be any class, including numeric, continuous variables.  While this can be used for summary frequencies and 
percentages, a major use is checking data for inconsistencies.  Care should be taken about how many variables to cross-classify and how many possibilities can result, as 
some tables may take longer to produce. 
<br/><br/>
<b>Variables for Table:</b>  <br/>Variables to be included in the table, which can be any class.  The table will be sorted according to the order of variables in this list.  
This means if variables A and B are the specified order, then the table will be sorted by levels of A, then levels of B within A.
<br/><br/>
<b>Missing Values</b>
<br/>
<ul>
	<li><b>Remove:</b>  Variable value combinations that have NA's will be excluded from the table.</li>
	<li><b>Show and Exclude from Percentages:</b>  Variable value combinations that have NA's will be included in the table, but will not be included in percentage computations.</li>
	<li><b>Show and Include in Percentages:</b>  Variable value combinations that have NA's will be included in the table and be included in percentage computations.</li> 
</ul>
<br/><br/>
<b>Include Combinations with 0 Counts:</b>  <br/>Whether to include variable value combinations that don't exist in the dataset.  For example, if variables A and B both have observed values of 1, 2, and 3, but (A, B) combination (1, 3) isn't observed in the data, this option would include a row for the (1, 3) combination with a frequency of 0.
<br/><br/>
<b>Show Top N Most Frequent Values:</b>  <br/>If checked, this would create a separate table with the top N most frequent variable combinations.
<ul>
	<li><b>N:</b> How many variable combinations to show for the top N table.</li>
</ul>
<b>R Packages Required:</b> arsenal
			`}
    }
}









class CrosstabList extends baseModal {
    constructor() {
        var config = {
            id: "CrosstabList",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(arsenal)

# total observations
BSkyFormat(data.frame(Nobs=c(dim({{dataset.name}})[1])), singleTableOutputHeader="Number of Observations")

# frequency list
mytab <- table({{dataset.name}}[, c({{selected.destvars | safe}})], useNA="ifany")
multiwaytab <- freqlist(mytab, na.options="{{selected.missinggrp | safe}}", sparse={{selected.sparseopt | safe}})

BSkyFormat(as.data.frame(multiwaytab), singleTableOutputHeader="Frequency List: {{selected.destvars | safe}}")

{{if (options.selected.toplistopt=="TRUE")}}
# top N table
toplisttab <- head(summary(sort(multiwaytab, decreasing=TRUE), dupLabels=TRUE), n={{selected.topnum | safe}})
BSkyFormat(toplisttab$object[[1]], singleTableOutputHeader="{{selected.topnum | safe}} Most Frequent Combinations")
{{/if}}
`
        };
        var objects = {
			content_var: { el: new srcVariableList(config, {action: "move"}) },
            destvars: {
                el: new dstVariableList(config, {
                    label: localization.en.destvarslabel,
                    no: "destvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                })
            },
			missinglabel: { el: new labelVar(config, { label: localization.en.missinglabel, style: "mt-5",h: 5 }) },
			remove: {
				el: new radioButton(config, {
				label: localization.en.removelabel,
				no: "missinggrp",
				increment: "remove",
				value: "remove",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			showexclude: {
				el: new radioButton(config, {
				label: localization.en.showexcludelabel,
				no: "missinggrp",
				increment: "showexclude",
				value: "showexclude",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			include: {
				el: new radioButton(config, {
				label: localization.en.includelabel,
				no: "missinggrp",
				increment: "include",
				value: "include",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			sparseopt: {
				el: new checkbox(config, {
				label: localization.en.sparseoptlabel,
				no: "sparseopt",
				style: "mt-5",
				extraction: "Boolean"
				})
			},
			toplistopt: {
				el: new checkbox(config, {
				label: localization.en.toplistoptlabel,
				no: "toplistopt",
				style: "mt-3",
				newline: true,
				extraction: "Boolean"
				})
			},
			topnum: {
				el: new inputSpinner(config, {
				no: 'topnum',
				label: localization.en.topnumlabel,
				style: "mt-3 ml-3",
				min: 1,
				max: 1000000,
				step: 1,
				value: 10,
				extraction: "NoPrefix|UseComma"
				})
			}			
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.destvars.el.content, objects.missinglabel.el.content, objects.remove.el.content, objects.showexclude.el.content, objects.include.el.content,
					objects.sparseopt.el.content, objects.toplistopt.el.content, objects.topnum.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-th-list",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new CrosstabList().render()