
var localization = {
    en: {
        title: "Risk Set Matching",
        navigation: "Risk Set Matching",
		newdatasetnamelabel: "Dataset name to store matched data",
        groupvarlabel: "Event variable (1=event, 0=censor)",
		timevarlabel: "Time variable",
		calipervarslabel: "Variables for matching (numeric)",
        caliperslabel: "Specify calipers in order of matching variables separated by commas, e.g. 5, 2; specify 0 for exact matches",
		idvarlabel: "Subject ID variable",
        ratiolabel: "Number of controls per case",
		repeatcontrolslabel: "Allow controls to be matched more than once",
		supercontrolslabel: "Don't allow cases to be matched to other cases", 
        help: {
            title: "Risk Set Matching",
            body: `
            Performs risk set subject matching within a cohort.  Those with the outcome event (cases) are matched from among those who have not had the event (controls) and are in the risk set at the event time of the case.  This is a nested case/control design.  Baseline variables known at cohort entry are also used to match caess and controls.
			<br/><br/>
			Baseline variables for which values have to match exactly and values matching within numerical calipers are supported.
			<br/><br/>
			The output dataset containing the matched data will contain the baseline variables involved in the matching, the event indicator ("failed"), a variable identifying the matched set ("match.num"), and an optional subject ID variable (if specified, called "ID").
			<br/><br/>
			Observations with any missing values for variables involved in the matching process are removed prior to matching.
			<br/><br/>
			A brief introduction to nested case/control designs can be found in:
			Essebag V , et al. The nested case-control study in cardiology. Am Heart J 2003;146:581–90.
			<br/><br/>
			<b>Dataset name to store matched data:</b>
			<br/>Name of output dataset containing the matched subject sets.
			<br/><br/>
			<b>Event variable (1=event, 0=censor):</b>
			<br/>Name of variable indicating those with events.  Must be numeric with 1=event and 0=censor.
			</br><br/>
			<b>Variables for matching:</b>
			<br/>Specify the baseline variables for which you want the case/control sets to be matched.  These must be numeric.
			<br/><br/>
			<b>Specify calipers in order of matching variables separated by commas:</b>
			<br/>Specify the numeric caliper values for each of the variables, in order of the variables. Exact matches should use a caliper of 0. 
			For example, if age (in years) was specified with a caliper of 5, that means the controls must be within +/- 5 years of their matched case.
			Each matching variable must have a caliper value specified.
			<br/><br/>
			<b>Subject ID variable:</b>
			<br/>Specify an optional variable that uniquely identifies each subject.  This will be included in the output matched datset.  This is useful if the resultant matched sets will be used for further data collection.
			<br/><br/>
			<b>Number of controls per case:</b>
			<br/>This is the maximum number of controls that will be matched to each case.  Some matched sets may have less than this value if suitable matches cannot be identified.
            <br/><br/>
			<b>Allow controls to be matched more than once:</b>
			<br/>Specify whether or not you want controls to potentially be matched to more than one case.  We recommend this option to be selected to avoid bias.
            <br/><br/>
			<b>Don't allow cases to be matched to other cases:</b>
			<br/>Specify whether to allow cases to be considered as controls before the case event time.  We recommend not selecting this option to avoid bias.  Not selecting this option means a case is in the control risk set pool, and eligible to be matched to another case, up until their event time.
            <br/><br/>
            <b>Required R packages:</b> dplyr
`}
    }
}

class RiskSetMatching extends baseModal {
    constructor() {
        var config = {
            id: "RiskSetMatching",
            label: localization.en.title,
            modalType: "two",
            RCode: `
library(dplyr)

find.matches <- function(event, time.to.event, X, caliper = c(0, 5, 5), M=2, repeat.controls=F, super.controls=F){
  
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


prematch_data <- dplyr::select({{dataset.name}}, {{selected.groupvar | safe}}, {{selected.timevar | safe}}, {{selected.calipervars | safe}}{{selected.idvar | safe}}) %>%
	na.omit()

{{selected.newdatasetname | safe}} <- find.matches(event = {{selected.eventstr | safe}},
             time.to.event = {{selected.timestr | safe}},
             X = dplyr::select(prematch_data, {{selected.calipervars | safe}}),
             caliper = c({{selected.calipers | safe}}),
             M = {{selected.ratio | safe }},
             repeat.controls = {{selected.repeatcontrols | safe}},
             super.controls = {{selected.supercontrols | safe}})
			 
{{if (options.selected.idvar!="")}}
# need to add ID values if user specifies an ID variable

{{selected.newdatasetname | safe}}$ID <- {{selected.idstr | safe}}[{{selected.newdatasetname | safe}}$row]
{{/if}}

{{selected.newdatasetname | safe}} <- select({{selected.newdatasetname | safe}}, -row)
BSkyLoadRefresh("{{selected.newdatasetname | safe}}")

# number of observations, controls, and cases in matched data
num_obs <- nrow({{selected.newdatasetname | safe}})
num_controls <- table({{selected.newdatasetname | safe}}$failed)[1]
num_cases <- table({{selected.newdatasetname | safe}}$failed)[2]

num_obs_df <- data.frame(Number.Obs=num_obs, N.Controls=num_controls, N.Cases=num_cases)
rownames(num_obs_df) <- NULL
BSkyFormat(num_obs_df, singleTableOutputHeader="Matched Data Number of Observations, Controls, and Cases")
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
					width:"w-75",
					style: "mb-3"
				})
			},			
            groupvar: {
                el: new dstVariable(config, {
                    label: localization.en.groupvarlabel,
                    no: "groupvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },
            timevar: {
                el: new dstVariable(config, {
                    label: localization.en.timevarlabel,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },			
			calipervars: {
				el: new dstVariableList(config,{
					label: localization.en.calipervarslabel,
					no: "calipervars",
					required: true,
					filter:"Numeric|Date|Scale",
					extraction: "NoPrefix|UseComma"
				})
			},			
			calipers: {
				el: new input(config, {
					no: 'calipers',
					label: localization.en.caliperslabel,
					extraction: "TextAsIs",
					style: "ml-5 mb-3",
					allow_spaces: true,
					required: true,
					width: "w-100"
				})
			},
            idvar: {
                el: new dstVariable(config, {
                    label: localization.en.idvarlabel,
                    no: "idvar",
                    filter: "Numeric|Nominal|Ordinal|String|Scale",
                    extraction: "NoPrefix|UseComma",
					wrapped: ', %val%',
                    required: false
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
					style: "mt-5 mb-3",
					extraction: "NoPrefix|UseComma"
				})
			},
			repeatcontrols: {
				el: new checkbox(config, {
				label: localization.en.repeatcontrolslabel,
				no: "repeatcontrols",
				state: "checked",
				extraction: "Boolean"
				})
			},
			supercontrols: {
				el: new checkbox(config, {
				label: localization.en.supercontrolslabel,
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
				objects.idvar.el.content,
				objects.ratio.el.content,
				objects.repeatcontrols.el.content,
				objects.supercontrols.el.content
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
		let eventstr="prematch_data$" + code_vars.selected.groupvar;		
		let timestr="prematch_data$" + code_vars.selected.timevar;
		
		let idstr="prematch_data$" + code_vars.selected.idvar.slice(2);

		//create new variables under code_vars
		code_vars.selected.eventstr = eventstr
		code_vars.selected.timestr = timestr
		code_vars.selected.idstr = idstr
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
	
}
module.exports.item = new RiskSetMatching().render()