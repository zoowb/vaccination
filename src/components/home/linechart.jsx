import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

const LineChart = ({check}) => {
  const [firstmonth , setFirstmonth] = useState([]);
  const [donemonth , setDonemonth] = useState([]);
  const [firstday, setFirstday] = useState([]);
  const [doneday, setDoneday] = useState([]);
  let now = new Date();
  let todayMonth = now.getMonth() + 1;
  let todayDate = now.getDate();

  const getData = () => {
    axios.post("/home/index")
    .then((response)=>{
      setFirstmonth(response.data.byMonth_vac1);
      setDonemonth(response.data.byMonth_vac2);
      setFirstday(response.data.byDay_vac1);
      setDoneday(response.data.byDay_vac2);
      console.log(response);
    })
    .catch((e)=>{
      console.log(e)
    });
  };

  useEffect(()=>{
    getData();
  }, []);
  
  const Makemontharr = () => {
    const montharr = [["1", "1차 접종", "완전 접종"]];
    if( donemonth.length != 0){
      for( let i=0; i<firstmonth.length; i++){
           montharr.push([`${(todayMonth-4)+i}`, firstmonth[(firstmonth.length-5)+i].count, donemonth[(donemonth.length-5)+i].count]);
      }
    }

    return <Chart width={"511px"} height={"300px"} chartType="LineChart" loader={<div>Loading Chart</div>} data={montharr}
    options={{ colors: ['#5064C5', '#CD2A82'], chartArea: { width: "80%", height: "80%" },}}
    />
  }

  const Makedayarr = () => {
  const dayarr = [["1", "1차 접종", "완전 접종"]];
    console.log("firstday:", firstday);
      for(let i=firstday.length-1; i>=0; i--){
        if(todayDate==firstday[i].day){
            console.log("i?==", i);
              for(let j=i-5; j<=i; j++){
                dayarr.push([`${firstday[j].month}/${(firstday[j].day)}`, firstday[j].count, doneday[j].count]);
              }
              break;
          }
      }
      console.log("배열만들어진거:", dayarr);
      return <Chart width={"511px"} height={"300px"} chartType="LineChart" loader={<div>Loading Chart</div>} data={dayarr}
      options={{ colors: ['#5064C5', '#CD2A82'], chartArea: { width: "80%", height: "80%" },}}
      />
    }

  return (
    <div className="chart">
      {check && firstmonth.length!=0 ? (
        <>
          <Makemontharr />
        </>
      ) : (
        <>
          <Makedayarr />
        </>

      )}
    </div>
  );
};

export default LineChart;