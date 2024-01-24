import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';

interface Player {
  name: string;
  team: string;
  usg_pct: number;
  ts_pct: number;
  playoff_mp: number;
  playoff_usg_pct: number;
  playoff_ts_pct: number;
  playoff_mpg: number;
}

interface Case {
  state: string;
  year: number;
  bot_type: string;
  toxin_type: string;
  count: number;
  region: string;
}

async function main(): Promise<void> {
  // const res = await fetch("data/players_2023.json");
  // const data = (await res.json()) as Array<Player>;
  const data: Array<Case> = await d3.csv("data/Botulism_20240122.csv");

  const barchart = Plot.plot({
    inset: 8,
    grid: true,
    color: {
      legend: true,
      // type: "categorical",
      scheme: "OrRd"
    },
    x: {
      ticks: d3.range(1910, 2020, 10),
      // tickFormat: d => d.toString().replace(",", "")
    },
    marks: [
      // Plot.barY(data, {x: "Year", y: "Count", fill: "Count"})
      Plot.barY(data, Plot.groupX({y: "Count", fill: "Count"}, {x: "Year"})),
      Plot.ruleY([0])
    ]
  });

  document.querySelector("#plot")?.append(barchart);

  const region_chart = Plot.plot({
    inset: 8,
    grid: true,
    color: {
      legend: true,
      type: "categorical",
      scheme: "Viridis"
    },
    marks: [
      Plot.barY(data, 
                Plot.groupX({y: "Count"}, 
                            {x: "Region", fill: "BotType", sort: {x: "-y"}
                            /*, title: d => `Region: ${d.Region} \nBotType: ${d.BotType}`*/ })),
      Plot.ruleY([0])
    ]
  })

  document.querySelector("#plot")?.append(region_chart);

}

window.addEventListener("DOMContentLoaded", async (_evt) => {
  await main();
});
