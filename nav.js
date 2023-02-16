const nav = [
    {
        "name": "Datasets",
        "tab": "Datasets",
        "buttons": [
            {
                "name": "Merge",
                "icon": "icon-merge_right",
                "children": [
                    "./UpdateMerge"
                ]
            },
            {
                "name": "Sort",
                "icon": "icon-sort_vertical",            
                "children":[
                    "./movevars"
                ]
            },
            {
                "name": "Subset",
                "icon": "icon-funnel",
                "children": [
                    "./SubsetByLogic"
                ]
            },        
        ]
    },
    {
        "name": "Analysis",
        "tab": "analysis",    
        "buttons":[
            {
                "name": "Survival",
                "icon": "icon-survival",
                "children": [
                    "./CompetingRisksCompareGroups"

                ]
            }, 
            {
                "name": "Crosstab",
                "icon": "icon-crosstab",
                "children": [
                    "./CrosstabList",
                    "./OddsRatioRelativeRisk"
                ]
            },  
            {
                "name": "Summary",
                "icon": "icon-sigma",
                "children": [
                    "./ExploreDataset"
            
                ]
            },   
        ]
    },
    {
        "name": "Variables",
        "tab": "Variables",
        "buttons": [
            "./DateOrderCheck",
            {
                "name": "Missing Values",
                "icon": "icon-na",
                "children": [
                    "./fillvaluesdownup"
                ]
            },
        ]
    },
    {
        "name": "Model Fitting",
        "tab": "model_fitting",
        "buttons": [
            {
                "name": "Regression",
                "icon": "icon-linear_regression_white_comp",
                "children": [
                    "./CoxTimeDependent",
					"./CoxFineGray",
					"./CoxRegMultiple",
                    "./CoxStratified",
					"./LinearRegMultiple",
                    "./ConditionalLogistic",
                    "./LogisticRegMultiple"
                    
                ]
            },
        ]
    },
    {
        "name": "Model Evaluation",
        "tab": "model_statistics",
        "buttons": [
                    "./ForestPlot"
        ]
    },
	{
		"name": "Agreement",
		"tab": "agreement",
		"buttons": [
			{
				"name": "Method",
				"icon": "icon-layout",
				"children": [
					"./ccc",
					"./cccMultiple"
				]
			}
		]
	}	
]

module.exports.nav = nav
