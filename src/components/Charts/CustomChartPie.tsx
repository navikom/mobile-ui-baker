import React, { useState } from "react";
import { Chart } from "react-google-charts";

export const CustomChartPie = ({ ...props }) => {
  const [chartData] = useState([]);
  return (
    <Chart
      width="100%"
      height={props.height}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[["Task", "Available users"], ["Targeted", 90], ["Untargeted", 10]]}
      options={{
        title: props.title,
        animation: {
          startup: true,
          easing: "linear",
          duration: 1500
        },
        // Just add this option
        pieHole: 0.4,
        colors: props.colors
      }}
      chartEvents={[
        {
          eventName: "animationfinish",
          callback: () => {
            console.log("Animation Finished");
          }
        }
      ]}
      rootProps={{ "data-testid": "3" }}
    />
  );
};
