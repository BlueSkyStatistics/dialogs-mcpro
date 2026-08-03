










class GraphExplorerPro extends baseModal {
    static dialogId = 'GraphExplorerPro'
    static t = baseModal.makeT(GraphExplorerPro.dialogId)

    constructor() {
        var config = {
            id: GraphExplorerPro.dialogId,
            label: GraphExplorerPro.t('title'),
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
				label: GraphExplorerPro.t('destdatalabel'),
				no: "destdata",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			note: {
				el: new labelVar(config, {
				label: GraphExplorerPro.t('notelabel'), 
				style: "mt-3", 
				h:5
				})
			},
			imp: {
				el: new labelVar(config, {
				label: GraphExplorerPro.t('implabel'), 
				style: "mt-3", 
				h:5
				})
			},			
			closenote: {
				el: new labelVar(config, {
				label: GraphExplorerPro.t('closenotelabel'), 
				style: "mt-3", 
				h:5
				})			
			},
			report: {
				el: new labelVar(config, {
				label: GraphExplorerPro.t('reportlabel'), 
				style: "mt-3", 
				h:5
				})			
			}			
		};
        const content = {
            left: [objects.dataset_var.el.content],
            right: [objects.destdata.el.content, objects.note.el.content, objects.imp.el.content, objects.closenote.el.content, objects.report.el.content],
            nav: {
                name: GraphExplorerPro.t('navigation'),
                icon: "icon-switch_off",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: GraphExplorerPro.t('help.title'),
            r_help: GraphExplorerPro.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: GraphExplorerPro.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new GraphExplorerPro().render()
}
