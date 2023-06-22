import DashboardBox from '@/components/DashboardBox'
import FlexBetween from '@/components/FlexBetween'
import { useGetKpisQuery } from '@/state/api'
import { useTheme, Box, Typography, Button } from '@mui/material'
import {useMemo, useState} from 'react'
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import regression, {DataPoint} from "regression"


const keyMap = {
    "Actual Revenue": "Ganancias Actuales",
    "Regression Line": "Línea de Regresión",
    "Predicted Revenue": "Ganancias Previstas",
  };

const Predictions = () => {
    const {palette} = useTheme() //colores
    const [isPredictions, setIsPredictions] = useState(false) // boton de predictions
    const {data: kpiData} = useGetKpisQuery() // la data que se va usar

    const formattedData = useMemo(()=> {
        if(!kpiData)return [];
        const monthData = kpiData[0].monthlyData;
        const formatted: Array<DataPoint> = monthData.map(({revenue}, i:number) => {
            return [i, revenue] //la libreria regreesion requiere x y y por eso los dos valores
        });
        const regressionLine = regression.linear(formatted)
        return monthData.map(({month, revenue}, i:number) => {
            return {
                name: month,
                [keyMap["Actual Revenue"]] : revenue,
                [keyMap["Regression Line"]] : regressionLine.points[i][1],
                [keyMap["Predicted Revenue"]] : regressionLine.predict(i+12)[1]
            }
        })

    }, [kpiData])

  return (
   <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
    <FlexBetween m="1rem 2.5rem" gap="0.3rem">
        <Box>
            <Typography variant="h3">Ganancias vs Predcciones</Typography>
            <Typography variant="h6">Regresión lineal para Ganancias vs Predicciones: alcance de 1 año </Typography>
        </Box>
        <Button
            onClick={() => setIsPredictions(!isPredictions)}
            sx={{
                color: palette.grey[900],
                bgcolor: palette.grey[700],
                boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,0.4)"
            }}
        >
            Mostrar predicción para el proximo año
        </Button>
    </FlexBetween>
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData} //data
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{fontSize: "10px"}}>
            <Label value="Mes" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis 
            domain={[12000, 26000]}
            axisLine={{strokeWidth: "0"}} 
            tickFormatter={(v)=> `$${v}`}
            style={{fontSize: "10px"}}>
            <Label value="Ganancia en USD" angle={-90} offset={-5} position="insideLeft"/>
          </YAxis>
          
          <Tooltip />
          <Legend verticalAlign='top' />
          <Line 
            type="monotone" 
            // dataKey="Actual Revenue" 
            dataKey={keyMap["Actual Revenue"]} 
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{strokeWidth: 5}}
            />
          <Line 
            type="monotone" 
            // dataKey="Regression Line" 
            dataKey={keyMap["Regression Line"]} 
            stroke= "#8884d8" 
            dot={false}
            /> 
            {isPredictions && (
                <Line 
                strokeDasharray="5 5"
                // dataKey="Predicted Revenue" 
                dataKey={keyMap["Predicted Revenue"]} 
                stroke= "#f2b455"
                
                /> 
            )}
        </LineChart>
      </ResponsiveContainer>
   </DashboardBox> 
   
  )
}

export default Predictions