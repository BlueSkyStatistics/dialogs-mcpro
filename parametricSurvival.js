
var localization = {
    en: {
        title: "Parametric Survival Analysis",
        navigation: "Parametric Survival",
		
		//modelname:"Enter Model Name",
        
		timevar: "Time to event or censor",
        eventvar: "Event (1 or higher = event, 0 or lower = censor)",
		
		//destvars:"Independent Variables",
		//weightvar: "Weights (optional)",
		
		rmstChk: "Compute restricted mean survival time (RMST)",
		rmstSEChk: "Compute std error for RMST using bootstrap (note: it will take a while)",
		bootIter: "Bootstrap iteration",
        
		labelSurvival: "Survival Plot Type",
        survivalradioCI:"Survival with CI",
		survivalradio:"Survival",
		survivalradioKMCI:"Survival with Kaplan-Meier (nonparametric) overlay with CI",
		survivalradioKM:"Survival with Kaplan-Meier (nonparametric) overlay",
        
		labelFailure: "Cumulative Failure Plot type",
		inciradioCI: "Cumulative Failure with CI",
		inciradio: "Cumulative Failure",
		inciradioKMCI:"Cumulative Failure with Kaplan-Meier (nonparametric) overlay with CI",
		inciradioKM:"Cumulative Failure with Kaplan-Meier (nonparametric) overlay",
        
		//printallest: "Estimate Table Including All Times",
		//printspecest: "Estimate Table for Specific Times",
		
		spectimes: "Compute Survival Probability - specify times as time1, time2, time3, etc. or as seq (1,5,by=1)",
		specprobs: "Compute Survival Time to Event - specify quantile (probability) as 0.25, 0.50, 0.60, 0.75, etc. or as seq (0.2,0.9,by=0.1)",
		
		labelDistribution: "Select a distribution function that fits the data best",
		
		selectDistFuncWeibullRad: "Weibull",
		selectDistFuncExpRad: "Exponential",
		selectDistFuncGammaRad: "Gamma",
		selectDistFuncLnormalRad: "Log Normal",
		selectDistFuncPoissonRad: "Poisson",
		selectDistFuncNBinomRad: "Negative Binomial",
		selectDistFuncGeomRad: "Geometric",
		selectDistFuncBetaRad: "Beta",
		selectDistFuncUnifRad: "Uniform",
		selectDistFuncLogisRad: "Logistic", 
		selectDistFuncLogLogisRad: "Log Logistic",
		selectDistFuncCauchyRad: "Cauchy",
		selectDistFuncNormRad: "Normal",
		
		confidenceInterval: "Confidence intervals for maximum likelihood estimates",
		
        help: {
            title: "Parametric Survival Regression",
            r_help: "help(flexsurvreg, package = 'flexsurv')",
            body: `
			See sample dataset in the install directory, the default location is at drive letter:\\program files\\BlueSky Statistics\\10\\Samples_and_Documents\\Datasets_and_Demos\\Survival\\mockstudy_upd.RData. The variable Followup_time should be entered as the time to event or censor and the variable Event should be entered as the Event (1 = event, 0 = censor).<br/>
            <br/>
            <br/>
			The example datasets are lung, manufacturing_data, and bulb reliability <br/><br/>		
            <b>Parametric Survival Regression parameter estimates and plots along with Kaplan-Meier survival (null/intercept only model) curves overlay</b>
            <br/>
            <br/>
            These are used to estimate the cumulative risk of not having some event (or conversely, having some event) over a length of time after the start of follow-up for that event (or time zero).  Subjects need to be at risk for the event starting at time zero.
            <br/>
            <br/>
            <b>Time:</b> Length of time to either an event, if the event occurred, or last follow-up for that event, if the event did not occur, for each subject
            <br/><br/>
            <b>Event:</b> Numeric indicator of whether or not the event occurred (1=event, 0=censor) for each subject
            <br/><br/>
            <b>Plot Type:</b> Plot the probability of not having the event (survival) or having the event (failure)
            <br/><br/>
           <br/>
            <br/>
			<b>Estimate Table for Specific Times or probability:</b> Option to include a table that has the survival estimate probabilities for a user-selected set of times.
			<br/><br/>
			<b>Specify times as time1, time2, time3, etc. or as seq(1,5,by=1):</b> These are the specific times that will be included in the table for specific times.  They can be specified individually with commas, or as a sequence of evenly-spaced values.
			<br/><br/>
            Tables are output with the sample size, the number of subjects with the event, the median survival time (if defined), the restricted mean survival time, and the median follow-up time.  The median follow-up time is computed using the reverse Kaplan-Meier estimator, which treats true events as censored observations and true censored observations as events.  Thus, the "event" in this estimator is "following the subjects for as long as the study could".
            <br/>
            A table of Parametric Survival and event estimates for the distribution chosen is provided at each observed time in the dataset, with given confidence intervals. 
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>           
            <b>Style Options</b>
            <br/>
            <br/>
            <b>Plot Title:</b> Title of the plot; delete all text for no title
            <br/><br/>
			<b>Plot Title Size:</b> Size of the plot title.
			<br/><br/>
            <b>Plot Theme:</b> General style of the plot
            <br/><br/>
            <b>Include Number at Risk:</b> Optionally, include a table for the number of subjects still at risk over time at the bottom of the plot.  <b>Risk Table Position</b> specifies whether you want the table outside the axes or inside the axes.  The <b>Risk Table Height</b> controls the proportion of the plotting area that the table will take up.  This option is ignored when the risk table position is inside the axes. 
			The <b>Risk Table Value Size</b> controls the size of the numbers at risk. The <b>Risk Table Title Size</b> controls the size of the title for the number at risk table.
			The <b>Risk Table Axis Label Size</b> controls the size of the axis labels.
			The <b>Risk Table Tick Label Size</b> controls the size of the tick mark labels for the times in the number at risk table. If it's desired to remove all axes and gridlines 
			from the number at risk table, the <b>Remove Axes and Gridlines from Risk Table</b> option can be checked.  This will only include the numbers at risk in the table.
            <br/>
            <br/>
            <b>Line Options:</b>
            <b>Size</b> controls the thickness and <b>Color</b> controls the color of the plotted line.  One can optionally include a 95% confidence interval for the estimates in either a <b>ribbon</b> (shaded area) or <b>step</b> (line) format.  <b>Transparency</b> controls how dark the ribbon is and is ignored when the step option is selected.  <b>Censored Times</b> (when subjects become no longer at risk for the event) can be indicated on the line with "+" symbols.  The size of the "+" symbols can be adjusted.  The <b>Indicate Median Survival</b> option will include horizontal or vertical lines at the time when 50% of the subjects are estimated to have had the event.  The median time is undefined if the survival curve does not cross 50%.
            <br/>
            <br/>
            <br/>   
            <b>Axis Options</b>
            <br/> 
            <br/> 
            The <b>Label</b> option specifies the text label for the axis.  The <b>Axis Limits</b> specifies the minimum and maximum values of the axis.  The <b>Tick Mark Increments</b> option controls the spacing of the tick marks on the axis.  The increments on the time axis also control the times for the optional number at risk table.
            <br/> 
            The survival axis <b>Scale</b> option specifies whether you want the estimates to be on a proportion (0-1) or percent (0-100) scale.
			<br/><br/>
			<b>Axis Label Size:</b>  This controls the size of both the survival and time axis label sizes.
			<br/><br/>
			<b>Axis Tick Mark Label Size:</b>  This controls the size of both the survival and time axis tick mark label sizes.
`}
    }
}

class parametricSurvival extends baseModal {
    constructor() {
        var config = {
            id: "parametricSurvival",
            label: localization.en.title,
            modalType: "two",
            RCode:`
require(survival)
require(flexsurv)
require(boot)
require(dplyr)


{{if(options.selected.rmstChk ==="TRUE")}}
	# Define a function to compute the RMST from a flexsurvreg model
	compute_rmst <- function(data, indices) {
	# Sample data with replacement
	boot_data = data[indices, ]
	  
	# Fit the model to the bootstrap sample
	fit = flexsurvreg(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, data = boot_data, dist = "{{selected.gpbox1 | safe}}")
	  
	# Calculate RMST up to the specified follow-up time
	max_followup = max(data\${{selected.timevar | safe}})  # or use a desired fixed time
	rmst_value = summary(fit, type = "rmst", t = max_followup)[[1]]$est
	  
	return(rmst_value)
	}
{{/if}}

BSkyFormat(paste("Distribution function {{selected.gpbox1 | safe}} chosen to compute the survival/failure analysis"))

bsky_temp_df = NULL 
bsky_temp_df = with({{dataset.name}}, data.frame({{selected.timevar | safe}},{{selected.eventvar | safe}}))
bsky_temp_df = stats::na.omit(bsky_temp_df)

# Fit a model with {{selected.gpbox1 | safe}} distribution (null model or an intercept-only model i.e. model with no covariates)
bsky_{{selected.gpbox1 | safe}}_fit = flexsurvreg(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, cl = {{selected.confidenceInterval | safe}}, data = bsky_temp_df, dist = "{{selected.gpbox1 | safe}}")
BSkyFormat(as.data.frame(bsky_{{selected.gpbox1 | safe}}_fit$res), outputTableRenames = "{{selected.gpbox1 | safe}} distribution parameters")

bsky_data_overview = data.frame(
	N = bsky_{{selected.gpbox1 | safe}}_fit$N,
	Events = bsky_{{selected.gpbox1 | safe}}_fit$events,
	Censored = bsky_{{selected.gpbox1 | safe}}_fit$N - bsky_{{selected.gpbox1 | safe}}_fit$events,
	AIC =  bsky_{{selected.gpbox1 | safe}}_fit$AIC,
	Loglik = bsky_{{selected.gpbox1 | safe}}_fit$loglik,                        
	Confint = paste0(round((bsky_{{selected.gpbox1 | safe}}_fit$cl*100),2),"%"))
BSkyFormat(bsky_data_overview, outputTableRenames = "Overview of the model and the selected variables {{selected.timevar | safe}}, {{selected.eventvar | safe}}")

bsky_CI_names = c(paste0("L",round(c({{selected.confidenceInterval | safe}})*100, 2),"%"), paste0("U",round(c({{selected.confidenceInterval | safe}})*100, 2),"%"))

{{if(options.selected.rmstChk ==="TRUE")}}
	# Filter the data to only include censored observations
	censored_times = bsky_temp_df\${{selected.timevar | safe}}[bsky_temp_df\${{selected.eventvar | safe}} == min(bsky_temp_df\${{selected.eventvar | safe}})]
	# Calculate the median follow-up time
	median_follow_up = median(censored_times, na.rm = TRUE)

	median_summary = summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "quantile", quantiles = 0.5)
	
	# Extract the RMST estimate and standard error
	rmean <- summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "rmst", t = max(bsky_temp_df\${{selected.timevar | safe}}))[[1]]$est
	
	{{if(options.selected.rmstSEChk ==="TRUE")}}
		#Perform bootstrapping to compute standard error for rmean
		# R = number of bootstrap samples
		set.seed(123)  # for reproducibility
		bootstrap_results = boot(data = bsky_temp_df, statistic = compute_rmst, R = {{selected.bootIter | safe}})
		rmean_std_error <- sd(bootstrap_results$t)
	{{/if}}
	
	bsky_rmean_df = cbind(data.frame(rmean{{if(options.selected.rmstSEChk ==="TRUE")}},rmean_std_error{{/if}}), as.data.frame(median_summary)[,c(2:4)],median_follow_up)
	names(bsky_rmean_df) = c("Rmean", {{if(options.selected.rmstSEChk ==="TRUE")}}"Rmean.std.err",{{/if}}"Median", bsky_CI_names,"Median Follow_up")
	BSkyFormat(bsky_rmean_df, outputTableRenames = "Restricted Mean and Median Survival Time")
{{/if}}

{{if(options.selected.spectimes !="")}}
	# Survival probability at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_surv_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = c(), t = c({{selected.spectimes | safe}}), type = "survival")

	#cat("{{selected.gpbox1 | safe}} Survival Probability at time", c({{selected.spectimes | safe}}), ":", bsky_surv_{{selected.gpbox1 | safe}}, "\\n")

	# Failure probability (1 - Survival) at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_fail_{{selected.gpbox1 | safe}} = 1 - bsky_surv_{{selected.gpbox1 | safe}}[[1]]$est
	
	#cat("{{selected.gpbox1 | safe}} Failure Probability at time", c({{selected.spectimes | safe}}), ":", bsky_fail_{{selected.gpbox1 | safe}}, "\\n")

	# Cumulative hazard at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_cumhaz_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = c(), t = c({{selected.spectimes | safe}}), type = "cumhaz")
	
	#cat("{{selected.gpbox1 | safe}} Cumulative Hazard at time", c({{selected.spectimes | safe}}), ":", bsky_cumhaz_{{selected.gpbox1 | safe}}, "\\n")
	
	
	#bsky_time_df = data.frame(Time = c({{selected.spectimes | safe}}), Survival = bsky_surv_{{selected.gpbox1 | safe}}[[1]]$est, Failure = bsky_fail_{{selected.gpbox1 | safe}}, Cumulative_failure = bsky_cumhaz_{{selected.gpbox1 | safe}}[[1]]$est)
	#BSkyFormat(bsky_time_df, outputTableRenames = "Probability at specified time")

	# Calculate the Z value
	#bsky_Z <- qnorm(1 - (1 - {{selected.confidenceInterval | safe}}) / 2)
	
	bsky_time_df = as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})
	names(bsky_time_df) = c("Time", "Survival", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Survival Probability at specified time")
	
	#bsky_time_df = data.frame(Time = c({{selected.spectimes | safe}}), Survival_prob = bsky_surv_{{selected.gpbox1 | safe}}, Failure_prob = bsky_fail_{{selected.gpbox1 | safe}}, Cumulative_failure = bsky_cumhaz_{{selected.gpbox1 | safe}})
	bsky_time_df = cbind(as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})[,1], 1 - as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})[2:4])
	names(bsky_time_df) = c("Time", "Failure", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Failure Probability at specified time")
	
	bsky_time_df = as.data.frame(bsky_cumhaz_{{selected.gpbox1 | safe}})
	names(bsky_time_df) = c("Time", "Cumulative_hazards", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Cumulative Hazards at specified time")
{{/if}}


{{if(options.selected.specprobs !="")}}
	# Survival probability at ({{selected.specprobs | safe}} time for {{selected.gpbox1 | safe}} distribution
	bsky_time_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = c(), quantiles  = c({{selected.specprobs | safe}}), type = "quantile")
	
	#cat("{{selected.gpbox1 | safe}} time estimate for survival probability of", c({{selected.specprobs | safe}}), ":", bsky_time_{{selected.gpbox1 | safe}}, "\\n")
	
	#bsky_prob_df = data.frame(Prob = c({{selected.specprobs | safe}}), Survival_time = bsky_time_{{selected.gpbox1 | safe}})
	bsky_prob_df = data.frame(bsky_time_{{selected.gpbox1 | safe}}) 
	names(bsky_prob_df) = c("Quantile", "Survival Time", bsky_CI_names)
	BSkyFormat(bsky_prob_df, outputTableRenames = "Survival Time to Event at specified quantile")
{{/if}}
	
	# Define a sequence of time points for prediction
	time_points <- seq(0, max(bsky_temp_df\${{selected.timevar | safe}}), by = 10)

	# Get survival predictions
	bsky_surv_pred <- summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "survival", t = time_points)
	bsky_cumhaz_pred <- summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "cumhaz", t = time_points)

	# Convert to data frames
	bsky_surv_df <- data.frame(
	  time = time_points,
	  {{if(options.selected.survivalPlottypegroup ==="survivalCI" || options.selected.survivalPlottypegroup ==="survivalKMCI")}}
	  lower_ci = sapply(bsky_surv_pred, function(x) x$lcl),
	  upper_ci = sapply(bsky_surv_pred, function(x) x$ucl),
	  {{/if}}
	  survival = sapply(bsky_surv_pred, function(x) x$est)
	)

	bsky_failure_df <- data.frame(
	  time = time_points,
	  {{if(options.selected.falurePlottypegroup ==="inciCI" || options.selected.falurePlottypegroup ==="inciKMCI")}}
	  lower_ci = 1- sapply(bsky_surv_pred, function(x) x$lcl),
	  upper_ci = 1- sapply(bsky_surv_pred, function(x) x$ucl),
	  {{/if}}
	  failure = 1- sapply(bsky_surv_pred, function(x) x$est)
	)
	
	bsky_cumhaz_df <- data.frame(
	  time = time_points,
	  {{if(options.selected.falurePlottypegroup ==="inciCI" || options.selected.falurePlottypegroup ==="inciKMCI")}}
	  lower_ci = sapply(bsky_cumhaz_pred, function(x) x$lcl),
	  upper_ci = sapply(bsky_cumhaz_pred, function(x) x$ucl),
	  {{/if}}
	  cumhaz = sapply(bsky_cumhaz_pred, function(x) x$est)
	)

	{{if(options.selected.survivalPlottypegroup !=="survivalKM" && options.selected.survivalPlottypegroup !=="survivalKMCI")}}
	# Plot survival curve using ggplot2
	ggplot(bsky_surv_df, aes(x = time, y = survival)) +
	  geom_line(color = "blue", linewidth = 1) +
	  {{if(options.selected.survivalPlottypegroup ==="survivalCI")}}
	  geom_ribbon(aes(ymin = lower_ci, ymax = upper_ci), fill = "blue", alpha = 0.2) +
	  {{/if}}
	  labs(title = "Parametric Survival Curve ({{selected.gpbox1 | safe}})", x = "Time", y = "Survival Probability") +
	  {{selected.BSkyThemes | safe}}
	{{#else}}
		# Fit a Kaplan-Meier model
		bsky_km_fit <- survfit(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, {{if(options.selected.survivalPlottypegroup ==="inciKM")}} se.fit = FALSE, {{/if}}conf.int = {{selected.confidenceInterval | safe}}, data = bsky_temp_df)
		
		# Convert Kaplan-Meier predictions to a data frame
		bsky_km_df <- data.frame(
		  time = bsky_km_fit$time,
		  {{if(options.selected.survivalPlottypegroup ==="survivalKMCI")}}
		  lower_ci = bsky_km_fit$lower,
		  upper_ci = bsky_km_fit$upper,
		  {{/if}}
		  survival = bsky_km_fit$surv
		)
		
		bsky_surv_df$Type = "Parametric ({{selected.gpbox1 | safe}})"
		bsky_km_df$Type = "Kaplan-Meier"
		bsky_combined_surv_km_df <- rbind(
		  bsky_surv_df,
		  bsky_km_df
		)

		# Plot parametric survival curve with Kaplan-Meier overlay
		ggplot() +
		  # Plot parametric survival curve with confidence intervals
		  geom_line(data = bsky_combined_surv_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, y = survival, color = Type), linewidth = 1) +
		  {{if(options.selected.survivalPlottypegroup ==="survivalKMCI")}}
		  geom_ribbon(data = bsky_combined_surv_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		  # Plot Kaplan-Meier curve with confidence intervals
		  geom_step(data = bsky_combined_surv_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, y = survival, color = Type),linewidth = 1) +
		  {{if(options.selected.survivalPlottypegroup ==="survivalKMCI")}}
		  geom_ribbon(data = bsky_combined_surv_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		  
		  # In-plot caption
		  #annotate("text", x = max(time_points) * 0.8, y = 0.95, 
			#label = "Blue: Parametric ({{selected.gpbox1 | safe}})\n #Red: Kaplan-Meier", 
			#color = "black", size = 4, hjust = 0) +
		   
		  # Manual color and fill scales
			scale_color_manual(values = c("red", "blue")) +
			scale_fill_manual(values = c("red", "blue")) +
		   
		  # Labels and theme
		  labs(title = paste0("Survival Curve ({{selected.gpbox1 | safe}}): Parametric Model vs. Kaplan-Meier (", round(c({{selected.confidenceInterval | safe}})*100,2),"% ","CI)"), 
				x = "Time", 
				y = "Survival Probability",
				color = "Legend", # Legend for lines
				fill = "Legend"   # Legend for ribbons
			   ) +
		  {{selected.BSkyThemes | safe}} + 
		  theme(
			text = element_text(
			  family = "sans",
			  face = "plain",
			  color = "#000000",
			  size = 12,
			  hjust = 0.5,
			  vjust = 0.5
			),
			#plot.title = element_text(hjust = 0.5, size = 18),
			legend.position = "inside",
			legend.position.inside = c(0.85, 0.85), # Top-right corner
			legend.background = element_blank(), #element_rect(fill = "white", color = "black"), # Optional: Legend box
			legend.title = element_text(size = 12, face = "bold"),
			legend.key = element_blank() #element_rect(fill = NA)
			)
	{{/if}}
	
	
	{{if(options.selected.falurePlottypegroup !=="inciKM" && options.selected.falurePlottypegroup !=="inciKMCI")}}
	ggplot(bsky_failure_df, aes(x = time, y = failure)) +
	  geom_line(color = "blue", linewidth = 1) +
	  {{if(options.selected.falurePlottypegroup ==="inciCI")}}
	  geom_ribbon(aes(ymin = lower_ci, ymax = upper_ci), fill = "blue", alpha = 0.2) +
	  {{/if}}
	  labs(title = "Parametric Failure Curve ({{selected.gpbox1 | safe}})", x = "Time", y = "Failure Probability") +
	  {{selected.BSkyThemes | safe}}
	  
	  # Plot cumulative hazard curve using ggplot2
	ggplot(bsky_cumhaz_df, aes(x = time, y = cumhaz)) +
	  geom_line(color = "blue", linewidth = 1) +
	  {{if(options.selected.falurePlottypegroup ==="inciCI")}}
	  geom_ribbon(aes(ymin = lower_ci, ymax = upper_ci), fill = "blue", alpha = 0.2) +
	  {{/if}}
	  labs(title = "Parametric Cumulative Hazards Curve ({{selected.gpbox1 | safe}})", x = "Time", y = "Cumulative Hazards") +
	  {{selected.BSkyThemes | safe}}
	{{#else}}
	# Fit a Kaplan-Meier model (null model or an intercept-only model i.e. model with no covariates)
		bsky_km_fit <- survfit(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, {{if(options.selected.falurePlottypegroup ==="inciKM")}} se.fit = FALSE, {{/if}} conf.int = {{selected.confidenceInterval | safe}}, data = bsky_temp_df)
		
		# Convert Kaplan-Meier cumulative failure to a data frame
		bsy_km_fail_df <- data.frame(
		  time = bsky_km_fit$time,
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  lower_ci = 1 - (bsky_km_fit$upper),
		  upper_ci = 1 - (bsky_km_fit$lower),
		  {{/if}}
		  failure = 1 - (bsky_km_fit$surv)
		)
		
		# Convert Kaplan-Meier cumulative hazards to a data frame
		bsy_km_cumhaz_df <- data.frame(
		  time = bsky_km_fit$time,
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  lower_ci = -log(bsky_km_fit$upper),
		  upper_ci = -log(bsky_km_fit$lower),
		  {{/if}}
		  cumhaz = -log(bsky_km_fit$surv)
		)
		
		bsky_failure_df$Type = "Parametric ({{selected.gpbox1 | safe}})"
		bsy_km_fail_df$Type = "Kaplan-Meier"
		bsky_combined_fail_km_df <- rbind(
		  bsky_failure_df,
		  bsy_km_fail_df
		)
		
		ggplot() +
		 # Plot parametric failure curve with confidence intervals
		  geom_line(data = bsky_combined_fail_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, y = failure, color = Type), linewidth = 1) +
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  geom_ribbon(data = bsky_combined_fail_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		  # Plot Kaplan-Meier curve with confidence intervals
		  geom_step(data = bsky_combined_fail_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, y = failure, color = Type),linewidth = 1) +
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  geom_ribbon(data = bsky_combined_fail_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		   
		  # Manual color and fill scales
			scale_color_manual(values = c("red", "blue")) +
			scale_fill_manual(values = c("red", "blue")) +
		   
		 # Labels and theme
		  labs(title = paste0("Failure Curve ({{selected.gpbox1 | safe}}): Parametric Model vs. Kaplan-Meier (", round(c({{selected.confidenceInterval | safe}})*100,2),"% ", "CI)"), 
				x = "Time", 
				y = "Failure",
				color = "Legend", # Legend for lines
				fill = "Legend"   # Legend for ribbons
			   ) +
		  {{selected.BSkyThemes | safe}} + 
		  theme(
			text = element_text(
			  family = "sans",
			  face = "plain",
			  color = "#000000",
			  size = 12,
			  hjust = 0.5,
			  vjust = 0.5
			),
			#plot.title = element_text(hjust = 0.5, size = 18),
			legend.position.inside = c(0.15, 0.85), # Top-right corner
			legend.background = element_blank(), #element_rect(fill = "white", color = "black"), # Optional: Legend box
			legend.title = element_text(size = 12, face = "bold"),
			legend.key = element_blank() #element_rect(fill = NA)
			)
		
			bsky_cumhaz_df$Type = "Parametric ({{selected.gpbox1 | safe}})"
			bsy_km_cumhaz_df$Type = "Kaplan-Meier"
			bsky_combined_cumhaz_km_df <- rbind(
			  bsky_cumhaz_df,
			  bsy_km_cumhaz_df
			)
		
		
		ggplot() +
		 # Plot parametric failure curve with confidence intervals
		  geom_line(data = bsky_combined_cumhaz_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, y = cumhaz, color = Type), linewidth = 1) +
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  geom_ribbon(data = bsky_combined_cumhaz_km_df %>% filter(Type == "Parametric ({{selected.gpbox1 | safe}})"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		  # Plot Kaplan-Meier curve with confidence intervals
		  geom_step(data = bsky_combined_cumhaz_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, y = cumhaz, color = Type),linewidth = 1) +
		  {{if(options.selected.falurePlottypegroup ==="inciKMCI")}}
		  geom_ribbon(data = bsky_combined_cumhaz_km_df %>% filter(Type == "Kaplan-Meier"), aes(x = time, ymin = lower_ci, ymax = upper_ci, fill = Type), alpha = 0.2) +
		  {{/if}}
		   
		  # Manual color and fill scales
			scale_color_manual(values = c("red", "blue")) +
			scale_fill_manual(values = c("red", "blue")) +
		   
		 # Labels and theme
		  labs(title = paste0("Cumulative Hazards Curve ({{selected.gpbox1 | safe}}): Parametric Model vs. Kaplan-Meier (", round(c({{selected.confidenceInterval | safe}})*100,2),"% ", "CI)"), 
			   x = "Time", 
			   y = "Cumulative Hazards",
				color = "Legend", # Legend for lines
				fill = "Legend"   # Legend for ribbons
			   ) +
		  {{selected.BSkyThemes | safe}} + 
		  theme(
			text = element_text(
			  family = "sans",
			  face = "plain",
			  color = "#000000",
			  size = 12,
			  hjust = 0.5,
			  vjust = 0.5
			),
			#plot.title = element_text(hjust = 0.5, size = 18),
			legend.position.inside = c(0.15, 0.85), # Top-right corner
			legend.background = element_blank(), #element_rect(fill = "white", color = "black"), # Optional: Legend box
			legend.title = element_text(size = 12, face = "bold"),
			legend.key = element_blank() #element_rect(fill = NA)
			)
	{{/if}}
	
	rm(bsky_{{selected.gpbox1 | safe}}_fit)
	if(exists('bsky_km_fit'))rm(bsky_km_fit)
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			/*
			modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
                    placeholder: "CoxRegModel1",
                    //required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1",
					style: "mb-3"
                })
            },  
			*/
            timevar: {
                el: new dstVariable(config, {
                    label: localization.en.timevar,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvar,
                    no: "eventvar",
                    //filter: "Numeric|Scale|",
					filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			/*
			destvars: {
                el: new dstVariableList(config, {
                    label: localization.en.destvars,
                    no: "destvars",
                    //required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus"
                }), r: ['{{ var | safe}}']
            }, 
            weightvar: {
                el: new dstVariable(config, {
                    label: localization.en.weightvar,
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
                    wrapped: 'weights=%val%,'  
                }), r: ['{{ var | safe}}']
            },  
			*/
			rmstChk: {
                el: new checkbox(config, {
                    label: localization.en.rmstChk, 
					no: "rmstChk",
                    bs_type: "valuebox",
                    //style: "mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "Checked",
					newline: true,
                })
            },
			rmstSEChk: {
                el: new checkbox(config, {
                    label: localization.en.rmstSEChk, 
					no: "rmstSEChk",
                    bs_type: "valuebox",
                    style: "ml-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "Checked",
					newline: true,
                })
            },
			bootIter: {
                el: new input(config, {
                    no: 'bootIter',
                    label: localization.en.bootIter,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					filter: "numeric",
					style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "100",
                })
            },
		
            labelSurvival: { el: new labelVar(config, { label: localization.en.labelSurvival, style: "mt-2", h: 6 }) },
            
			survivalradioCI: {
                el: new radioButton(config, {
                    label: localization.en.survivalradioCI,
                    no: "survivalPlottypegroup",
                    increment: "survivalradioCI",
                    //syntax: "NULL",
					value:"survivalCI",
                    state: "checked",
                    extraction: "ValueAsIs",
                })
            },
			survivalradio: {
                el: new radioButton(config, {
                    label: localization.en.survivalradio,
                    no: "survivalPlottypegroup",
                    increment: "survivalradio",
					value: "survival",
                    //syntax: "NULL",
                    state: "",
                    extraction: "ValueAsIs",
                })
            },
			survivalradioKMCI: {
                el: new radioButton(config, {
                    label: localization.en.survivalradioKMCI,
                    no: "survivalPlottypegroup",
                    increment: "survivalradioKMCI",
					value: "survivalKMCI",
                    //syntax: "NULL",
                    state: "",
                    extraction: "ValueAsIs",
                })
            },
			survivalradioKM: {
                el: new radioButton(config, {
                    label: localization.en.survivalradioKM,
                    no: "survivalPlottypegroup",
                    increment: "survivalradioKM",
					value: "survivalKM",
                    //syntax: "NULL",
                    state: "",
                    extraction: "ValueAsIs",
                })
            },
			
			labelFailure: { el: new labelVar(config, { label: localization.en.labelFailure, style: "mt-2", h: 6 }) },
            
            inciradioCI: {
                el: new radioButton(config, {
                    label: localization.en.inciradioCI,
                    no: "falurePlottypegroup",
                    increment: "inciradioCI",
					value: "inciCI",
                    //syntax: "'event'",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            }, 
			inciradio: {
                el: new radioButton(config, {
                    label: localization.en.inciradio,
                    no: "falurePlottypegroup",
                    increment: "inciradio",
					value: "inci",
                    //syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
			inciradioKMCI: {
                el: new radioButton(config, {
                    label: localization.en.inciradioKMCI,
                    no: "falurePlottypegroup",
                    increment: "inciradioKMCI",
					value: "inciKMCI",
                    //syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
			inciradioKM: {
                el: new radioButton(config, {
                    label: localization.en.inciradioKM,
                    no: "falurePlottypegroup",
                    increment: "inciradioKM",
					value: "inciKM",
                    //syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
			
			/*
            printallest: {
                el: new checkbox(config, {
                    label: localization.en.printallest,
                    no: "printallest",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: localization.en.printspecest,
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },
			*/
            spectimes: { 
                el: new input(config, {
                    no: 'spectimes',
                    label: localization.en.spectimes,
					//style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },	
			specprobs: { 
                el: new input(config, {
                    no: 'specprobs',
                    label: localization.en.specprobs,
					//style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },	
			
			labelDistribution: { el: new labelVar(config, { label: localization.en.labelDistribution, style: "mt-2", h: 6 }) },
			
			selectDistFuncCauchyRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncCauchyRad,
                    no: "gpbox1",
                    increment: "selectDistFuncCauchyRad",
                    value: "cauchy",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncLogisRad: { 
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncLogisRad,
                    no: "gpbox1",
                    increment: "selectDistFuncLogisRad",
                    value: "logis", 
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncLogLogisRad: { 
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncLogLogisRad,
                    no: "gpbox1",
                    increment: "selectDistFuncLogLogisRad",
                    value: "llogis", 
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncUnifRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncUnifRad,
                    no: "gpbox1",
                    increment: "selectDistFuncUnifRad",
                    value: "unif",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncBetaRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncBetaRad,
                    no: "gpbox1",
                    increment: "selectDistFuncBetaRad",
                    value: "beta",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncGeomRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncGeomRad,
                    no: "gpbox1",
                    increment: "selectDistFuncGeomRad",
                    value: "geom",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncNBinomRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncNBinomRad,
                    no: "gpbox1",
                    increment: "selectDistFuncNBinomRad",
                    value: "nbinom",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncGammaRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncGammaRad,
                    no: "gpbox1",
                    increment: "selectDistFuncGammaRad",
                    value: "gamma",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncExpRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncExpRad,
                    no: "gpbox1",
                    increment: "selectDistFuncExpRad",
                    value: "exp",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncPoissonRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncPoissonRad,
                    no: "gpbox1",
                    increment: "selectDistFuncPoissonRad",
                    value: "pois",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncLnormalRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncLnormalRad,
                    no: "gpbox1",
                    increment: "selectDistFuncLnormalRad",
                    value: "lnorm",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncWeibullRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncWeibullRad,
                    no: "gpbox1",
                    increment: "selectDistFuncWeibullRad",
                    value: "weibull",
                    state: "checked",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			selectDistFuncNormRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDistFuncNormRad,
                    no: "gpbox1",
                    increment: "selectDistFuncNormRad",
                    value: "norm",
                    state: "checked",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			
			confidenceInterval: {
                el: new input(config, {
                    no: 'confidenceInterval',
                    label: localization.en.confidenceInterval,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					filter: "numeric",
					style: "mb-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.95",
                })
            },
		
            /* titlebox: {
                el: new input(config, {
                    no: 'titlebox',
                    label: localization.en.titlebox,
                    placeholder: "Kaplan-Meier Estimates",
                    extraction: "TextAsIs",
                    value: "Kaplan-Meier Estimates",
                    allow_spaces:true,
                    type: "character",
                })
            },
			plottitlesize: {
				el: new inputSpinner(config,{
				no: 'plottitlesize',
				label: localization.en.plottitlesizelabel,
				style: "mt-3",
				min: 5,
				max: 50,
				step: 1,
				value: 20,
				extraction: "NoPrefix|UseComma"
				})
			},			
            themedropdown: {
                el: new comboBox(config, {
                    no: 'themedropdown',
                    label: localization.en.themedropdown,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["theme_base()", "theme_bw()", "theme_calc()",
                    "theme_classic()", "theme_clean()", "theme_cleantable()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()","theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_survminer()", "theme_tufte()",
                    "theme_wsj()"],
                    default: "theme_survminer()"
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style:"mt-3", h: 5 }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: localization.en.natriskchkbox,
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: localization.en.risktableprop,
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.25,
                    extraction: "NoPrefix|UseComma",
                    style: "ml-3 mt-3"
                })
            },   
            risktablepos: {
                el: new comboBox(config, {
                    no: 'risktablepos',
                    label: localization.en.risktablepos,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["out", "in"],
                    default: "out",
                    style:"ml-3"
                })
            },                      
			risktablevaluesize: {
				el: new inputSpinner(config,{
				no: 'risktablevaluesize',
				label: localization.en.risktablevaluesize,
				style: "mt-3 ml-1",
				min: 1,
				max: 15,
				step: 0.5,
				value: 4.5,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktabletitlesize: {
				el: new inputSpinner(config,{
				no: 'risktabletitlesize',
				label: localization.en.risktabletitlesize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktableaxislabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableaxislabelsize',
				label: localization.en.risktableaxislabelsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},			
			risktableticklabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableticklabelsize',
				label: localization.en.risktableticklabelsize,
				style: "ml-1 mb-3",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            risktableclean: {
                el: new checkbox(config, {
                    label: localization.en.risktableclean,
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-3 mb-3"
                })
            }, 			
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: localization.en.linesize,
                    min: 0,
                    max: 5,
                    step: 0.5,
                    value: 1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-3"
                })
            },             
            linecolor: {
                el: new comboBox(config, {
                    no: 'linecolor',
                    label: localization.en.linecolor,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["black", "blue", "red", "green", "purple", "cyan", "magenta"],
                    default: "black",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: localization.en.label4, style:"ml-3 mt-3", h: 5 }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: localization.en.cichkbox,
                    no: "cichkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-5"
                })
            },            
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: localization.en.cistyle,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["ribbon", "step"],
                    default: "ribbon",
                    style:"ml-5"
                })
            },
            citransparency: {
                el: new advancedSlider(config, {
                    no: "citransparency",
                    label: localization.en.citransparency,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            },   
            label5: { el: new labelVar(config, { label: localization.en.label5, style:"ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: localization.en.censorchkbox,
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: localization.en.censorsize,
                    min: 0,
                    max: 10,
                    step: 0.05,
                    value: 4.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            }, 
            medsurvivalline: {
                el: new comboBox(config, {
                    no: 'medsurvivalline',
                    label: localization.en.medsurvivalline,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "hv", "h", "v"],
                    default: "none",
                    style:"ml-3"
                })
            }, 
            
            label6: { el: new labelVar(config, { label: localization.en.label6, h: 5 }) },
            survaxislabel: {
                el: new input(config, {
                    no: 'survaxislabel',
                    label: localization.en.survaxislabel,
                    placeholder: "Probability",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Probability",
                    allow_spaces:true,
                    type: "character",
                })
            },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: localization.en.axislabelsize,
				style: "mt-5",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},            
            label7: { el: new labelVar(config, { label: localization.en.label7, style: "mt-3 ml-4", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: localization.en.defbutton,
                    no: "scalebox",
                    increment: "defbutton",
                    syntax: "default",
                    state: "checked",
                    extraction: "ValueAsIs",
                    style:"ml-4"
                })
            },
            pctbutton: {
                el: new radioButton(config, {
                    label: localization.en.pctbutton,
                    no: "scalebox",
                    increment: "pctbutton",
                    syntax: "percent",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-4"
                })
            },   
            survaxislimits: {
                el: new input(config, {
                    no: 'survaxislimits',
                    label: localization.en.survaxislimits,
                    placeholder: "c(0,1)",
                    style:"ml-4 mt-3",
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "c(0,1)",
                    allow_spaces:true,
                    Type: "character"
                })
            }, 
            survtickinc: {
                el: new advancedSlider(config, {
                    no: "survtickinc",
                    label: localization.en.survtickinc,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4 mt-3"
                })
            }, 
            label8: { el: new labelVar(config, { label: localization.en.label8, h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: localization.en.timeaxislabel,
                    placeholder: "Time",
                    style:"ml-4 mt-3",
                    extraction: "TextAsIs",
                    value: "Time",
                    allow_spaces:true,
                    type: "character",
                })
            }, 
            timeaxislimits: {
                el: new input(config, {
                    no: 'timeaxislimits',
                    label: localization.en.timeaxislimits,
                    placeholder: "NULL",
					required: true,
                    style:"ml-4 mt-3",
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    Type: "character"
                })
            }, 
            timetickinc: {
                el: new input(config, {
                    no: 'timetickinc',
                    label: localization.en.timetickinc,
                    placeholder: "NULL",
					required: true,
                    style:"ml-4 mt-3",
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    Type: "character"
                })
            },
			ticklabelsize: {
				el: new inputSpinner(config,{
				no: 'ticklabelsize',
				label: localization.en.ticklabelsize,
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            label12: {
                el: new labelVar(config, {
                  label: localization.en.label12, 
                  style: "mt-3", 
                  h:5
                })
              },  	 */		

        }
		
        /* var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: localization.en.styleoptions,
                content: [
                    objects.titlebox.el,
					objects.plottitlesize.el,
                    objects.themedropdown.el,
                    objects.label2.el,
                    objects.natriskchkbox.el,
                    objects.risktableprop.el,
                    objects.risktablepos.el,
					objects.risktablevaluesize.el,
					objects.risktabletitlesize.el,
					objects.risktableaxislabelsize.el,
					objects.risktableticklabelsize.el,
					objects.risktableclean.el,
                    objects.label3.el,
                    objects.linesize.el,
                    objects.linecolor.el,
                    objects.label4.el,
                    objects.cichkbox.el,
                    objects.cistyle.el,
                    objects.citransparency.el,
                    objects.label5.el,
                    objects.censorchkbox.el,
                    objects.censorsize.el,
                    objects.medsurvivalline.el,


                ]
            })
        };
        var axisoptions = {
            el: new optionsVar(config, {
                no: "axisoptions",
                name: localization.en.axisoptions,
                content: [
                    objects.label6.el,
                    objects.survaxislabel.el,
                    objects.label7.el,
                    objects.defbutton.el,
                    objects.pctbutton.el,
                    objects.survaxislimits.el,
                    objects.survtickinc.el,
                    objects.label8.el,
                    objects.timeaxislabel.el,
                    objects.timeaxislimits.el,
                    objects.timetickinc.el,
					objects.axislabelsize.el,
					objects.ticklabelsize.el

                ]
            })
        };    */     
        const content = {
			//head: [objects.label12.el.content],
            left: [objects.content_var.el.content],
            right: [
			//objects.modelname.el.content,
			objects.timevar.el.content,
            objects.eventvar.el.content, 
			
			//objects.destvars.el.content, 
			//objects.weightvar.el.content, 
			
			objects.rmstChk.el.content, 
			objects.rmstSEChk.el.content,
			objects.bootIter.el.content,
            
			//objects.printallest.el.content,
			//objects.printspecest.el.content,
			
			objects.spectimes.el.content, 
			objects.specprobs.el.content,
			
			objects.labelDistribution.el.content,
			objects.selectDistFuncWeibullRad.el.content,
			objects.selectDistFuncExpRad.el.content,
			objects.selectDistFuncLnormalRad.el.content, 
			objects.selectDistFuncLogLogisRad.el.content,
			objects.selectDistFuncGammaRad.el.content, 
			
			objects.confidenceInterval.el.content,
			
			//objects.selectDistFuncPoissonRad.el.content,
			//objects.selectDistFuncNBinomRad.el.content,
			//objects.selectDistFuncGeomRad.el.content,
			//objects.selectDistFuncBetaRad.el.content,
			//objects.selectDistFuncUnifRad.el.content,
			//objects.selectDistFuncLogisRad.el.content,
			//objects.selectDistFuncCauchyRad.el.content, 
			//objects.selectDistFuncNormRad.el.content,
			
			objects.labelSurvival.el.content,
            objects.survivalradioCI.el.content,
			objects.survivalradio.el.content,
			objects.survivalradioKMCI.el.content,
			objects.survivalradioKM.el.content,
			
			objects.labelFailure.el.content,
            objects.inciradioCI.el.content,
			objects.inciradio.el.content,
			objects.inciradioKMCI.el.content,
			objects.inciradioKM.el.content,
            ],
            /* bottom: [styleoptions.el.content,
            axisoptions.el.content], */
			
            nav: {
                name: localization.en.navigation,
                icon: "icon-kaplan1",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new parametricSurvival().render()
