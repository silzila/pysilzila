export const playBookData = {
	name: "Test 2 graph",
	data: {
		tabState: {
			tabs: {
				1: {
					tabId: 1,
					tabName: "Tab - 1",
					showDash: true,
					dashMode: "Edit",
					dashLayout: {
						dashboardLayout: "Auto",
						selectedOptionForAuto: "Full Screen",
						aspectRatio: {
							height: 9,
							width: 16,
						},
						selectedOptionForFixed: "HD",
						custom: {
							height: 9,
							width: 16,
						},
						customRange: {
							minHeight: 9,
							minWidth: 16,
							maxHeight: 12,
							maxWidth: 24,
						},
					},
					selectedTileName: "Tile - 2",
					selectedTileId: 2,
					nextTileId: 3,
					tilesInDashboard: ["1.1", "1.2"],
					dashTilesDetails: {
						1.1: {
							name: "Tile - 1",
							highlight: false,
							propKey: "1.1",
							tileId: 1,
							width: 16,
							height: 12,
							x: 0,
							y: 0,
						},
						1.2: {
							name: "Tile - 2",
							highlight: true,
							propKey: "1.2",
							tileId: 2,
							width: 16,
							height: 16,
							x: 16,
							y: 0,
						},
					},
				},
			},
			tabList: [1],
		},
		tileState: {
			tiles: {
				1.1: {
					tabId: 1,
					tileId: 1,
					tileName: "Tile - 1",
					graphSizeFull: false,
				},
				1.2: {
					tabId: 1,
					tileId: 2,
					tileName: "Tile - 2",
					graphSizeFull: false,
				},
			},
			tileList: {
				1: ["1.1", "1.2"],
			},
		},
		tabTileProps: {
			selectedTabName: "Tab - 1",
			selectedTabId: 1,
			nextTabId: 2,
			editTabName: false,
			selectedTileName: "Tile - 2",
			selectedTileId: 2,
			nextTileId: 3,
			editTileName: false,
			dragging: false,
			chartPropUpdated: false,
			showDash: true,
			dashMode: "Edit",
			dashGridSize: {
				x: 39,
				y: 47,
			},
			columnsOnlyDisplay: false,
			showDataViewerBottom: true,
			selectedControlMenu: "Charts",
			selectedDataSetList: [
				{
					friendly_name: "one big table",
					dc_uid: "post",
					ds_uid: "3tgLpg",
				},
			],
			tablesForSelectedDataSets: {
				"3tgLpg": [
					{
						table_name: "pos_transaction",
						schema_name: "pos_denormalized",
						id: "pt",
						alias: "pos_transaction",
					},
				],
			},
		},
		chartProperty: {
			properties: {
				1.1: {
					tabId: 1,
					tileId: 1,
					chartType: "multibar",
					axesEdited: true,
					chartAxes: [
						{
							name: "Filter",
							fields: [],
						},
						{
							name: "Dimension",
							fields: [
								{
									fieldname: "delivery_date",
									displayname: "delivery_date",
									dataType: "date",
									tableId: "pt",
									uId: "74c6",
									time_grain: "year",
								},
							],
						},
						{
							name: "Measure",
							fields: [
								{
									fieldname: "sales",
									displayname: "sales",
									dataType: "decimal",
									tableId: "pt",
									uId: "42fd",
									agg: "sum",
								},
								{
									fieldname: "profit",
									displayname: "profit",
									dataType: "decimal",
									tableId: "pt",
									uId: "2fc9",
									agg: "sum",
								},
							],
						},
					],
					selectedDs: {
						friendly_name: "one big table",
						dc_uid: "post",
						ds_uid: "3tgLpg",
					},
					selectedTable: {
						dspost: "s",
						"3tgLpg": "pt",
					},
					titleOptions: {
						fontSize: 28,
						chartTitle: "Sales, profit by year of delivery_date",
						generateTitle: "Auto",
					},
					chartOptionSelected: "Title",
				},
				1.2: {
					tabId: 1,
					tileId: 2,
					chartType: "pie",
					axesEdited: true,
					chartAxes: [
						{
							name: "Filter",
							fields: [],
						},
						{
							name: "Dimension",
							fields: [
								{
									fieldname: "category",
									displayname: "category",
									dataType: "text",
									tableId: "pt",
									uId: "93aa",
								},
							],
						},
						{
							name: "Measure",
							fields: [
								{
									fieldname: "profit",
									displayname: "profit",
									dataType: "decimal",
									tableId: "pt",
									uId: "a481",
									agg: "sum",
								},
							],
						},
					],
					selectedDs: {
						friendly_name: "one big table",
						dc_uid: "post",
						ds_uid: "3tgLpg",
					},
					selectedTable: {
						dspost: "s",
						"3tgLpg": "pt",
					},
					titleOptions: {
						fontSize: 28,
						chartTitle: "Profit by category",
						generateTitle: "Auto",
					},
					chartOptionSelected: "Colors",
					reUseData: false,
				},
			},
			propList: {
				1: ["1.1", "1.2"],
			},
		},
		chartControl: {
			properties: {
				1.1: {
					chartData: {
						query: "SELECT \n\tEXTRACT(YEAR FROM pt.delivery_date)::INTEGER AS delivery_date__year,\n\tSUM(pt.sales) AS sales__sum,\n\tSUM(pt.profit) AS profit__sum\nFROM\n\tpos_denormalized.pos_transaction AS pt\nGROUP BY\n\tEXTRACT(YEAR FROM pt.delivery_date)::INTEGER\nORDER BY\n\tEXTRACT(YEAR FROM pt.delivery_date)::INTEGER",
						result: [
							{
								delivery_date__year: 2018,
								sales__sum: 1330367,
								profit__sum: 358461.25,
							},
							{
								delivery_date__year: 2019,
								sales__sum: 2050585,
								profit__sum: 540814.75,
							},
							{
								delivery_date__year: 2020,
								sales__sum: 2489705.5,
								profit__sum: 671087.5,
							},
							{
								delivery_date__year: 2021,
								sales__sum: 2245978.5,
								profit__sum: 681831,
							},
							{
								delivery_date__year: 2022,
								sales__sum: 270,
								profit__sum: 45,
							},
						],
					},
					colorScheme: "walden",
					legendOptions: {
						showLegend: true,
						moveSlider: "Width",
						symbolWidth: 20,
						symbolHeight: 20,
						itemGap: 10,
						position: {
							pos: "Top",
							top: "top",
							left: "center",
						},
						orientation: "horizontal",
					},
					chartMargin: {
						selectedMargin: "top",
						top: 30,
						right: 5,
						bottom: 25,
						left: 65,
					},
					mouseOver: {
						enable: true,
					},
					axisOptions: {
						xSplitLine: false,
						ySplitLine: true,
						axisMinMax: {
							enableMin: false,
							minValue: 0,
							enableMax: false,
							maxValue: 10000,
						},
					},
				},
				1.2: {
					chartData: {
						query: "SELECT \n\tpt.category AS category,\n\tSUM(pt.profit) AS profit__sum\nFROM\n\tpos_denormalized.pos_transaction AS pt\nGROUP BY\n\tpt.category\nORDER BY\n\tpt.category",
						result: [
							{
								category: "Books",
								profit__sum: 222970,
							},
							{
								category: "Electronics",
								profit__sum: 682360,
							},
							{
								category: "Home Appliances",
								profit__sum: 189325,
							},
							{
								category: "Sports",
								profit__sum: 1047469,
							},
							{
								category: "Stationery",
								profit__sum: 110115.5,
							},
						],
					},
					colorScheme: "walden",
					legendOptions: {
						showLegend: true,
						moveSlider: "Item Width",
						symbolWidth: 25,
						symbolHeight: 25,
						itemGap: 2,
					},
					chartMargin: {
						selectedMargin: "top",
						top: 30,
						right: 5,
						bottom: 5,
						left: 50,
					},
					mouseOver: {
						enable: true,
					},
					axisOptions: {
						xSplitLine: false,
						ySplitLine: true,
						axisMinMax: {
							enableMin: false,
							minValue: 0,
							enableMax: false,
							maxValue: 10000,
						},
					},
				},
			},
			propList: {
				1: ["1.1", "1.2"],
			},
		},
	},
};
