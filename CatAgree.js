/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

var localization = {
    en: {
        title: "Categorical Agreement",
        navigation: "Categorical Agreement",
        ratervars: "Rater Variables:",
        cilevel: "Confidence Level:",
        options: "Advanced",
        categLabels: "Optionally specify all possible ratings separated by , e.g. 1,2,3,4,5 or \"low\",\"medium\",\"high\" ",
        weightschkbox: "Show category weights",
        weights: "Select category weights",
        N: "Finite population size (if any)",
        help: {
            title: "Categorical Agreement",
            r_help: "help(fleiss.kappa.raw, package=irrCAC)",
            body: `
<b>Description</b></br>
Computes percent agreement, Conger's/Cohen's kappa, Fleiss' kappa, Gwet's AC1/AC2, Krippendorff's alpha, and the Brennan-Prediger coefficient among multiple raters (2, 3, +) when the input data represent the raw ratings reported for each subject and each rater.  Unweighted and weighted versions of these statistics are available, with different category weighting methods.</br>
Missing values are incorported into the chance agreement calculations per Gwet (2014).</br>
We also provide the option to display the weightings of the rating categories.</br>
For more information, see: </br></br>Gwet, K.L. (2014, ISBN:978-0970806284). “Handbook of Inter-Rater Reliability,” 4th Edition. Advanced Analytics, LLC
</br></br>Klein, D. (2018) doi:https://doi.org/10.1177/1536867X1801800408. “Implementing a general framework for assessing interrater agreement in Stata,” The Stata Journal Volume 18, Number 4, pp. 871-901.</br></br> 
<b>Usage</b>
<br/>
<br/>
<ul>
<li>
<b>Rater Variables:</b>  Variables corresponding to each rater where each column represents one rater and each row one subject. They can be numeric, factor, ordinal, or character variables.</br>
</li>
<li>
<b>Confidence Level:</b>  The confidence level associated with the confidence interval. Its default value is 0.95.</br>
</li>
<li>
<b>Show category weights:</b> shows the numerical weights for the rater categories according to the selected weights.  The selected weighting should correspond to the desired closeness between the categories.
</li>
<li>
<b>Select category weights:</b> A mandatory parameter that is either a string variable or a matrix. The string describes one of the predefined weights and must take one of the values ("unweighted","quadratic", "ordinal", "linear", "radical", "ratio", "circular", "bipolar"). </br>
If this parameter is a matrix then it must be a square matrix qxq where q is the number of posssible categories where a subject can be classified. If some of the q possible categories are not used, then it is strongly advised to specify the complete list of possible categories. Otherwise, the program may not work.</br>
NOTE: Specifying a matrix is NOT supported in the syntax. You need to paste the code and edit to specify a matrix.</br>
</li>
<li>
<b>Finite population size (if any):</b> Optional parameter representing the population size (if any). It may be used to perform a finite population correction to the variance. Its default value is infinity.
</li>
<li>
<b>Optionally specify all possible ratings:</b> Optional list used in the case when no rater uses a possible category. If nothing is specified, it's assumed that the oberved categories are the entire category set.
</li>
</ul>
<b>R Package</b></br>
irrCAC</br>
<b>Help</b></br>
This dialog uses the pa.coeff.raw, conger.kappa.raw, fleiss.kappa.raw, gwet.ac1.raw, krippen.alpha.raw, and bp.coeff.raw functions.
For detailed help, see the irrCAC package help at triple dot menu > Help > R Package Help.
`}
    }
}

class CatAgree extends baseModal {
    constructor() {
        var config = {
            id: "CatAgree",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(irrCAC)

# percent agreement
pa.res <- irrCAC::pa.coeff.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})
	
# Cohen's/Conger's kappa
conger.res <- irrCAC::conger.kappa.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})

# Fleiss's kappa
fkappa.res <- irrCAC::fleiss.kappa.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})
	
# Gwet's AC1/AC2
gwet.res <- irrCAC::gwet.ac1.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})

# Krippendorff's alpha
krippen.res <- irrCAC::krippen.alpha.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})

# Brennan and Prediger's coefficient
bp.res <- irrCAC::bp.coeff.raw( ratings = {{dataset.name}}[, c({{selected.ratervars | safe}})], 
\tweights = "{{selected.weights | safe}}",{{if (options.selected.categLabels != "")}} categ.labels = c({{selected.categLabels | safe}}), {{/if}}
\n\tconflev = {{selected.cilevel | safe}}, {{if (options.selected.N != "")}}N = {{selected.N | safe}}{{/if}})

allcoefs.est <- rbind(pa.res$est, conger.res$est, fkappa.res$est, gwet.res$est, krippen.res$est, bp.res$est)

# rater variables used
BSkyFormat(c({{selected.ratervars | safe}}), singleTableOutputHeader="Specified Rater Variables")

# Rating categories used in the analysis
BSkyFormat(fkappa.res$categories, singleTableOutputHeader = "Rating categories used" )

{{if (options.selected.weightschkbox =="TRUE")}}# weights\nBSkyFormat(fkappa.res$weights, singleTableOutputHeader = "Category Weight Matrix" )\n{{/if}}

# Displaying all statistics
BSkyFormat(allcoefs.est, singleTableOutputHeader = "Categorical Agreement Statistics" )
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            ratervars: {
                el: new dstVariableList(config, {
                    label: localization.en.ratervars,
                    no: "ratervars",
                    filter: "Numeric|String|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            cilevel: {
                el: new advancedSlider(config, {
                    no: "cilevel",
                    label: localization.en.cilevel,
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.95,
                    extraction: "NoPrefix|UseComma"
                })
            },
            weightschkbox: {
                el: new checkbox(config, {
                    label: localization.en.weightschkbox,
                    no: "weightschkbox",
					style: "mb-4",
                    bs_type: "valuebox",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
                })
            },
            weights: {
                el: new comboBox(config, {
                    no: 'weights',
                    label: localization.en.weights,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["unweighted", "quadratic", "ordinal", "linear", "radical", "ratio", "circular", "bipolar"],
                    default: "unweighted"
                })
            },
            N: {
                el: new input(config, {
                    no: 'N',
                    label: localization.en.N,
                    placeholder: "",
                    allow_spaces: true,
                    extraction: "TextAsIs",
                    type: "numeric",
                    value: "",
                }),
            },
            categLabels: {
                el: new input(config, {
                    no: 'categLabels',
                    label: localization.en.categLabels,
                    placeholder: "",
                    allow_spaces: true,
                    extraction: "TextAsIs",
                    type: "character",
                    value: "",
                }),
            },
        }
        var opts = {
            el: new optionsVar(config, {
                no: "fk_options",
                name: localization.en.options,
                content: [
                    objects.N.el,
                    objects.categLabels.el
                ]
            })
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.ratervars.el.content, objects.cilevel.el.content, objects.weights.el.content, objects.weightschkbox.el.content],
            bottom: [opts.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-shapes",
				positionInNav: 1,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new CatAgree().render()