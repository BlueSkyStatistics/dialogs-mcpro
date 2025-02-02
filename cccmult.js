










class cccmult extends baseModal {
    static dialogId = 'cccmult'
    static t = baseModal.makeT(cccmult.dialogId)

    constructor() {
        var config = {
            id: cccmult.dialogId,
            label: cccmult.t('title'),
            modalType: "two",
            RCode: `
library(epiR)
library(boot)
library(GGally)
library(ggthemes)

# creating a data set with no missing values for selected variables - used for sample size table
mydat <- {{dataset.name}}[, {{selected.ratervars | safe}}]
mydat.nomiss <- mydat[complete.cases(mydat), ]

# original estimates
orig.val <- epi.occc(dat=mydat.nomiss[ , {{selected.ratervars | safe}}], na.rm=TRUE, pairs=TRUE)

# number of raters
num.vars.dialog <- length({{selected.ratervars | safe}})

# function used in the bootstrap iterations
# returns either a vector of the overall CCC and all pairwise CCCs (if more than 2 raters), or just the overall CCC (if only 2 raters)

occc <- function(data, indices=1:nrow(data), vars, num.vars)
{
occc.est <- epi.occc(dat=data[indices, vars], na.rm=TRUE, pairs=TRUE)
if (num.vars>2) return(c(occc.est$occc,occc.est$pairs$ccc)) else return(occc.est$occc)
}

# bootstrap iterations
mysamples <- boot(data=mydat.nomiss, statistic=occc, vars={{selected.ratervars | safe}}, num.vars=num.vars.dialog, R={{selected.bootsamp | safe}}, stype="i")

# computes the number of CCC estimates present, either one more than the number of rater pairs or one if only one pair
if (num.vars.dialog>2) {num.interval=choose(num.vars.dialog, 2)+1} else {num.interval=1}

# computes the confidence intervals from the bootstrap for each estimate - only computing the percentile and BCa intervals
bootintervals <- lapply(seq(1,num.interval), boot.ci, boot.out=mysamples, conf={{selected.cilevel | safe}}, type=c("perc","bca"))

# function to extract the confidence intervals from the interval object
grab.elements <- function(x)
{
cbind(x[["percent"]][1, c(4,5), drop=FALSE], x[["bca"]][1, c(4,5), drop=FALSE])
}

# applying the function to the interval object and combining rows
intervals <- do.call(rbind, lapply(bootintervals, grab.elements))

# naming the columns for the confidence intervals
colnames(intervals) <- c("perc.lower","perc.upper","bca.lower","bca.upper")

# creating a vector of the CCC estimates, either overall+pairs or just the overall
if (num.vars.dialog>2) {ccc.values <- c(orig.val$occc, orig.val$pairs$ccc)} else {ccc.values <- orig.val$occc}

# combining the overall and pairwise CCCs with their confidence intervals
occc.results <- cbind(ccc.values,intervals)

# creating labels for each pair of rater variables, combn call creates all pairs
var.comb <- t(combn(x={{selected.ratervars | safe}},m=2))
ccc.pair.labels <- paste(var.comb[ ,1], " vs ", var.comb[ ,2])

# assigning rownames for the output matrix
if (num.vars.dialog>2) {rownames(occc.results) <- c("overall", ccc.pair.labels)} else {rownames(occc.results) <- c("overall")}

# sample size and bootstrap reps
sampsize <- data.frame(N=nrow(mydat.nomiss), Nmiss=nrow({{dataset.name}})-nrow(mydat.nomiss), Raters=num.vars.dialog, Bootstrap.Samples={{selected.bootsamp | safe}})

# output
BSkyFormat(data.frame(Rater.Variables={{selected.ratervars | safe}}), singleTableOutputHeader="Rater Variables Used")
BSkyFormat(sampsize, singleTableOutputHeader="Sample Size and Number of Bootstrap Samples")
BSkyFormat(occc.results, singleTableOutputHeader="CCC's and {{selected.cilevel | safe}} Level Confidence Intervals")

# scatterplot matrix using data set with no missing values
{{if (options.selected.plotchkbox=="TRUE")}}
allpairs.plot <- ggpairs(data=mydat.nomiss, upper=NULL, title="{{selected.plottitle | safe}}"{{selected.varlabels | safe}}) + {{selected.plottheme | safe}}\n
# changing the axis limits and adding the identity lines for off-diagonal plots
for (i in 2:allpairs.plot$nrow) {
  for (j in 1:(i-1)) {
    allpairs.plot[i,j] <- allpairs.plot[i,j] + 
        geom_abline(intercept=0,slope=1) +
        ylim(min(mydat.nomiss), max(mydat.nomiss)) +
        xlim(min(mydat.nomiss), max(mydat.nomiss))
  }
}
# changing the axis limits for the diagonal plots
for (i in 1:allpairs.plot$nrow) {
    allpairs.plot[i,i] <- allpairs.plot[i,i] + xlim(min(mydat.nomiss), max(mydat.nomiss))
}
print(allpairs.plot)
{{/if}}

detach("package:boot")
detach("package:GGally")
            `
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
			ratervars: {
				el: new dstVariableList(config,{
				label: cccmult.t('ratervars'),
				no: "ratervars",
				required: true,
				filter:"Numeric|Scale",
				extraction: "NoPrefix|UseComma|Enclosed",
				wrapped: 'c(%val%)'
				})
			},
            cilevel: {
                el: new advancedSlider(config, {
                    no: "cilevel",
                    label: cccmult.t('cilevel'),
					style: "mt-4",
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.95,
                    extraction: "NoPrefix|UseComma"
                })
            },
			bootsamp: {
				el: new inputSpinner(config, {
					no: 'bootsamp',
					label: cccmult.t('bootsamp'),
					min: 400,
					max: 100000,
					step: 200,
					value: 1000,
					extraction: "NoPrefix|UseComma"
				})
			},			
			plotchkbox: {
				el: new checkbox(config, {
					label: cccmult.t('plotchkbox'),
					no: "plotchkbox",
					extraction: "Boolean"
				})
			},						
			plottitle: {
				el: new input(config, {
				no: 'plottitle',
				label: cccmult.t('plottitle'),
				style: "ml-3",
				allow_spaces: true,
				placeholder: "Rater pairs with perfect agreement line",
				extraction: "TextAsIs",
				type: "character",
				value: "Rater pairs with perfect agreement line",
				width: "w-75",
				})
			},
			varlabels: {
				el: new input(config, {
				no: 'varlabels',
				label: cccmult.t('varlabels'),
				style: "ml-3",
				allow_spaces: true,
				extraction: "TextAsIs",
				type: "character",
				width: "w-100",
				wrapped: ", columnLabels=c(%val%)"
				})
			},			
            plottheme: {
                el: new comboBox(config, {
                    no: 'plottheme',
                    label: cccmult.t('plottheme'),
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["theme_base()", "theme_bw()", "theme_calc()",
                    "theme_classic()", "theme_clean()", "theme_cleantable()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()", "theme_minimal()", "theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_tufte()", "theme_void()",
                    "theme_wsj()"],
                    default: "theme_grey()"
                })
            }			
        }
		
		var plotoptions = {
			el: new optionsVar(config, {
			no: "plotoptions",
			name: cccmult.t('plotoptionslabel'),
			content: [
				objects.plotchkbox.el, objects.plottitle.el, objects.varlabels.el, objects.plottheme.el
				]
			})
		};
		
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.ratervars.el.content, objects.cilevel.el.content, objects.bootsamp.el.content],
			bottom: [plotoptions.el.content],
            nav: {
                name: cccmult.t('navigation'),
                icon: "icon-icon-ccc-multiple",
				positionInNav: 3,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: cccmult.t('help.title'),
            r_help: cccmult.t('help.r_help'),  //r_help: "help(data,package='utils')",
            body: cccmult.t('help.body')
        }
;
    }
	
}

module.exports = {
    render: () => new cccmult().render()
}
