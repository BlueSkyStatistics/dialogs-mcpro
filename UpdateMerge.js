var localization = {
    en: {
        title: "Update Merge",
        navigation: "Update Merge",
		
        join: "Join mapping",
        description: `Update merge updates one dataset with values from another dataset.`,
        out: "Enter the name of the merged dataset",
        in1: "Select the 1st dataset",
        in2: "Select the 2nd dataset",
        label1: "Merge Options",
        upsert: "Update variables in first (left) dataset with matches from second (right) dataset, insert non-matches",
        update: "Update variables in first (left) dataset with matches from second (right) dataset, ignore non-matches",
        insert: "Only insert non-matches in first (left) dataset",
        patch: "Update only variables with NAs in first (left) dataset with matches from second (right) dataset",
        delete: "Delete rows from first (left) dataset with matches from second (right) dataset",
        help: {
            title: "Update Merge",
            r_help: "help(rows_upsert, package=dplyr)",
            body: `
            <b>Description</b></br>
            Update merge updates a dataset with values from a second dataset based on exact variable name matching for observations with matching join mapping variable values. 
			<br/>You need to specify one or more variables in the active dataset and in the selected target dataset that you want the join to be performed on.
			<br/>The results will be saved in a new dataset.
			<br/><br/>
			<b>Merge Options</b>
			<br/><br/>
			<b>Update variables in first (left) dataset with matches from second (right) dataset, insert non-matches:</b> This is a combination of updating variables in the left dataset for matches and creating new rows for unmatched rows.
			<br/><br/>
			<b>Update variables in first (left) dataset with matches from second (right) dataset, ignore non-matches:</b> This only updates existing variables in the left datasets for matches.  Unmatched rows are ignored.
			<br/><br/>
			<b>Only insert non-matches in first (left) dataset:</b> This leaves intact all matching rows in the left dataset.  Only non-matching rows from the right dataset are added to the left dataset.
			<br/><br/>
			<b>Update only variables with NAs in first (left) dataset with matches from second (right) dataset, ignore non-matches:</b>  This updates rows that match, but only when the values in the left dataset are NA (i.e. are missing values).
			<br/><br/>
			<b>Delete rows from first (left) dataset with matches from second (right) dataset:</b>  This only deletes rows from the left dataset that match rows in the right dataset.
			<br/><br/>
            <b>R Packages Required:</b> dplyr
`,
        }
    }
}
class UpdateMerge extends baseModal {
    constructor() {
        var config = {
            id: "UpdateMerge",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
library(dplyr)

# renaming variables in second dataset to match the join mapping variables in the first dataset
{{selected.select12 | safe}}.1 <- rename({{selected.select12 | safe}}, {{selected.join | safe}})
# keeping only variables in the second dataset that exist in the first dataset
{{selected.select12 | safe}}.1 <- {{selected.select12 | safe}}.1[names({{selected.select12 | safe}}.1)[names({{selected.select12 | safe}}.1) %in% names({{dataset.name}})]]

# update join using variable names from first dataset
{{selected.out | safe}} <- {{selected.mergetype | safe}}(
    {{dataset.name}},
    {{selected.select12 | safe}}.1,
    by=c({{selected.joinlist | safe}}){{if (options.selected.mergetype=="dplyr::rows_insert")}}, conflict="ignore" {{/if}}{{if ((options.selected.mergetype=="dplyr::rows_update") | (options.selected.mergetype=="dplyr::rows_patch") | (options.selected.mergetype=="dplyr::rows_delete"))}}, unmatched="ignore"{{/if}} 
    )

BSkyLoadRefreshDataframe("{{selected.out | safe}}")
`,
        }
        var objects = {
            select12: {
                el: new selectDataset(config, {
                    no: 'select12',
                    /*label: UpdateMerge.t('selectAPackage'),*/
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: "",          
                })
            },  
            join: {
                el: new mergeJoin(config, {
                    no: 'join',
                    label: localization.en.join,
                    multiple: false,
                    required:true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: "",
                })
            },               
            out: {
                el: new input(config, {
                    no: 'out',
                    label: localization.en.out,
                    overwrite: "dataset",
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    type: "character",
                    required: true,
                }),
            },    
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 5, style: "mt-1", }) },
            upsert: {
                el: new radioButton(config, { label: localization.en.upsert, no: "mergetype", increment: "upsert", value: "dplyr::rows_upsert", state: "checked", extraction: "ValueAsIs" })
            },
            update: {
                el: new radioButton(config, { label: localization.en.update, no: "mergetype", increment: "update", value: "dplyr::rows_update", state: "", extraction: "ValueAsIs" })
            },
            insert: {
                el: new radioButton(config, { label: localization.en.insert, no: "mergetype", increment: "insert", value: "dplyr::rows_insert", state: "", extraction: "ValueAsIs" })
            },
            patch: {
                el: new radioButton(config, { label: localization.en.patch, no: "mergetype", increment: "patch", value: "dplyr::rows_patch", state: "", extraction: "ValueAsIs" })
            },
            delete: {
                el: new radioButton(config, { label: localization.en.delete, no: "mergetype", increment: "delete", value: "dplyr::rows_delete", state: "", extraction: "ValueAsIs" })
            }
        }
        
        const content = {
            head: [],
           left: [  objects.select12.el.content],
            right: [objects.out.el.content, objects.join.el.content, objects.label1.el.content, objects.upsert.el.content, objects.update.el.content, objects.insert.el.content, objects.patch.el.content, objects.delete.el.content],
           
            nav: {
                name: localization.en.navigation,
                icon: "icon-merge_update",
                modal: config.id,
                description: localization.en.description
            },
            sizeleft: 4,
            sizeright: 8
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	
	prepareExecution(instance) {
		//following lines will be there
		var res = [];
		var code_vars = {
            dataset: {
                name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
		
		//create several formats
		
		let mapstring=code_vars.selected.join;
		let maparray=mapstring.split(",");
		
		//let result="";
		//maparray.forEach( elem => {result=result+elem.substring(0,elem.indexOf('=')) } )
		
		let mymap=maparray.map(elem => elem.substring(0,elem.indexOf('=')));
		let result=mymap.join(',');

		//create new variables under code_vars
		code_vars.selected.joinlist = result		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}		
	
	
}
module.exports.item = new UpdateMerge().render()