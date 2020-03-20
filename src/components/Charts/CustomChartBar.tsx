import React from "react";
import { Chart } from "react-google-charts";

export const CustomChartBar = ({ ...props }) => {
  const options = {
    // Material design options
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2014-2017"
    },
    animation: {
      startup: true,
      easing: "linear",
      duration: 1500
    }
  };

  const data = [
    ["Year", "Sales", "Expenses", "Profit"],
    ["2014", 1000, 400, 200],
    ["2015", 1170, 460, 250],
    ["2016", 660, 1120, 300],
    ["2017", 1030, 540, 350]
  ];

  return (
    <Chart
      width={"100%"}
      height={400}
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={data}
      options={options}
      chartEvents={[
        {
          eventName: "animationfinish",
          callback: () => {
            console.log("Animation Finished");
          }
        }
      ]}
      // For tests
      rootProps={{ "data-testid": "2" }}
    />
  );
};
