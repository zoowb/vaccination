import React from "react";
import { Chart } from "react-google-charts";

const LineChart = () => {
  return (
    <div className="chart">
      <Chart
        width={"511px"}
        height={"300px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["1","1차", "접종완료"],
          ["02/07", 0, 0],
          ["03/30", 20, 10],
          ["05/31", 27, 15],
          ["07/01", 30, 25],
          ["08/01", 33, 30],
          ["09/01", 50, 40],
          ["10/02", 70, 52],
        ]}
        options={{
          colors: ['#5064C5', '#CD2A82'],
          chartArea: { width: "80%", height: "80%" },
        }}
      />
    </div>
  );
};

export default LineChart;