import React, { useEffect } from "react";

const data = [
	{ category: "Books", sub_category: "Biography", sales__sum: 80100.0 },
	{ category: "Books", sub_category: "Fiction", sales__sum: 75600.0 },
	{ category: "Books", sub_category: "For Kids", sales__sum: 75450.0 },
	{ category: "Books", sub_category: "For Young Adults", sales__sum: 129700.0 },
	{ category: "Books", sub_category: "Indian Fiction", sales__sum: 51250.0 },
	{ category: "Books", sub_category: "Regional", sales__sum: 59300.0 },
	{ category: "Books", sub_category: "Self Help", sales__sum: 56550.0 },
	{ category: "Books", sub_category: "Thriller", sales__sum: 86500.0 },
	{ category: "Electronics", sub_category: "Gaming Console", sales__sum: 2839500.0 },
	{ category: "Electronics", sub_category: "Headphone", sales__sum: 190300.0 },
	{ category: "Electronics", sub_category: "Laptop", sales__sum: 150000.0 },
	{ category: "Electronics", sub_category: "Monitor", sales__sum: 354500.0 },
	{ category: "Electronics", sub_category: "Mouse", sales__sum: 35500.0 },
	{ category: "Electronics", sub_category: "Pen Drive", sales__sum: 63350.0 },
	{ category: "Home Appliances", sub_category: "Mixer Grinder", sales__sum: 52000.0 },
	{ category: "Home Appliances", sub_category: "Refrigerator", sales__sum: 286250.0 },
	{ category: "Home Appliances", sub_category: "TV", sales__sum: 398950.0 },
	{ category: "Home Appliances", sub_category: "Washing Machine", sales__sum: 126500.0 },
	{ category: "Sports", sub_category: "Balls", sales__sum: 64660.0 },
	{ category: "Sports", sub_category: "Bats & Racquets", sales__sum: 329700.0 },
	{ category: "Sports", sub_category: "Cloths", sales__sum: 248900.0 },
	{ category: "Sports", sub_category: "Cycles", sales__sum: 708500.0 },
	{ category: "Sports", sub_category: "Outdoor", sales__sum: 671500.0 },
	{ category: "Sports", sub_category: "Shoes", sales__sum: 637000.0 },
	{ category: "Stationery", sub_category: "File & Folder", sales__sum: 8540.0 },
	{ category: "Stationery", sub_category: "Label", sales__sum: 11010.0 },
	{ category: "Stationery", sub_category: "Marker", sales__sum: 4377.5 },
	{ category: "Stationery", sub_category: "Notebook", sales__sum: 31415.0 },
	{ category: "Stationery", sub_category: "Pen", sales__sum: 60773.0 },
	{ category: "Stationery", sub_category: "Pencil", sales__sum: 16505.5 },
	{ category: "Stationery", sub_category: "Poster", sales__sum: 42525.0 },
	{ category: "Stationery", sub_category: "Umbrella", sales__sum: 170200.0 },
];

const data2 = [
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Che Guevara Biography",
		sales__sum: 15200,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Gandhi Biography",
		sales__sum: 2700,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Homi Baba Biography",
		sales__sum: 9600,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Indragandhi Biography",
		sales__sum: 9000,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Kamaraj Biography",
		sales__sum: 6300,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Nehru Biography",
		sales__sum: 2500,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Netaji Biography",
		sales__sum: 7400,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Ramanujam Biography",
		sales__sum: 9000,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "Tata Biography",
		sales__sum: 5200,
	},
	{
		category: "Books",
		sub_category: "Biography",
		product_name: "VOC Biography",
		sales__sum: 13200,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "A Time to Kill",
		sales__sum: 3600,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "jurassic Park",
		sales__sum: 6600,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Master of the Game",
		sales__sum: 8750,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Memories of Midnight",
		sales__sum: 7200,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Moonshine",
		sales__sum: 7200,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Next",
		sales__sum: 4750,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Nothing Lasts for Ever",
		sales__sum: 5250,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Prey",
		sales__sum: 6250,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Sycamore Row",
		sales__sum: 10000,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Tell Me Your Dreams",
		sales__sum: 3300,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "The Firm",
		sales__sum: 8800,
	},
	{
		category: "Books",
		sub_category: "Fiction",
		product_name: "Wolfs Stratum",
		sales__sum: 3900,
	},

	{
		category: "Books",
		sub_category: "Thriller",
		product_name: "Sherlock Holmes Vol 1",
		sales__sum: 12400,
	},
	{
		category: "Books",
		sub_category: "Thriller",
		product_name: "Sherlock Holmes Vol 2",
		sales__sum: 6400,
	},
	{
		category: "Electronics",
		sub_category: "Gaming Console",
		product_name: "Play Station 4",
		sales__sum: 405000,
	},
	{
		category: "Electronics",
		sub_category: "Gaming Console",
		product_name: "Play Station 5",
		sales__sum: 540000,
	},
	{
		category: "Electronics",
		sub_category: "Gaming Console",
		product_name: "Xbox 360",
		sales__sum: 819000,
	},
	{
		category: "Electronics",
		sub_category: "Gaming Console",
		product_name: "Xbox One",
		sales__sum: 607500,
	},
	{
		category: "Electronics",
		sub_category: "Gaming Console",
		product_name: "Xbox X",
		sales__sum: 468000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Earphone",
		sales__sum: 15600,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Earphone with Mic",
		sales__sum: 6000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Headphone",
		sales__sum: 16000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Headphone Extra Bass",
		sales__sum: 28600,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Headphone Noiseless",
		sales__sum: 12000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "JBL Headphone with Mic",
		sales__sum: 9100,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "LG Headphone Bluetooth",
		sales__sum: 45000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "LG Headphone Wired",
		sales__sum: 42000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "Samsung Earphone with Mic",
		sales__sum: 6000,
	},
	{
		category: "Electronics",
		sub_category: "Headphone",
		product_name: "Samsung Headphone with Mic",
		sales__sum: 10000,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "HP Gaming Laptop",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "HP Pavilion Laptop 1TB 8 GB 14 Inch",
		sales__sum: 36000,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "HP Pavilion Laptop 2TB 8 GB 15.8 Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "HP Pavilion Laptop 2TB 8 GB 15.8 Inch Windows",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "Samsung 500 GB 8GB 14 Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "Samsung 500 GB 8GB 15.8 Inch",
		sales__sum: 34000,
	},
	{
		category: "Electronics",
		sub_category: "Laptop",
		product_name: "Samsung Pavilion Laptop 1TB 8 GB 14 Inch",
		sales__sum: 80000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "HP Monitor 28 Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "HP Monitor 32Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "HP Monitor 36 Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "HP Monitor 40 Inch",
		sales__sum: 32000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "LG Monitor 28 Inch",
		sales__sum: 6000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "LG Monitor 32Inch Thin Frame",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "LG Monitor 36 Inch Curve",
		sales__sum: 16000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Philips Monitor 28 Inch",
		sales__sum: 81000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Philips Monitor 32Inch",
		sales__sum: null,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Samsung Monitor 28 Inch",
		sales__sum: 28500,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Samsung Monitor 32Inch",
		sales__sum: 24000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Samsung Monitor 36 Inch",
		sales__sum: 28000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Samsung Monitor 42 Inch Curve",
		sales__sum: 54000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Sony Monitor 28 Inch",
		sales__sum: 20000,
	},
	{
		category: "Electronics",
		sub_category: "Monitor",
		product_name: "Sony Monitor 32Inch",
		sales__sum: 65000,
	},
];

var data3 = [
	{
		category: "c1",
		sub_category: "c1s1",
		sales__sum: 100,
	},
	{
		category: "c1",
		sub_category: "c1s2",
		sales__sum: 100,
	},
	{
		category: "c1",
		sub_category: "c1s3",
		sales__sum: 100,
	},
	{
		category: "c2",
		sub_category: "c2s1",
		sales__sum: 100,
	},
	{
		category: "c2",
		sub_category: "c2s2",
		sales__sum: 100,
	},
	{
		category: "c2",
		sub_category: "c2s3",
		sales__sum: 100,
	},
	{
		category: "c3",
		sub_category: "c3s1",
		sales__sum: 100,
	},
	{
		category: "c3",
		sub_category: "c3s2",
		sales__sum: 100,
	},
	{
		category: "c3",
		sub_category: "c3s3",
		sales__sum: 100,
	},
];

const Treemap = () => {
	var dimensions = ["category", "sub_category", "product_name"];
	var measure = ["sales__sum"];

	const getUniqueValues = ({ key, data, iteration, finalArr }) => {
		if (iteration === dimensions.length - 1) {
			// exit condition
			console.log("Entering Final iteration");
			var finalArray = [];
			var total = 0;
			data.map((item) => {
				var obj = { name: item[dimensions[iteration]], value: item[measure[0]] };
				finalArray.push(obj);
				total = total + item[measure[0]];
			});
			console.log(finalArray);
			finalArr.children = finalArray;
			finalArr.value = total;
			return finalArr;
		} else {
			// get all unique values of dimension[0] eg. Category
			console.log("Iteration : ", iteration, "\nKey : ", key);
			var tempValues = [];
			data.forEach((item) => tempValues.push(item[key]));
			var uniqueValues = [...new Set(tempValues)];
			console.log(uniqueValues);

			let formattedValue = [];

			uniqueValues.forEach((val) => {
				console.log([dimensions[iteration]]);
				console.log(key, iteration, val);
				var dataSubset = data.filter((dt) => dt[dimensions[iteration]] === val);
				console.log(dataSubset);
				const itrObj = { name: dataSubset[0][dimensions[iteration]], value: "" };

				var childArr = getUniqueValues({
					key: dimensions[iteration + 1],
					data: dataSubset,
					iteration: iteration + 1,
					finalArr: itrObj,
				});
				console.log(childArr);

				formattedValue.push(childArr);
			});
			console.log("=====================");
			console.log(formattedValue);
		}
	};

	const buildRecursiveData = () => {
		var dataFormatted = getUniqueValues({
			key: dimensions[0],
			data: data3,
			iteration: 0,
			finalArr: [],
		});

		console.log(dataFormatted);
	};

	useEffect(() => {
		buildRecursiveData();
	}, []);

	return <div>Treemap</div>;
};

export default Treemap;
