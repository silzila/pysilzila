import * as echarts from "echarts";
import { chalk } from "./chalk";
import { dark } from "./dark";
import { essos } from "./essos";
import { halloween } from "./halloween";
import { infographic } from "./infographic";
import { macarons } from "./macarons";
import { purplePassion } from "./purplePassion";
import { roma } from "./roma";
import { shine } from "./shine";
import { vintage } from "./vintage";
import { walden } from "./walden";
import { westeros } from "./westeros";
import { wonderland } from "./wonderland";

const ChartThemes = () => {
	echarts.registerTheme("chalk", chalk.theme);
	echarts.registerTheme("dark", dark.theme);
	echarts.registerTheme("essos", essos.theme);
	echarts.registerTheme("halloween", halloween.theme);
	echarts.registerTheme("infographic", infographic.theme);
	echarts.registerTheme("macarons", macarons.theme);
	echarts.registerTheme("purplePassion", purplePassion.theme);
	echarts.registerTheme("roma", roma.theme);
	echarts.registerTheme("shine", shine.theme);
	echarts.registerTheme("vintage", vintage.theme);
	echarts.registerTheme("walden", walden.theme);
	echarts.registerTheme("westeros", westeros.theme);
	echarts.registerTheme("wonderland", wonderland.theme);

	return null;
};

export default ChartThemes;
