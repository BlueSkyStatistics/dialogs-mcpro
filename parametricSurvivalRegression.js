/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class parametricSurvivalRegression extends baseModal {
    static dialogId = 'parametricSurvivalRegression'
    static t = baseModal.makeT(parametricSurvivalRegression.dialogId)

    constructor() {
        var config = {
            id: parametricSurvivalRegression.dialogId,
            label: parametricSurvivalRegression.t('title'),
            modalType: "two",
            RCode:`
require(survival)
require(flexsurv)
require(boot)
require(dplyr)
require(broom)

#require(survminer)
#require(arsenal)
#require(ggthemes)


{{if(options.selected.rmstChk ==="TRUE")}}
	# Define a function to compute the RMST from a flexsurvreg model
	compute_rmst <<- function(data, indices) {
	# Sample data with replacement
	boot_data = data[indices, ]
	  
	# Fit the model to the bootstrap sample
	fit = flexsurvreg(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ {{selected.destvars | safe}}, data = boot_data, dist = "{{selected.gpbox1 | safe}}",{{if(options.selected.weightvar !=="")}} weights ={{selected.weightvar | safe}}, {{/if}} na.action=na.exclude)
	  
	# Calculate RMST up to the specified follow-up time
	max_followup = max(data\${{selected.timevar | safe}})  # or use a desired fixed time
	rmst_value = summary(fit, type = "rmst", t = max_followup)[[1]]$est
	  
	return(rmst_value)
	}
{{/if}}

BSkyFormat(paste("Distribution function {{selected.gpbox1 | safe}} chosen to compute the survival/failure analysis"))

bsky_temp_df = NULL 
bsky_temp_df = {{dataset.name}}[,c('{{selected.timevar | safe}}','{{selected.eventvar | safe}}', {{if(options.selected.weightvar !=="")}} '{{selected.weightvar | safe}}', {{/if}}
					c(strsplit('{{selected.destvars | safe}}', "\\\\+")[[1]]))
				]
bsky_temp_df = stats::na.omit(bsky_temp_df)

# Fit a model with {{selected.gpbox1 | safe}} distribution
bsky_{{selected.gpbox1 | safe}}_fit = flexsurvreg(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ {{selected.destvars | safe}}, cl = {{selected.confidenceInterval | safe}}, data = bsky_temp_df, dist = "{{selected.gpbox1 | safe}}", {{if(options.selected.weightvar !=="")}} weights ={{selected.weightvar | safe}}, {{/if}} na.action=na.exclude)
#BSkyFormat(as.data.frame(bsky_{{selected.gpbox1 | safe}}_fit$res), outputTableRenames = "{{selected.gpbox1 | safe}} distribution parameters")

{{selected.modelname | safe}} = bsky_{{selected.gpbox1 | safe}}_fit
# Format the model formula
cat(gsub("bsky_temp_df","{{dataset.name}}", paste0("{{selected.modelname | safe}}", " = ", paste(deparse(bsky_{{selected.gpbox1 | safe}}_fit\$call), collapse = "\n"))), sep = "\n")


bsky_data_overview = data.frame(
	N = bsky_{{selected.gpbox1 | safe}}_fit$N,
	Events = bsky_{{selected.gpbox1 | safe}}_fit$events,
	Censored = bsky_{{selected.gpbox1 | safe}}_fit$N - bsky_{{selected.gpbox1 | safe}}_fit$events,
	AIC =  bsky_{{selected.gpbox1 | safe}}_fit$AIC,
	Loglik = bsky_{{selected.gpbox1 | safe}}_fit$loglik,                        
	Confint = paste0(round((bsky_{{selected.gpbox1 | safe}}_fit$cl*100),2),"%"))
BSkyFormat(bsky_data_overview, outputTableRenames = "Overview of the model and selected variables {{selected.timevar | safe}}, {{selected.eventvar | safe}}")

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
	BSkyFormat(bsky_rmean_df, outputTableRenames = "Restricted Mean and Median Survival Times")
{{/if}}

bsky_surv_model_est<-as.data.frame(tidy(bsky_{{selected.gpbox1 | safe}}_fit, conf.int=TRUE))
names(bsky_surv_model_est)[c(6,7)] = bsky_CI_names
BSkyFormat(bsky_surv_model_est, outputTableRenames="Parameter Estimates")


{{if(options.selected.HazardRatioChk ==="TRUE")}}
bsky_surv_model_hr<-as.data.frame(tidy(bsky_{{selected.gpbox1 | safe}}_fit, exponentiate=TRUE, conf.int=TRUE))
names(bsky_surv_model_hr)[c(6,7)] = bsky_CI_names
BSkyFormat(bsky_surv_model_hr, outputTableRenames="Hazard Ratios (HR)")
{{/if}}


bsky_covar_mean_values_computed = names(summary(bsky_{{selected.gpbox1 | safe}}_fit))
# Split the string into individual key-value pairs
bsky_key_value_pairs = strsplit(bsky_covar_mean_values_computed, ",")[[1]]

# Extract keys (covariate var names) and mean values
bsky_covar_names = sapply(bsky_key_value_pairs, function(x) strsplit(x, "=")[[1]][1])  
bsky_covar_mean_values = sapply(bsky_key_value_pairs, function(x) as.numeric(strsplit(x, "=")[[1]][2]))

bsky_covar_mean_df = as.data.frame(as.list(bsky_covar_mean_values))
colnames(bsky_covar_mean_df) = bsky_covar_names

{{if(options.selected.coVarValues !="")}}
	bsky_covar_mean_df[1,] = c({{selected.coVarValues | safe}})
	BSkyFormat(bsky_covar_mean_df, outputTableRenames="Specified Values for Covariates used in model analysis and plots")
{{#else}}
	BSkyFormat(bsky_covar_mean_df, outputTableRenames="Mean Values for Covariates used in model analysis and plots")
{{/if}}

{{if(options.selected.spectimes !="")}}
	# Survival probability at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_surv_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = bsky_covar_mean_df, t = c({{selected.spectimes | safe}}), type = "survival")

	#cat("{{selected.gpbox1 | safe}} Survival Probability at time", c({{selected.spectimes | safe}}), ":", bsky_surv_{{selected.gpbox1 | safe}}, "\\n")

	# Failure probability (1 - Survival) at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_fail_{{selected.gpbox1 | safe}} = 1 - bsky_surv_{{selected.gpbox1 | safe}}[[1]]$est
	
	#cat("{{selected.gpbox1 | safe}} Failure Probability at time", c({{selected.spectimes | safe}}), ":", bsky_fail_{{selected.gpbox1 | safe}}, "\\n")

	# Cumulative hazard at ({{selected.spectimes | safe}} days for {{selected.gpbox1 | safe}} distribution
	bsky_cumhaz_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = bsky_covar_mean_df, t = c({{selected.spectimes | safe}}), type = "cumhaz")
	
	#cat("{{selected.gpbox1 | safe}} Cumulative Hazard at time", c({{selected.spectimes | safe}}), ":", bsky_cumhaz_{{selected.gpbox1 | safe}}, "\\n")
	
	
	#bsky_time_df = data.frame(Time = c({{selected.spectimes | safe}}), Survival = bsky_surv_{{selected.gpbox1 | safe}}[[1]]$est, Failure = bsky_fail_{{selected.gpbox1 | safe}}, Cumulative_failure = bsky_cumhaz_{{selected.gpbox1 | safe}}[[1]]$est)
	#BSkyFormat(bsky_time_df, outputTableRenames = "Probalibity at specified time")

	# Calculate the Z value
	#bsky_Z <- qnorm(1 - (1 - {{selected.confidenceInterval | safe}}) / 2)
	
	bsky_time_df = as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})
	names(bsky_time_df) = c("Time", "Survival", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Survival Probalibity at specified time")
	
	#bsky_time_df = data.frame(Time = c({{selected.spectimes | safe}}), Survival_prob = bsky_surv_{{selected.gpbox1 | safe}}, Failure_prob = bsky_fail_{{selected.gpbox1 | safe}}, Cumulative_failure = bsky_cumhaz_{{selected.gpbox1 | safe}})
	bsky_time_df = cbind(as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})[,1], 1 - as.data.frame(bsky_surv_{{selected.gpbox1 | safe}})[2:4])
	names(bsky_time_df) = c("Time", "Failure", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Failure Probalibity at specified time")
	
	bsky_time_df = as.data.frame(bsky_cumhaz_{{selected.gpbox1 | safe}})
	names(bsky_time_df) = c("Time", "Cumulative_hazards", bsky_CI_names)
	BSkyFormat(bsky_time_df, outputTableRenames = "Cumulative Hazards at specified time")
{{/if}}


{{if(options.selected.specprobs !="")}}
	# Survival probability at ({{selected.specprobs | safe}} time for {{selected.gpbox1 | safe}} distribution
	bsky_time_{{selected.gpbox1 | safe}} = summary(bsky_{{selected.gpbox1 | safe}}_fit, newdata = bsky_covar_mean_df, quantiles  = c({{selected.specprobs | safe}}), type = "quantile")
	
	#cat("{{selected.gpbox1 | safe}} time estimate for survival probability of", c({{selected.specprobs | safe}}), ":", bsky_time_{{selected.gpbox1 | safe}}, "\\n")
	
	#bsky_prob_df = data.frame(Prob = c({{selected.specprobs | safe}}), Survival_time = bsky_time_{{selected.gpbox1 | safe}})
	bsky_prob_df = data.frame(bsky_time_{{selected.gpbox1 | safe}}) 
	names(bsky_prob_df) = c("Quantile", "Survival Time", bsky_CI_names)
	BSkyFormat(bsky_prob_df, outputTableRenames = "Survival Time to Event at specified quantile")
{{/if}}
	
	# Define a sequence of time points for prediction
	time_points <- seq(0, max(bsky_temp_df\${{selected.timevar | safe}}), by = 10)

	# Get survival predictions
	bsky_surv_pred <- summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "survival", t = time_points)[[1]]
	bsky_cumhaz_pred <- summary(bsky_{{selected.gpbox1 | safe}}_fit, type = "cumhaz", t = time_points)[[1]]

	# Convert to data frames
	bsky_surv_df <- data.frame(
	  time = time_points,
	  #survival = sapply(bsky_surv_pred, function(x) x$est),
	  #lower_ci = sapply(bsky_surv_pred, function(x) x$lcl),
	  #upper_ci = sapply(bsky_surv_pred, function(x) x$ucl)
	  {{if(options.selected.survivalPlottypegroup ==="survivalCI" || options.selected.survivalPlottypegroup ==="survivalKMCI")}}
	  lower_ci = bsky_surv_pred$lcl,
	  upper_ci = bsky_surv_pred$ucl,
	  {{/if}}
	  survival = bsky_surv_pred$est
	)

	bsky_failure_df <- data.frame(
	  time = time_points,
	  {{if(options.selected.falurePlottypegroup ==="inciCI" || options.selected.falurePlottypegroup ==="inciKMCI")}}
	  lower_ci = 1- bsky_surv_pred$lcl,
	  upper_ci = 1- bsky_surv_pred$ucl,
	  {{/if}}
	  failure = 1- bsky_surv_pred$est
	)
	
	bsky_cumhaz_df <- data.frame(
	  time = time_points,
	  #cumhaz = sapply(bsky_cumhaz_pred, function(x) x$est),
	  #lower_ci = sapply(bsky_cumhaz_pred, function(x) x$lcl),
	  #upper_ci = sapply(bsky_cumhaz_pred, function(x) x$ucl)
	  
	  {{if(options.selected.falurePlottypegroup ==="inciCI" || options.selected.falurePlottypegroup ==="inciKMCI")}}
	  lower_ci = bsky_cumhaz_pred$lcl,
	  upper_ci = bsky_cumhaz_pred$ucl,
	  {{/if}}
	  cumhaz = bsky_cumhaz_pred$est
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
		bsky_km_fit <- survfit(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, conf.int = {{selected.confidenceInterval | safe}}, data = bsky_temp_df)
		
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
		bsky_km_fit <- survfit(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ 1, conf.int = {{selected.confidenceInterval | safe}}, data = bsky_temp_df)
		
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
			legend.position = "inside",
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
			legend.position = "inside",
			legend.position.inside = c(0.15, 0.85), # Top-right corner
			legend.background = element_blank(), #element_rect(fill = "white", color = "black"), # Optional: Legend box
			legend.title = element_text(size = 12, face = "bold"),
			legend.key = element_blank() #element_rect(fill = NA)
			)
	{{/if}}
	
	
	#Setting attributes to support scoring
	attr(.GlobalEnv\${{selected.modelname | safe}},"eventVar") = "'{{selected.eventvar | safe }}'"
	attr(.GlobalEnv\${{selected.modelname | safe}},"followUpTimeVar") = "'{{selected.timevar | safe }}'"

	#Setting independent variables for clinicans
	attr(.GlobalEnv\${{selected.modelname | safe}},"indepvarCL") = paste(str_split("{{selected.destvars}}",fixed("+")),sep=",", collapse="")

	#Setting independent variables for machine learners (All variables including event and followup time need to be present in the data set
	#in order for the dataset to be scored
	BSkyIndepVars = str_split("{{selected.destvars}}",fixed("+"))
	BSkyIndepVars[[1]] = c(BSkyIndepVars[[1]], '{{selected.eventvar | safe }}', '{{selected.timevar | safe }}')
	attr(.GlobalEnv\${{selected.modelname | safe}}, "indepvar") = paste(BSkyIndepVars,sep=",", collapse="")

	attr(.GlobalEnv\${{selected.modelname | safe}},"depvar") = "'{{selected.eventvar | safe }}'"
	#attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar") = paste(str_split("{{selected.destvars}}",fixed("+")),sep=",", collapse="")
	attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar") = class({{dataset.name}}[, c("{{selected.eventvar | safe}}")])
	attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample") = sample({{dataset.name}}[, c("{{selected.eventvar | safe}}")], size = 2, replace = TRUE)

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
			modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: parametricSurvivalRegression.t('modelname'),
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "ParamSurvivalRegModel1",
					style: "mb-3"
                })
            },              
            timevar: {
                el: new dstVariable(config, {
                    label: parametricSurvivalRegression.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: parametricSurvivalRegression.t('eventvar'),
                    no: "eventvar",
                    //filter: "Numeric|Scale|",
					filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			destvars: {
                el: new dstVariableList(config, {
                    label: parametricSurvivalRegression.t('destvars'),
                    no: "destvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus"
                }), r: ['{{ var | safe}}']
            }, 
            weightvar: {
                el: new dstVariable(config, {
                    label: parametricSurvivalRegression.t('weightvar'),
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
                    //wrapped: 'weights=%val%,'  
                }), r: ['weights={{weightvar|safe}},', '{{weightvar|safe}}'],
            },       
			rmstChk: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('rmstChk'), 
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
                    label: parametricSurvivalRegression.t('rmstSEChk'), 
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
                    label: parametricSurvivalRegression.t('bootIter'),
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
			HazardRatioChk: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('HazardRatioChk'), 
					no: "HazardRatioChk",
                    bs_type: "valuebox",
                    //style: "ml-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "Checked",
					newline: true,
                })
            },
		
            labelSurvival: { el: new labelVar(config, { label: parametricSurvivalRegression.t('labelSurvival'), style: "mt-2", h: 6 }) },
            
			survivalradioCI: {
                el: new radioButton(config, {
                    label: parametricSurvivalRegression.t('survivalradioCI'),
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
                    label: parametricSurvivalRegression.t('survivalradio'),
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
                    label: parametricSurvivalRegression.t('survivalradioKMCI'),
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
                    label: parametricSurvivalRegression.t('survivalradioKM'),
                    no: "survivalPlottypegroup",
                    increment: "survivalradioKM",
					value: "survivalKM",
                    //syntax: "NULL",
                    state: "",
                    extraction: "ValueAsIs",
                })
            },
			
			labelFailure: { el: new labelVar(config, { label: parametricSurvivalRegression.t('labelFailure'), style: "mt-2", h: 6 }) },
            
            inciradioCI: {
                el: new radioButton(config, {
                    label: parametricSurvivalRegression.t('inciradioCI'),
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
                    label: parametricSurvivalRegression.t('inciradio'),
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
                    label: parametricSurvivalRegression.t('inciradioKMCI'),
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
                    label: parametricSurvivalRegression.t('inciradioKM'),
                    no: "falurePlottypegroup",
                    increment: "inciradioKM",
					value: "inciKM",
                    //syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
			
            /*printallest: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('printallest'),
                    no: "printallest",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('printspecest'),
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },*/
            spectimes: { 
                el: new input(config, {
                    no: 'spectimes',
                    label: parametricSurvivalRegression.t('spectimes'),
					//style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },	
			specprobs: { 
                el: new input(config, {
                    no: 'specprobs',
                    label: parametricSurvivalRegression.t('specprobs'),
					//style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },
			coVarValues: { 
                el: new input(config, {
                    no: 'coVarValues',
                    label: parametricSurvivalRegression.t('coVarValues'),
					//style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },
			
			labelDistribution: { el: new labelVar(config, { label: parametricSurvivalRegression.t('labelDistribution'), style: "mt-2", h: 6 }) },
			
			selectDistFuncCauchyRad: {
                el: new radioButton(config, {
                    label: parametricSurvivalRegression.t('selectDistFuncCauchyRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncLogisRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncLogLogisRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncUnifRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncBetaRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncGeomRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncNBinomRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncGammaRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncExpRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncPoissonRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncLnormalRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncWeibullRad'),
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
                    label: parametricSurvivalRegression.t('selectDistFuncNormRad'),
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
                    label: parametricSurvivalRegression.t('confidenceInterval'),
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
                    label: parametricSurvivalRegression.t('titlebox'),
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
				label: parametricSurvivalRegression.t('plottitlesizelabel'),
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
                    label: parametricSurvivalRegression.t('themedropdown'),
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
            label2: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label2'), style:"mt-3", h: 5 }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('natriskchkbox'),
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: parametricSurvivalRegression.t('risktableprop'),
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
                    label: parametricSurvivalRegression.t('risktablepos'),
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
				label: parametricSurvivalRegression.t('risktablevaluesize'),
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
				label: parametricSurvivalRegression.t('risktabletitlesize'),
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
				label: parametricSurvivalRegression.t('risktableaxislabelsize'),
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
				label: parametricSurvivalRegression.t('risktableticklabelsize'),
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
                    label: parametricSurvivalRegression.t('risktableclean'),
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-3 mb-3"
                })
            }, 			
            label3: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label3'), h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: parametricSurvivalRegression.t('linesize'),
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
                    label: parametricSurvivalRegression.t('linecolor'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["black", "blue", "red", "green", "purple", "cyan", "magenta"],
                    default: "black",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label4'), style:"ml-3 mt-3", h: 5 }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('cichkbox'),
                    no: "cichkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-5"
                })
            },            
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: parametricSurvivalRegression.t('cistyle'),
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
                    label: parametricSurvivalRegression.t('citransparency'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            },   
            label5: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label5'), style:"ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: parametricSurvivalRegression.t('censorchkbox'),
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: parametricSurvivalRegression.t('censorsize'),
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
                    label: parametricSurvivalRegression.t('medsurvivalline'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "hv", "h", "v"],
                    default: "none",
                    style:"ml-3"
                })
            }, 
            
            label6: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label6'), h: 5 }) },
            survaxislabel: {
                el: new input(config, {
                    no: 'survaxislabel',
                    label: parametricSurvivalRegression.t('survaxislabel'),
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
				label: parametricSurvivalRegression.t('axislabelsize'),
				style: "mt-5",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},            
            label7: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label7'), style: "mt-3 ml-4", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: parametricSurvivalRegression.t('defbutton'),
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
                    label: parametricSurvivalRegression.t('pctbutton'),
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
                    label: parametricSurvivalRegression.t('survaxislimits'),
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
                    label: parametricSurvivalRegression.t('survtickinc'),
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4 mt-3"
                })
            }, 
            label8: { el: new labelVar(config, { label: parametricSurvivalRegression.t('label8'), h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: parametricSurvivalRegression.t('timeaxislabel'),
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
                    label: parametricSurvivalRegression.t('timeaxislimits'),
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
                    label: parametricSurvivalRegression.t('timetickinc'),
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
				label: parametricSurvivalRegression.t('ticklabelsize'),
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            label12: {
                el: new labelVar(config, {
                  label: parametricSurvivalRegression.t('label12'), 
                  style: "mt-3", 
                  h:5
                })
              },  	 */		

        }
		
        /* var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: parametricSurvivalRegression.t('styleoptions'),
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
                name: parametricSurvivalRegression.t('axisoptions'),
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
			objects.modelname.el.content,
			objects.timevar.el.content,
            objects.eventvar.el.content, 
			
			objects.destvars.el.content, 
			objects.weightvar.el.content, 
			
			objects.rmstChk.el.content, 
			objects.rmstSEChk.el.content,
			objects.bootIter.el.content, 
            
			objects.HazardRatioChk.el.content,
			
			objects.labelDistribution.el.content,
			objects.selectDistFuncWeibullRad.el.content,
			objects.selectDistFuncExpRad.el.content,
			objects.selectDistFuncLnormalRad.el.content, 
			objects.selectDistFuncLogLogisRad.el.content,
			objects.selectDistFuncGammaRad.el.content, 
			
			//objects.printallest.el.content,
			//objects.printspecest.el.content,
			
			objects.spectimes.el.content, 
			objects.specprobs.el.content, 
			objects.coVarValues.el.content,
			
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
                name: parametricSurvivalRegression.t('navigation'),
                icon: "icon-kaplan1",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: parametricSurvivalRegression.t('help.title'),
            r_help: parametricSurvivalRegression.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: parametricSurvivalRegression.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new parametricSurvivalRegression().render()
}

