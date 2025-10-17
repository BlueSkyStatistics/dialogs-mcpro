/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

//const {getT} = global.requireFromRoot("localization");
let t = getT('menutoolbar')
const nav = () => ([
    {
        "name": t('professional_Datasets_Menu'),// {ns: 'menutoolbar'}),
        "tab": "Datasets",
        "buttons": [
            {
                "name": t('professional_Matching'),// {ns: 'menutoolbar'}),
                "icon": "icon-paired",
                "children": [
                    "./SubjectMatching",
                    "./RiskSetMatching"
                ]
            },            
            {
                "name": t('professional_Merge'),// {ns: 'menutoolbar'}),
                "icon": "icon-merge_right",
                "children": [
                    "./UpdateMerge"
                ]
            },
            {
                "name": t('professional_Sort'),// {ns: 'menutoolbar'}),
                "icon": "icon-sort_vertical",            
                "children":[
                    "./movevars"
                ]
            },
            {
                "name": t('professional_Subset'),// {ns: 'menutoolbar'}),
                "icon": "icon-funnel",
                "children": [
                    "./SubsetByLogic"
                ]
            }      
        ]
    },
    {
        "name": t('professional_Analysis_Menu'),// {ns: 'menutoolbar'}),
        "tab": "analysis",    
        "buttons":[
            {
                "name": t('professional_Survival'),// {ns: 'menutoolbar'}),
                "icon": "icon-survival",
                "children": [
                    "./CompetingRisksCompareGroups"

                ]
            }, 
            {
                "name": t('analysis_Crosstab'),// {ns: 'menutoolbar'}),
                "icon": "icon-crosstab",
                "children": [
                    "./CrosstabList",
                    "./OddsRatioRelativeRisk"
                ]
            },  
            {
                "name": t('professional_Summary'),// {ns: 'menutoolbar'}),
                "icon": "icon-sigma",
                "children": [
                    "./ExploreDataset"
            
                ]
            },   
        ]
    },
    {
        "name": t('professional_Variables_Menu'),// {ns: 'menutoolbar'}),
        "tab": "Variables",
        "buttons": [
            "./DateOrderCheck",
            {
                "name": t('professional_Missing_Values'),// {ns: 'menutoolbar'}),
                "icon": "icon-na",
                "children": [
                    "./FillValuesDownwardUpward"
                ]
            },
            "./Separate"
        ]
    },
    {
        "name": t('professional_Model_Fitting_Menu'),// {ns: 'menutoolbar'}),
        "tab": "model_fitting",
        "buttons": [
            {
                "name": t('professional_Regression'),// {ns: 'menutoolbar'}),
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
        "name": t('professional_Model_Evaluation_Menu'),// {ns: 'menutoolbar'}),
        "tab": "model_statistics",
        "buttons": [
                    "./ForestPlot",
                    {
                        "name": t('modelevaluation_Predict'),
                        "icon": "icon-y-hat",
                        "children": [
                            "./scoringParametricSurvival"
                        ]
                    }                    
        ]
    },
	{
		"name": t('professional_Agreement_Menu'),// {ns: 'menutoolbar'}),
		"tab": "agreement",
		"buttons": [
			{
				"name": t('professional_Method'),// {ns: 'menutoolbar'}),
				"icon": "icon-layout",
				"children": [
					"./CatAgree",
					"./ccc",
					"./cccmult"
				]
			}
		]
	}	
])

module.exports = {
    nav: nav(),
    render: () => nav()
}
