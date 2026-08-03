
var localization = {
    en: {
        title: "Graph Explorer",
        navigation: "Graph Explorer",
		destdatalabel: "Specify Dataset",
		notelabel: "This opens a web browser window to interactively make a graph.",
		implabel: "IMPORTANT!",		
		closenotelabel: "You must close the browser application correctly by clicking the large X on the right side of the dark title bar labelled 'Esquisse' before BlueSky can be used again.  Only closing the browser tab or the browser does not close the application.",
		reportlabel: "The plot can be saved within the browser application.  To include the plot in the BlueSky output window please copy/paste the R code from the browser application.",
        help: {
            title: "Graph Explorer",
            r_help: "help(esquisser, package ='esquisse')",
            body: `
This dialog allows the user the interactively create a plot in a web browser using the Esquisse R package with the grammar of graphics framework.  The default browser will be used.
<br/><br/>
<b>IMPORTANT!</b>
<br/>
You must close the browser application appropriately to quit Graph Explorer. Do so by clicking the large X on the right side of the dark title bar labelled 
"Esquisse".  Closing the browser tab or the browser does not close the application.  Failing to close the browser application correctly will require a restart of BlueSky Statistics.
<br/><br/>
The plot can be saved within the browser application.  The R code to create the plot can also be copy/pasted from the web browser into BlueSky for saving or further modifications.
<br/><br/>
See <a href="https://cran.r-project.org/web/packages/esquisse/vignettes/get-started.html">here</a> for a tutorial on Esquisse.
<br/><br/>
See <a href="https://vita.had.co.nz/papers/layered-grammar.html">here</a> for more information on the grammar of graphics.
<br/><br/>
<b>R Packages Required:</b> esquisse
			`}
    }
}









class GraphExplorerPro extends baseModal {
    constructor() {
        var config = {
            id: "GraphExplorerPro",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(esquisse)
esquisser({{selected.destdata | safe}})
`
        };
        var objects = {
			dataset_var: {
				el: new srcDataSetList(config, {
				action: "move"
				}) 
			},
			destdata: {
				el: new dstVariable(config, {
				label: localization.en.destdatalabel,
				no: "destdata",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			note: {
				el: new labelVar(config, {
				label: localization.en.notelabel, 
				style: "mt-3", 
				h:5
				})
			},
			imp: {
				el: new labelVar(config, {
				label: localization.en.implabel, 
				style: "mt-3", 
				h:5
				})
			},			
			closenote: {
				el: new labelVar(config, {
				label: localization.en.closenotelabel, 
				style: "mt-3", 
				h:5
				})			
			},
			report: {
				el: new labelVar(config, {
				label: localization.en.reportlabel, 
				style: "mt-3", 
				h:5
				})			
			}			
		};
        const content = {
            left: [objects.dataset_var.el.content],
            right: [objects.destdata.el.content, objects.note.el.content, objects.imp.el.content, objects.closenote.el.content, objects.report.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-switch_off",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new GraphExplorerPro().render()