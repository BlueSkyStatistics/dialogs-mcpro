










class CrosstabList extends baseModal {
    static dialogId = 'CrosstabList'
    static t = baseModal.makeT(CrosstabList.dialogId)

    constructor() {
        var config = {
            id: CrosstabList.dialogId,
            label: CrosstabList.t('title'),
			splitProcessing: true,
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
                    label: CrosstabList.t('destvarslabel'),
                    no: "destvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                })
            },
			missinglabel: { el: new labelVar(config, { label: CrosstabList.t('missinglabel'), style: "mt-5",h: 5 }) },
			remove: {
				el: new radioButton(config, {
				label: CrosstabList.t('removelabel'),
				no: "missinggrp",
				increment: "remove",
				value: "remove",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			showexclude: {
				el: new radioButton(config, {
				label: CrosstabList.t('showexcludelabel'),
				no: "missinggrp",
				increment: "showexclude",
				value: "showexclude",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			include: {
				el: new radioButton(config, {
				label: CrosstabList.t('includelabel'),
				no: "missinggrp",
				increment: "include",
				value: "include",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			sparseopt: {
				el: new checkbox(config, {
				label: CrosstabList.t('sparseoptlabel'),
				no: "sparseopt",
				style: "mt-5",
				extraction: "Boolean"
				})
			},
			toplistopt: {
				el: new checkbox(config, {
				label: CrosstabList.t('toplistoptlabel'),
				no: "toplistopt",
				style: "mt-3",
				newline: true,
				extraction: "Boolean"
				})
			},
			topnum: {
				el: new inputSpinner(config, {
				no: 'topnum',
				label: CrosstabList.t('topnumlabel'),
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
                name: CrosstabList.t('navigation'),
                icon: "icon-th-list",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: CrosstabList.t('help.title'),
            r_help: "help(data,package='utils')",
            body: CrosstabList.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CrosstabList().render()
}
