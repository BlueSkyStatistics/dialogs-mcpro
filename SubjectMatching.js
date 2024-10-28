


class SubjectMatching extends baseModal {
    static dialogId = 'SubjectMatching'
    static t = baseModal.makeT(SubjectMatching.dialogId)

    constructor() {
        var config = {
            id: SubjectMatching.dialogId,
            label: SubjectMatching.t('title'),
            modalType: "two",
            RCode: `
library(dplyr)
library(tidyr)
library(MatchIt)

prematch_data <- drop_na({{dataset.name}}, {{selected.groupvar | safe}}, {{selected.bothstr | safe}})

postmatch <- matchit({{selected.groupvar | safe}} ~ {{selected.formulapart | safe}},
	data=prematch_data, method="nearest", distance="mahalanobis",
	replace=FALSE,
	{{selected.exactpart | safe}} {{selected.calvarnumpart | safe}} std.caliper=FALSE, ratio={{selected.ratio | safe}})
						 
{{selected.newdatasetname | safe}} <- match.data(postmatch)
{{selected.newdatasetname | safe}} <- arrange({{selected.newdatasetname | safe}}, subclass)
BSkyLoadRefreshDataframe("{{selected.newdatasetname | safe}}")

# number of observations, controls, and cases in matched data
num_obs <- nrow({{selected.newdatasetname | safe}})
num_controls <- table({{selected.newdatagrp | safe}})[1]
num_cases <- table({{selected.newdatagrp | safe}})[2]

num_obs_df <- data.frame(Number.Obs=num_obs, N.Controls=num_controls, N.Cases=num_cases)
rownames(num_obs_df)<-NULL
BSkyFormat(num_obs_df, singleTableOutputHeader="Matched Data Number of Observations, Controls, and Cases") 

# set sizes in matched data
set_sizes <- as.data.frame(table(table({{selected.newdatasetname | safe}}$subclass)))
names(set_sizes)[1] <- "Subclass.Size"
BSkyFormat(set_sizes, singleTableOutputHeader="Matched Data Subclass Size Frequencies") 
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			newdatasetname: {
				el: new input(config, {
					no: 'newdatasetname',
					label: SubjectMatching.t('newdatasetnamelabel'),
					extraction: "TextAsIs",
					type: "character",
					allow_spaces: false,
					value: "matched_data",
					required: true,
					overwrite: "dataset",
					width:"w-75",
					style: "mb-3"
				})
			},			
            groupvar: {
                el: new dstVariable(config, {
                    label: SubjectMatching.t('groupvarlabel'),
                    no: "groupvar",
                    filter: "Numeric|Nominal|String|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },
			notelabel: {
				el: new labelVar(config, {
					label: SubjectMatching.t('notelabel'), 
					style: "mt-3 ml-5 mb-3", 
					h:5
				})
			},
			exactvars: {
				el: new dstVariableList(config,{
					label: SubjectMatching.t('exactvarslabel'),
					no: "exactvars",
					required: false,
					filter:"String|Date|Numeric|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UsePlus"
				})
			},
			calipervars: {
				el: new dstVariableList(config,{
					label: SubjectMatching.t('calipervarslabel'),
					no: "calipervars",
					required: false,
					filter:"Numeric|Date|Scale",
					extraction: "NoPrefix|UsePlus"
				})
			},			
			calipers: {
				el: new input(config, {
					no: 'calipers',
					label: SubjectMatching.t('caliperslabel'),
					extraction: "TextAsIs",
					style: "ml-5 mb-3",
					allow_spaces: true,
					width: "w-100"
				})
			},		
			ratio: {
				el: new inputSpinner(config, {
					no: 'ratio',
					label: SubjectMatching.t('ratiolabel'),
					min: 1,
					max: 100,
					step: 1,
					value: 1,
					style: "mt-5",
					extraction: "NoPrefix|UseComma"
				})
			}
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.newdatasetname.el.content, objects.groupvar.el.content, objects.notelabel.el.content,
                objects.exactvars.el.content, 
                objects.calipervars.el.content,
                objects.calipers.el.content,
				objects.ratio.el.content
            ],
            nav: {
                name: SubjectMatching.t('navigation'),
                icon: "icon-paired",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: SubjectMatching.t('help.title'),
            r_help: "help(data,package='utils')",
            body: SubjectMatching.t('help.body')
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
		let exactstr=code_vars.selected.exactvars;		
		let exactarray=exactstr.split("+");
		
		let caliperstr=code_vars.selected.calipervars;	
		let caliperarray=caliperstr.split("+");
		
		let calnumstr=code_vars.selected.calipers;
		let calnumarray=calnumstr.split(",");
		
		// exact variables argument
		let exactpart;
		if (exactstr=="") {
			exactpart="";
		} else {
			exactpart="exact= ~" + exactstr + ",\n";
		}
		
		// caliper variables argument
		let calvarnumarray=new Array(caliperarray.length);
		for (let i = 0; i < (caliperarray.length); i++) {		
			if (caliperarray[i] || calnumarray[i]) {
				calvarnumarray[i] = caliperarray[i] + "=" + calnumarray[i];
			}
		}
		let calvarnumpart=calvarnumarray.join(", ");
		if (calvarnumpart!="") {
			calvarnumpart="caliper=c(" + calvarnumpart + "),\n";
		}
		
		// select variables part
		let botharray;
		if (exactarray.length>0 & caliperarray.length==0) {
			botharray=exactarray;
		} else if (exactarray.length==0 & caliperarray.length>0) {
			botharray=caliperarray;
		} else {
			botharray=exactarray.concat(caliperarray);
		}
		botharray=exactarray.concat(caliperarray);
		botharray=botharray.filter(elem => Boolean(elem));
		let bothstr=botharray.join(", ");
		
		// formula part
		let formulapart=botharray.join("+");
		
		// for number of cases and controls
		let newdatagrp=code_vars.selected.newdatasetname + "$" + code_vars.selected.groupvar;

	
		//create new variables under code_vars
		code_vars.selected.bothstr = bothstr
		code_vars.selected.exactpart = exactpart
		code_vars.selected.formulapart = formulapart
		code_vars.selected.calvarnumpart = calvarnumpart
		code_vars.selected.newdatagrp = newdatagrp
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}	
	
	
}

module.exports = {
    render: () => new SubjectMatching().render()
}
