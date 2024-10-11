

class CatAgree extends baseModal {
    static dialogId = 'CatAgree'
    static t = baseModal.makeT(CatAgree.dialogId)

    constructor() {
        var config = {
            id: CatAgree.dialogId,
            label: CatAgree.t('title'),
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
                    label: CatAgree.t('ratervars'),
                    no: "ratervars",
                    filter: "Numeric|String|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            cilevel: {
                el: new advancedSlider(config, {
                    no: "cilevel",
                    label: CatAgree.t('cilevel'),
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.95,
                    extraction: "NoPrefix|UseComma"
                })
            },
            weightschkbox: {
                el: new checkbox(config, {
                    label: CatAgree.t('weightschkbox'),
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
                    label: CatAgree.t('weights'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["unweighted", "quadratic", "ordinal", "linear", "radical", "ratio", "circular", "bipolar"],
                    default: "unweighted"
                })
            },
            N: {
                el: new input(config, {
                    no: 'N',
                    label: CatAgree.t('N'),
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
                    label: CatAgree.t('categLabels'),
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
                name: CatAgree.t('options'),
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
                name: CatAgree.t('navigation'),
                icon: "icon-shapes",
				positionInNav: 1,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CatAgree.t('help.title'),
            r_help: "help(data,package='utils')",
            body: CatAgree.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CatAgree().render()
}
