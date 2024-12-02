



class SubsetByLogic extends baseModal {
    static dialogId = 'SubsetByLogic'
    static t = baseModal.makeT(SubsetByLogic.dialogId)

    constructor() {
        var config = {
            id: SubsetByLogic.dialogId,
            label: SubsetByLogic.t('title'),
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(dplyr)
{{if (options.selected.rd =="#$*BSkyOutputTrue#$*")}}
#Create the subsetted dataset
\nBSkyTempObjForSubset <- {{dataset.name}} %>% 
	dplyr::filter({{selected.subsetexpression | safe}}) {{selected.subsetvars | safe}}{{selected.distinct | safe}}{{selected.chkbox2 | safe }}
\n#Convert the results to a dataframe for compatibility with BSkyFormat
BSkyTempObjForSubset <- as.data.frame(BSkyTempObjForSubset)
BSkyFormat(BSkyTempObjForSubset, singleTableOutputHeader="Subset Results")
{{#else}}
#Creates the subsetted dataset
{{if (options.selected.newdatasetname !== "")}}{{selected.newdatasetname | safe}}{{#else}}{{selected.rd | safe}}{{/if}} <- {{dataset.name}} %>%
	dplyr::filter({{selected.subsetexpression | safe}}) {{selected.subsetvars | safe}}{{selected.distinct | safe}}{{selected.chkbox2 | safe}}
\n#Refreshes the subsetted dataset in the data grid
BSkyLoadRefresh({{if (options.selected.newdatasetname !== "")}}'{{selected.newdatasetname | safe}}'{{#else}}'{{selected.rd | safe}}'{{/if}})
{{/if}}
{{if (options.selected.rd =="#$*BSkyOutputTrue#$*")}}
if (exists('BSkyTempObjForSubset')) rm(BSkyTempObjForSubset)
{{/if}}
`
        }
        var objects = {
            label0: { el: new labelVar(config, { label: SubsetByLogic.t('label0'), h: 6 }) },
            content_var: { el: new srcVariableList(config, {scroll:true}) },
            label1: { el: new labelVar(config, { label: SubsetByLogic.t('label1'), h: 5 }) },
            New: { el: new radioButton(config, { label: SubsetByLogic.t('New'), no: "rd", increment: "New", required: true, value: "TRUE", state: "checked", extraction: "ValueAsIs", dependant_objects: ['newdatasetname'] }) },
            newdatasetname: {
                el: new input(config, {
                    no: 'newdatasetname',
                    label: SubsetByLogic.t('newdatasetname'),
                    placeholder: "",
                    extraction: "TextAsIs",
                    type: "character",
                    overwrite: "dataset",
                    ml: 4,
                })
            },
            Existing: { el: new radioButton(config, { label: SubsetByLogic.t('Existing'), no: "rd", increment: "Existing", value: "X", state: "", syntax: "{{dataset.name}}", extraction: "ValueAsIs" }) },
            Output: { el: new radioButton(config, { label: SubsetByLogic.t('Output'), no: "rd", increment: "Output", value: "#$*BSkyOutputTrue#$*", state: "", extraction: "ValueAsIs" }) },
            //   Output: { el: new radioButton(config, {label: SubsetByLogic.t('Output'), no: "rd", increment: "Output", value: "TRUE", state: "", extraction: "ValueAsIs" })},
            distinct: {
                el: new checkbox(config, {
                    label: SubsetByLogic.t('distinct'),
                    no: "distinct",
                    style: "mt-2",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "%>%\n\tdistinct",
                    false_value: " ",
                    newline: true,
                })
            },
            chkbox2: {
                el: new checkbox(config, {
                    label: SubsetByLogic.t('chkbox2'),
                    no: "chkbox2",
                    bs_type: "valuebox",
					style: "mb-3",
                    extraction: "BooleanValue",
                    true_value: " %>%\n\tdroplevels()",
                    false_value: " ",
                    newline: true,
                })
            },
            subsetvars: {
                el: new dstVariableList(config, {
                    label: SubsetByLogic.t('subsetvars'),
                    no: "subsetvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    wrapped: '%>%\n\tdplyr::select(%val%)',
                    required: false,
                }), r: ['{{ var | safe}}']
            },
            subsetexpression: {
                el: new computeBuilder(config, {
                    no: "subsetexpression",
                    label: SubsetByLogic.t('subsetexpression'),
                })
            },			

            label12: { el: new preVar(config, { no: "label12", label: SubsetByLogic.t('label12'), h: 6, style: "mt-3" }) },


        }
        const content = {
            head: [objects.label0.el.content,],
            left: [objects.content_var.el.content],
            right: [objects.label1.el.content, objects.New.el.content, objects.newdatasetname.el.content, objects.Existing.el.content, objects.Output.el.content, objects.distinct.el.content, objects.chkbox2.el.content, objects.subsetvars.el.content, objects.label12.el.content, objects.subsetexpression.el.content],
            nav: {
                name: SubsetByLogic.t('navigation'),
                icon: "icon-funnel-i",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: SubsetByLogic.t('help.title'),
            r_help: "help(data,package='utils')",
            body: SubsetByLogic.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new SubsetByLogic().render()
}

