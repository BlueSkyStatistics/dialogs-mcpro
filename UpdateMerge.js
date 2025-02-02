
class UpdateMerge extends baseModal {
    static dialogId = 'UpdateMerge'
    static t = baseModal.makeT(UpdateMerge.dialogId)

    constructor() {
        var config = {
            id: UpdateMerge.dialogId,
            label: UpdateMerge.t('title'),
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
                    label: UpdateMerge.t('join'),
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
                    label: UpdateMerge.t('out'),
                    overwrite: "dataset",
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    type: "character",
                    required: true,
                }),
            },    
            label1: { el: new labelVar(config, { label: UpdateMerge.t('label1'), h: 5, style: "mt-1", }) },
            upsert: {
                el: new radioButton(config, { label: UpdateMerge.t('upsert'), no: "mergetype", increment: "upsert", value: "dplyr::rows_upsert", state: "checked", extraction: "ValueAsIs" })
            },
            update: {
                el: new radioButton(config, { label: UpdateMerge.t('update'), no: "mergetype", increment: "update", value: "dplyr::rows_update", state: "", extraction: "ValueAsIs" })
            },
            insert: {
                el: new radioButton(config, { label: UpdateMerge.t('insert'), no: "mergetype", increment: "insert", value: "dplyr::rows_insert", state: "", extraction: "ValueAsIs" })
            },
            patch: {
                el: new radioButton(config, { label: UpdateMerge.t('patch'), no: "mergetype", increment: "patch", value: "dplyr::rows_patch", state: "", extraction: "ValueAsIs" })
            },
            delete: {
                el: new radioButton(config, { label: UpdateMerge.t('delete'), no: "mergetype", increment: "delete", value: "dplyr::rows_delete", state: "", extraction: "ValueAsIs" })
            }
        }
        
        const content = {
            head: [],
           left: [  objects.select12.el.content],
            right: [objects.out.el.content, objects.join.el.content, objects.label1.el.content, objects.upsert.el.content, objects.update.el.content, objects.insert.el.content, objects.patch.el.content, objects.delete.el.content],
           
            nav: {
                name: UpdateMerge.t('navigation'),
                icon: "icon-merge_update",
                modal: config.id,
                description: UpdateMerge.t('description')
            },
            sizeleft: 4,
            sizeright: 8
        }
        super(config, objects, content);
        
        this.help = {
            title: UpdateMerge.t('help.title'),
            r_help: UpdateMerge.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: UpdateMerge.t('help.body')
        }
;
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

module.exports = {
    render: () => new UpdateMerge().render()
}
