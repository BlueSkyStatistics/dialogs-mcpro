
var localization = {
    en: {
        title: "Concordance Correlation Coefficient",
        navigation: "Concordance Correlation Coefficient",
        obs1var: "Observer 1:",
        obs2var: "Observer 2:",
        cilevel: "Confidence Level:",
        label1: "Confidence Interval Method",
        ztrans: "Z-transform",
        asymp: "Asymptotic",
		plotoptionslabel: "Plot Options",
		plottitle: "Title",
		xlabel: "X-axis Label",
		ylabel: "Y-axis Label",
		plottheme: "Plot Theme",
        help: {
            title: "Concordance Correlation Coefficient",
            r_help: "help(epi.ccc,package=epiR)",
            body: `
The concordance correlation coefficient (CCC) measures agreement between two observers that measure the same subjects on the same scale for continuous data.  The CCC can range 
between -1 and 1, with 1 being perfect agreement and 0 being no agreement.  Negative values indicate negative agreement, but is rare in practice.  A plot of the observer 1 variable 
(x-axis) vs the observer 2 variable (y-axis) is also provided with a line of perfect agreement (y=x).
<br/><br/>
<b>Observer 1:</b> Variable containing the values provided by an observer; must be numeric
<br/>
<b>Observer 2:</b> Variable containing the values provided by a second observer; must be numeric
<br/>
<b>Confidence Level:</b> Desired confidence interval level for the CCC
<br/>
<b>Confidence Interval Method:</b>  Desired confidence interval method.  The z-transform method (or inverse hyperbolic tangent transformation) is usually a better choice because 
it better approximates a normal distribution.   
<br/><br/>
<b>Required R packages:</b> epiR, ggplot2, ggthemes
                `}
    }
}









class ccc extends baseModal {
    constructor() {
        var config = {
            id: "ccc",
            label: localization.en.title,
            modalType: "two",
            RCode: `
library(epiR)
library(ggplot2)
library(ggthemes)

ccc.res <- epi.ccc({{dataset.name}}{{selected.obs1vardollar | safe}},{{dataset.name}}{{selected.obs2vardollar | safe}},ci="{{selected.cimethod | safe}}",conf.level={{selected.cilevel | safe}})

# sample size
n_data <- data.frame(N=dim(ccc.res$blalt)[1],Nmiss=ccc.res$nmissing)

# combining sample size and CCC results into one data frame
ccc_all <- cbind(n_data,ccc.res$rho.c)

BSkyFormat(ccc_all,singleTableOutputHeader="CCC and {{selected.cilevel | safe}} level CI: {{selected.obs1var | safe}} vs {{selected.obs2var | safe}}")

# scatterplot with y=x line
# first subsetting to observations used in the analysis
dat.plot <- data.frame({{selected.obs1var | safe}}={{dataset.name}}{{selected.obs1vardollar | safe}}, {{selected.obs2var | safe}}={{dataset.name}}{{selected.obs2vardollar | safe}})
dat.comp <- dat.plot[complete.cases(dat.plot), ]
ggplot(dat.comp, aes(x={{selected.obs1var | safe}}, y={{selected.obs2var | safe}})) +
    geom_point() +
    ylim(min(dat.comp{{selected.obs1vardollar | safe}}, dat.comp{{selected.obs2vardollar | safe}}), max(dat.comp{{selected.obs1vardollar | safe}}, dat.comp{{selected.obs2vardollar | safe}})) +
    xlim(min(dat.comp{{selected.obs1vardollar | safe}}, dat.comp{{selected.obs2vardollar | safe}}), max(dat.comp{{selected.obs1vardollar | safe}}, dat.comp{{selected.obs2vardollar | safe}})) +
    geom_abline(intercept=0, slope=1) +
    labs(x="{{selected.xlabel | safe}}", y="{{selected.ylabel | safe}}", title="{{selected.plottitle | safe}}") +
    {{selected.plottheme | safe}}
            `
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            obs1var: {
                el: new dstVariable(config, {
                    label: localization.en.obs1var,
                    no: "obs1var",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                })
            },
            obs2var: {
                el: new dstVariable(config, {
                    label: localization.en.obs2var,
                    no: "obs2var",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                })
            },
            cilevel: {
                el: new advancedSlider(config, {
                    no: "cilevel",
                    label: localization.en.cilevel,
					style: "mt-4",
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.95,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 5 }) },
            ztrans: { el: new radioButton(config, { label: localization.en.ztrans, no: "cimethod", increment: "ztrans", value: "z-transform", state: "checked", extraction: "ValueAsIs" }) },
            asymp: { el: new radioButton(config, { label: localization.en.asymp, no: "cimethod", increment: "asymp", value: "asymptotic", state: "", extraction: "ValueAsIs" }) },
			plottitle: {
				el: new input(config, {
				no: 'plottitle',
				label: localization.en.plottitle,
				allow_spaces: true,
				placeholder: "Scatterplot with perfect agreement line",
				extraction: "TextAsIs",
				type: "character",
				value: "Scatterplot with perfect agreement line",
				width:"w-75",
				})
			},
			xlabel: {
				el: new input(config, {
				no: 'xlabel',
				label: localization.en.xlabel,
				allow_spaces: true,
				placeholder: "Observer 1",
				extraction: "TextAsIs",
				type: "character",
				value: "Observer 1",
				width:"w-75",
				})
			},
			ylabel: {
				el: new input(config, {
				no: 'ylabel',
				label: localization.en.ylabel,
				allow_spaces: true,
				placeholder: "Observer 2",
				extraction: "TextAsIs",
				type: "character",
				value: "Observer 2",
				width:"w-75",
				})
			},
            plottheme: {
                el: new comboBox(config, {
                    no: 'plottheme',
                    label: localization.en.plottheme,
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
			name: localization.en.plotoptionslabel,
			content: [
				objects.plottitle.el, objects.xlabel.el, objects.ylabel.el, objects.plottheme.el
				]
			})
		};
		
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.obs1var.el.content, objects.obs2var.el.content, objects.cilevel.el.content, objects.label1.el.content, objects.ztrans.el.content, objects.asymp.el.content],
			bottom: [plotoptions.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-icon-ccc",
				positionInNav: 2,
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
		
		let obs1vardollar="$"+code_vars.selected.obs1var;
		let obs2vardollar="$"+code_vars.selected.obs2var;	
	
		//create new variables under code_vars
		code_vars.selected.obs1vardollar = obs1vardollar
		code_vars.selected.obs2vardollar = obs2vardollar
				
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
	
	
}
module.exports.item = new ccc().render()