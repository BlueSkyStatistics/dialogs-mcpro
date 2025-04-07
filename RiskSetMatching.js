/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class RiskSetMatching extends baseModal {
    static dialogId = 'RiskSetMatching'
    static t = baseModal.makeT(RiskSetMatching.dialogId)

    constructor() {
        var config = {
            id: RiskSetMatching.dialogId,
            label: RiskSetMatching.t('title'),
            modalType: "two",
            RCode: `
library(dplyr)
library(tidyr)

find.matches <<- function(event, time.to.event, X, caliper = c(0, 5, 5), M=2, repeat.controls=F, super.controls=F){
  
  # Note that this is a greedy algorithm.
  
  # event = A binary vector of event (1) or censor (0)
  # time.to.event = A vector of the time to event (event) or last follow-up (censor)
  # X = numeric matrix of values where each column corresponds to a variable that should be matched on.
  # caliper = a vector of calipers allowed for the matching.  Should have a length equal to the number of columns of X
  # M = The number of controls per case.
  # repeat.controls = Should controls be allowed to match more than once?
  # super.controls = Should cases not be allowed for matching cases?
  
  N <- sum(event)
  cases <- which(event==1)
  
  matched <- 1
  matched.cohort <- NULL
  
  
  for(i in cases){
    temp.days <- time.to.event[i] # Take the time to event for the case of interest
    potential.controls <- which(time.to.event>temp.days) # Only keep those with more follow-up to define the pool of potential controls.
    
    if(super.controls) potential.controls <- setdiff(potential.controls, cases)
    
    if(!repeat.controls | is.null(matched.cohort)) potential.controls <- setdiff(potential.controls, matched.cohort$row)
    
    for(j in 1:ncol(X)){
      checker <- which(abs(X[,j] - X[i,j]) <= caliper[j])
      potential.controls <- intersect(checker, potential.controls)
    }
    
    
    if(length(potential.controls)>=M){
      potential.controls <- sample(potential.controls, replace=F) # Randomly sort the patients
      
      selected.patients <- potential.controls[1:M] # Select the patients
      
      temp.dat <- X[c(selected.patients, i), , drop=F]
      temp.dat$failed <- c(rep(0, M), 1)
      temp.dat$row <- c(selected.patients, i)
      temp.dat$match.num <- matched
      matched.cohort <- rbind(matched.cohort, temp.dat)
      matched <- matched+1
    }
    
  }
  
  return(matched.cohort)
  
}


prematch_data <- drop_na({{dataset.name}}, {{selected.groupvar | safe}}, {{selected.timevar | safe}}, {{selected.calipervars | safe}})

{{selected.newdatasetname | safe}} <- find.matches(event = {{selected.eventstr | safe}},
             time.to.event = {{selected.timestr | safe}},
             X = dplyr::select(prematch_data, {{selected.calipervars | safe}}),
             caliper = c({{selected.calipers | safe}}),
             M = {{selected.ratio | safe }},
             repeat.controls = {{selected.repeatcontrols | safe}},
             super.controls = {{selected.supercontrols | safe}})

# adding original variables to matched data
prematch_data1 <- prematch_data[c({{selected.newdatasetname | safe}}$row), c(names({{dataset.name}})[!(names({{dataset.name}}) %in% names({{selected.newdatasetname | safe}}))])]
{{selected.newdatasetname | safe}} <- bind_cols(prematch_data1, {{selected.newdatasetname | safe}}) 

{{selected.newdatasetname | safe}} <- dplyr::select({{selected.newdatasetname | safe}}, -row)
BSkyLoadRefresh("{{selected.newdatasetname | safe}}")

# number of observations, controls, and cases in matched data
num_obs <- nrow({{selected.newdatasetname | safe}})
num_controls <- table({{selected.newdatasetname | safe}}$failed)[1]
num_cases <- table({{selected.newdatasetname | safe}}$failed)[2]

num_obs_df <- data.frame(Number.Obs=num_obs, N.Controls=num_controls, N.Cases=num_cases)
rownames(num_obs_df) <- NULL
BSkyFormat(num_obs_df, singleTableOutputHeader="Matched Data Number of Observations, Controls, and Cases")

# set sizes in matched data
set_sizes <- as.data.frame(table(table({{selected.newdatasetname | safe}}$match.num)))
names(set_sizes)[1] <- "Set.Size"
BSkyFormat(set_sizes, singleTableOutputHeader="Matched Data Set Size Frequencies") 
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
					label: RiskSetMatching.t('newdatasetnamelabel'),
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
                    label: RiskSetMatching.t('groupvarlabel'),
                    no: "groupvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },
            timevar: {
                el: new dstVariable(config, {
                    label: RiskSetMatching.t('timevarlabel'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },			
			calipervars: {
				el: new dstVariableList(config,{
					label: RiskSetMatching.t('calipervarslabel'),
					no: "calipervars",
					required: true,
					filter:"Numeric|Date|Scale",
					extraction: "NoPrefix|UseComma"
				})
			},			
			calipers: {
				el: new input(config, {
					no: 'calipers',
					label: RiskSetMatching.t('caliperslabel'),
					extraction: "TextAsIs",
					style: "ml-5 mb-3",
					allow_spaces: true,
					required: true,
					width: "w-100"
				})
			},			
			ratio: {
				el: new inputSpinner(config, {
					no: 'ratio',
					label: RiskSetMatching.t('ratiolabel'),
					min: 1,
					max: 100,
					step: 1,
					value: 1,
					style: "mt-5 mb-3",
					extraction: "NoPrefix|UseComma"
				})
			},
			repeatcontrols: {
				el: new checkbox(config, {
				label: RiskSetMatching.t('repeatcontrolslabel'),
				no: "repeatcontrols",
				state: "checked",
				extraction: "Boolean"
				})
			},
			supercontrols: {
				el: new checkbox(config, {
				label: RiskSetMatching.t('supercontrolslabel'),
				no: "supercontrols",
				state: "",
				extraction: "Boolean"
				})
			},
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
                objects.newdatasetname.el.content, objects.groupvar.el.content, objects.timevar.el.content,
                objects.calipervars.el.content,
                objects.calipers.el.content,
				objects.ratio.el.content,
				objects.repeatcontrols.el.content,
				objects.supercontrols.el.content
            ],
            nav: {
                name: RiskSetMatching.t('navigation'),
                icon: "icon-paired",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: RiskSetMatching.t('help.title'),
            r_help: RiskSetMatching.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: RiskSetMatching.t('help.body')
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
		let eventstr="prematch_data$" + code_vars.selected.groupvar;		
		let timestr="prematch_data$" + code_vars.selected.timevar;
		
		//create new variables under code_vars
		code_vars.selected.eventstr = eventstr
		code_vars.selected.timestr = timestr
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
	
}

module.exports = {
    render: () => new RiskSetMatching().render()
}
