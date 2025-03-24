import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import customersService from "../../../Services/CustomersService";
import { authStore } from "../../../Redux/AuthState";
import { toast } from "react-toastify";

export function BasicLineChart(): JSX.Element {
  const [type, setType] = useState<string>("חודשים")
  const [xValues, setXValues] = useState<string[]|number[]>(["טוען..."]);
  const [yValues, setYValues] = useState<number[]>([]); 

  useEffect(() => {
    getValues();
  }, [type]);

  const getValues = async () => {
    try {
      console.log("Fetching data for type:", type); // Log which type is being fetched

      const results = (type === 'חודשים' ) ? 
        await customersService.fetchBalancePerMonth(authStore.getState().user.userId):
        await customersService.fetchBalancePerYear(authStore.getState().user.userId);
        
      if ('months' in results) {
        const newXValues = results.months.map((value) => {
          const dateString = value.split('-');
          const year = dateString[0];
          const month = dateString[1];
          return `${month}/${year}`;
        });
        if (JSON.stringify(newXValues) !== JSON.stringify(xValues)) {
          setXValues(newXValues);
        }
      } else {
        if (JSON.stringify(results.years) !== JSON.stringify(xValues)) {
          setXValues(results.years.map((value) => {
            return value.toString()
          }));
        }
      }

      if (JSON.stringify(results.values) !== JSON.stringify(yValues)) {
        setYValues(results.values);
      }
    } catch(err) {
      toast.error(err);
    }
  };

  const toggleType = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setType(type === "חודשים" ? 'שנים' : 'חודשים');
  }

  return ( 
    <>
      <div>
        <h2> תצוגת יתרות לפי {type}</h2>
        <button onClick={toggleType}>לתצוגה לפי {type == 'חודשים' ? 'שנים' : 'חודשים'}</button>
      </div>
      
      {xValues ? (
        <LineChart
          xAxis={[{ 
            scaleType: "band", 
            data: xValues ,
            label: type === 'חודשים' ? "חודש" : 'שנה'
          }]}
          yAxis={[
            {
              position: "left",
              label: "יתרה",
            }
          ]}
          series={[{ data: yValues }]}
          width={700}
          height={350}
      />
            
       ) : (
        <p>טוען נתונים...</p>
      )}
    </>
  );
}
