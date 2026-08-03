/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

// const {getT} = global.requireFromRoot("localization");
// let t = getT('menutoolbar')
const nav = [
    {
        "id": "menu-datasets",// {ns: 'menutoolbar'}),
        "tab": "Datasets",
        "buttons": [
            {
                "id": "menu-datasets-matching",// {ns: 'menutoolbar'}),
                "icon": "icon-paired",
                "children": [
                    "./RiskSetMatching",
                    "./SubjectMatching"
                ]
            },            
            {
                "id": "menu-datasets-merge",// {ns: 'menutoolbar'}),
                "icon": "icon-merge_right",
                "children": [
                    "./UpdateMerge"
                ]
            },
            {
                "id": "menu-datasets-sort",// {ns: 'menutoolbar'}),
                "icon": "icon-sort_vertical",            
                "children":[
                    "./movevars"
                ]
            },
            {
                "id": "menu-datasets-subset",// {ns: 'menutoolbar'}),
                "icon": "icon-funnel",
                "children": [
                    "./SubsetByLogic"
                ]
            }      
        ]
    },
    {
        "id": "menu-analysis",// {ns: 'menutoolbar'}),
        "tab": "analysis",    
        "buttons":[
            {
                "id": "menu-analysis-survival",// {ns: 'menutoolbar'}),
                "icon": "icon-survival",
                "children": [
                    "./CompetingRisksCompareGroups"

                ]
            }, 
            {
                "id": "menu-analysis-crosstab",// {ns: 'menutoolbar'}),
                "icon": "icon-crosstab",
                "children": [
                    "./CrosstabList",
                    "./OddsRatioRelativeRisk"
                ]
            },  
            {
                "id": "menu-analysis-summary",// {ns: 'menutoolbar'}),
                "icon": "icon-sigma",
                "children": [
                    "./ExploreDataset"
            
                ]
            },   
        ]
    },
    {
        "id": "menu-variables",// {ns: 'menutoolbar'}),
        "tab": "Variables",
        "buttons": [
            "./DateOrderCheck",
            {
                "id": "menu-variables-missingvalues",// {ns: 'menutoolbar'}),
                "icon": "icon-na",
                "children": [
                    "./FillValuesDownwardUpward"
                ]
            },
            "./Separate"
        ]
    },
    {
		"id": "menu-graphics",// {ns: 'menutoolbar'}),
		"tab": "graphics",
        "buttons": [
            "./GraphExplorerPro"
        ]
    },	
    {
        "id": "menu-modelfitting",// {ns: 'menutoolbar'}),
        "tab": "model_fitting",
        "buttons": [
            {
                "id": "menu-modelfitting-contrasts",
                "icon": "icon-brightness-and-contrast",
                "children": [
                    "./modelContrastsMaineffectPro"
                ]
            },		
			{
                "id": "menu-modelfitting-elasticnet",
                "icon": "icon-elastic_net",
                "children": [
                    "./enetPro",
					"./enetCoxPro"            
                ]				
			},		
			{
                "id": "menu-modelfitting-gee",
                "icon": "icon-link",
                "children": [
                    "./geePro",
					"./geeMultinomialPro",
					"./geeOrdinalPro"                    
                ]				
			},	            
            {
                "id": "menu-modelfitting-regression",// {ns: 'menutoolbar'}),
                "icon": "icon-linear_regression_white_comp",
                "children": [
                    "./CoxTimeDependent",
					"./CoxFineGray",
					"./CoxRegMultiple",
                    "./CoxStratified",
					"./LinearRegMultiple",
                    "./ConditionalLogistic",
                    "./LogisticRegMultiple",
                    "./parametricSurvivalRegression"
                    
                ]
            },
        ]
    },
    {
        "id": "menu-modelevaluation",// {ns: 'menutoolbar'}),
        "tab": "model_statistics",
        "buttons": [
                    "./ForestPlot",
                    {
                        "id": "menu-modelevaluation-predict",
                        "icon": "icon-y-hat",
                        "children": [
                            "./scoringParametricSurvival"
                        ]
                    },
				{
                    "id": "menu-modelevaluation-ROC-Curves",
					"icon": "icon-icc",
					"children": [
						"./rocTdComparePro",
						"./rocTdCompriskComparePro",					
						"./rocTdPro",
						"./rocTdCompriskPro"
					]
				}						
        ]
    },
	{
		"id": "menu-agreement",// {ns: 'menutoolbar'}),
		"tab": "agreement",
		"buttons": [
			{
				"id": "menu-agreement-method",// {ns: 'menutoolbar'}),
				"icon": "icon-layout",
				"children": [
					"./CatAgree",
					"./ccc",
					"./cccmult"
				]
			}
		]
	}	
]

module.exports.nav = nav
