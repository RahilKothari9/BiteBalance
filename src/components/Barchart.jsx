import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../css/barchart.css';
const Barchart = () => {
  const [chartState] = useState({
    series: [
      {
        name: 'Calorie Intake',
        data: [2000, 1991, 2312, 1808, 1830, 1900,  2032,2123 ],
      },
     
     
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['28-Jan', '29-Jan', '30-Jan', '31-Jan', '1-Feb', '2-Feb', '3-Feb', '4-Feb'],
      },
      yaxis: {
        title: {
          text: 'Calories',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + 'kcal';
          },
        },
      },
    },
  });

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-6 border-2 border-black">
        <ReactApexChart className="w-100 barchart"options={chartState.options} series={chartState.series} type="bar" height={350}
          width={"300%"}
         />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Barchart;
