import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const LineChart = ({check}) => {
  const [monthfirst , setMonthfirst] = useState([]);
  const [monthcomplete , setMonthcomplete] = useState([]);
  const [firstlength, setFirstlength] = useState(0);

  const getMonth = () => {
    axios.post("/home/index")
    .then((response)=>{
      setMonthfirst(response.data.byMonth_vac1);
      setFirstlength(response.data.byMonth_vac1.length);
      console.log("1==",monthfirst[firstlength].count);
    })
    .catch((e)=>{
      console.log(e)
    });
  };

  useEffect(()=>{
    getMonth();
  }, []);

  return (
    <div className="chart">
      {check ? (
        <>
          <Chart
            width={"511px"}
            height={"300px"}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[["1", "1차 접종", "완전접종"], ["1", 10, 20], ["3", 20, 20]]}
            options={{
              colors: ['#5064C5', '#CD2A82'],
              chartArea: { width: "80%", height: "80%" },
            }}
          />
        </>
      ) : (
        <>
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
        </>

      )}
    </div>
  );
};

export default LineChart;