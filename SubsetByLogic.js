/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Subset Dataset by Logic",
        navigation: "Subset Dataset by Logic",
        label0: "You can choose to save the results in a new dataset or overwrite the existing dataset",
        label1: "Options",
        New: "Save results to a new dataset",
        newdatasetname: "Enter a dataset name",
        Existing: "Overwrite existing dataset",
        Output: "Display results in the output window",
        distinct: "Select distinct cases",
        chkbox2: "Remove unused factor levels",
        subsetvars: "Select variables to include in subsetted dataset",
        label12: "Subsetting criteria is applied against each row, see examples below. \n1: Select rows where var 1 is non empty and var2 is empty specify:\n!is.na(var1) & is.na(var2) \n2: Select rows where var1 > 30 and var 2 is Male specify:\nvar1>30 & var2=='Male' \n3: Complex and or criteria specify:\n(var1 !=10 & var2>20) | var3==40 \n4: Pattern match (xxx) or an exact match (abc) specify:\n(grepl(\"xxx\",var1) ==TRUE) | var1==\"abc\" \n5: Match a substring by position specify: substr(var1,2,4) ==\"abc\"",
        subsetexpression: "Enter subsetting criteria.",
        help: {
            title: "Subset Dataset",
            r_help: "help(filter, package=dplyr)",
            body: `
            <b>Description</b></br>
Returns a subset of the dataset. You can specify the columns/variables that you want in the smaller dataset. You can also specify selection criteria to be applied against each row of the dataframe.
<br/><br/>
<b>Save results to a new dataset:</b> Specify a new dataset to store the subsetted data
<br/><br/>
<b>Overwrite existing dataset:</b> This saves the subsetted dataset to the existing dataset name
<br/><br/>
<b>Display results in the output window:</b> This prints the subsetted dataset in the output window only.  The subsetted dataset is not saved in a dataset.
<br/><br/>
<b>Selected distinct cases:</b> This removes duplicates from the subsetted dataset. All variables have to be the same to be considered a duplicate.
<br/><br/>
<b>Remove unused factor levels:</b> This deletes factor levels that were excluded by the subset (i.e. no longer appear in the data).
<br/><br/>
<b>Select variables to include in subsetted dataset:</b> This allows the user to select specific columns they want to include in the dataset.  If any are specified, then only the specified variables will show up in the subsetted dataset.  If no variables are specified, then all variables will be kept.
<br/><br/>
<b>Enter subsetting criteria:</b> Specify variable logic that will be used to filter the rows of the dataset.
<br/><br/>
<b>R Package</b></br>
dplyr<br/>  
<b>Help</b></br>
help(filter, package=dplyr)
`}
    }
}


class SubsetByLogic extends baseModal {
    constructor() {
        var config = {
            id: "SubsetByLogic",
            label: localization.en.title,
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
            label0: { el: new labelVar(config, { label: localization.en.label0, h: 6 }) },
            content_var: { el: new srcVariableList(config, {scroll:true}) },
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 5 }) },
            New: { el: new radioButton(config, { label: localization.en.New, no: "rd", increment: "New", required: true, value: "TRUE", state: "checked", extraction: "ValueAsIs", dependant_objects: ['newdatasetname'] }) },
            newdatasetname: {
                el: new input(config, {
                    no: 'newdatasetname',
                    label: localization.en.newdatasetname,
                    placeholder: "",
                    extraction: "TextAsIs",
                    type: "character",
                    overwrite: "dataset",
                    ml: 4,
                })
            },
            Existing: { el: new radioButton(config, { label: localization.en.Existing, no: "rd", increment: "Existing", value: "X", state: "", syntax: "{{dataset.name}}", extraction: "ValueAsIs" }) },
            Output: { el: new radioButton(config, { label: localization.en.Output, no: "rd", increment: "Output", value: "#$*BSkyOutputTrue#$*", state: "", extraction: "ValueAsIs" }) },
            //   Output: { el: new radioButton(config, {label: localization.en.Output, no: "rd", increment: "Output", value: "TRUE", state: "", extraction: "ValueAsIs" })},
            distinct: {
                el: new checkbox(config, {
                    label: localization.en.distinct,
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
                    label: localization.en.chkbox2,
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
                    label: localization.en.subsetvars,
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
                    label: localization.en.subsetexpression,
                })
            },			

            label12: { el: new preVar(config, { no: "label12", label: localization.en.label12, h: 6, style: "mt-3" }) },


        }
        const content = {
            head: [objects.label0.el.content,],
            left: [objects.content_var.el.content],
            right: [objects.label1.el.content, objects.New.el.content, objects.newdatasetname.el.content, objects.Existing.el.content, objects.Output.el.content, objects.distinct.el.content, objects.chkbox2.el.content, objects.subsetvars.el.content, objects.label12.el.content, objects.subsetexpression.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-funnel-i",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new SubsetByLogic().render()
