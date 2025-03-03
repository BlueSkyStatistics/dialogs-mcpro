/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

const nav = [
    {
        "name": "Datasets",
        "tab": "Datasets",
        "buttons": [
            {
                "name": "Matching",
                "icon": "icon-paired",
                "children": [
                    "./SubjectMatching",
                    "./RiskSetMatching"
                ]
            },            
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
            }      
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
                    "./CompetingRisksCompareGroups",
					"./parametricSurvival"

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
                    "./FillValuesDownwardUpward"
                ]
            },
            "./Separate"
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
                    "./LogisticRegMultiple",
					"./parametricSurvivalRegression"
                    
                ]
            },
        ]
    },
    {
        "name": "Model Evaluation",
        "tab": "model_statistics",
        "buttons": [
				"./ForestPlot",
				{
					"name": "Predict",
					"icon": "icon-y-hat",
					"children": [
						"./scoringParametricSurvival"
					]
				}
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
					"./CatAgree",
					"./ccc",
					"./cccmult"
				]
			}
		]
	}	
]

module.exports.nav = nav
