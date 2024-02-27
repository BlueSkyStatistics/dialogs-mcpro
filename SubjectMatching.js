
var localization = {
    en: {
        title: "Subject Matching",
        navigation: "Subject Matching",
		newdatasetnamelabel: "Dataset name to store matched data",
        groupvarlabel: "Case/control variable (control=lower value, case=higher value)",
		notelabel: "Note: You must specify at least one variable for exact or caliper variables",
        exactvarslabel: "Variables for exact matching",		
		calipervarslabel: "Variables for caliper matching",
        caliperslabel: "Specify calipers in order of caliper variables separated by commas, e.g. 5, 2",
		idvarlabel: "Subject ID variable",
        ratiolabel: "Number of controls per case",
        help: {
            title: "Subject Matching",
            r_help: "help(matchit, package = 'MatchIt')",
            body: `
            Performs nearest neighbor subject matching where a set of cases is matched to 1 or more controls.  This is appropriate for case/control studies and matched cohort studies.
			<br/><br/>
			Variables for which values have to match exactly and values matching within numerical calipers are supported.
			Matching is done without replacement (each subject can only be matched once) and the controls among the potential controls will be selected according to the data order for each case.
			<br/><br/>
			The output dataset will contain the original data and two additional variables: 1) subclass: a variable identifying the matched set, and 2) weights: a matching case weight variable that can be used in subsequent analysis, if desired.
			<br/><br/>
			<b>Dataset name to store matched data:</b>
			<br/>Name of output dataset containing the matched subject sets.
			<br/><br/>
			<b>Case/control variable (control=lower value, case=higher value):</b>
			<br/>Name of variable indicating cases and controls.  Can be numeric, factor, or character.  
			If a numeric variable, this must be coded as 0=control, 1=case.  If a factor variable, the lower ordered level will be the controls and the higher ordered level will be the cases.  
			If a character variable, the lower ordered value (by alphabetic order) will be the controls, and the higher ordered value (by alphabetic order) will be the cases.
			So to be safer we recommend coding as 0=control, 1=case.
			</br><br/>
			<b>Variables for exact matching:</b>
			<br/>Specify the variables for which you want the case/control sets to be exactly matched.  
			This means the cases and controls in a matched set have exactly the same values for these variables. These can be character, date, numeric, factor, or ordinal variables.
			<br/><br/>
			<b>Variables for caliper matching:</b>
			<br/>Specify the variables for which you want the case/control sets to be matched on numerical caliper values.  The controls will be within a specified caliper width for each of these variables.
			These can be numeric or date variables.  Each caliper variable must have a caliper value specified.
			<br/><br/>
			<b>Specify calipers in order of caliper variables separated by commas:</b>
			<br/>Specify the numeric caliper values for each of the caliper variables, in order of the caliper variables.  
			For example, if age (in years) was specified with a caliper of 5, that means the controls must be within +/- 5 years of their matched case.
			Each caliper variable must have a caliper value specified. If there are no caliper variables, this field must be empty.
			<br/><br/>
			<b>Number of controls per case:</b>
			<br/>This is the maximum number of controls that will be matched to each case.  Some matched sets may have less than this value if suitable matches cannot be identified.
            <br/><br/>
            <b>Required R packages:</b> dplyr, tidyr, MatchIt
`}
    }
}

class SubjectMatching extends baseModal {
    constructor() {
        var config = {
            id: "SubjectMatching",
            label: localization.en.title,
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
					label: localization.en.newdatasetnamelabel,
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
                    label: localization.en.groupvarlabel,
                    no: "groupvar",
                    filter: "Numeric|Nominal|String|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },
			notelabel: {
				el: new labelVar(config, {
					label: localization.en.notelabel, 
					style: "mt-3 ml-5 mb-3", 
					h:5
				})
			},
			exactvars: {
				el: new dstVariableList(config,{
					label: localization.en.exactvarslabel,
					no: "exactvars",
					required: false,
					filter:"String|Date|Numeric|Ordinal|Nominal|Scale",
					extraction: "NoPrefix|UsePlus"
				})
			},
			calipervars: {
				el: new dstVariableList(config,{
					label: localization.en.calipervarslabel,
					no: "calipervars",
					required: false,
					filter:"Numeric|Date|Scale",
					extraction: "NoPrefix|UsePlus"
				})
			},			
			calipers: {
				el: new input(config, {
					no: 'calipers',
					label: localization.en.caliperslabel,
					extraction: "TextAsIs",
					style: "ml-5 mb-3",
					allow_spaces: true,
					width: "w-100"
				})
			},		
			ratio: {
				el: new inputSpinner(config, {
					no: 'ratio',
					label: localization.en.ratiolabel,
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
                name: localization.en.navigation,
                icon: "icon-paired",
                modal: config.id
            }
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
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
	
	
}
module.exports.item = new SubjectMatching().render()