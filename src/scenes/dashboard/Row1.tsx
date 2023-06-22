import BoxHeader from '@/components/BoxHeader'
import DashboardBox from '@/components/DashboardBox'
import { useGetKpisQuery } from '@/state/api'
import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import { Area, Line,  AreaChart, LineChart, BarChart, Bar,  ResponsiveContainer, Tooltip, XAxis, YAxis , CartesianGrid, Legend } from 'recharts'

const keyMap = {
  "name": "nombre",
  "revenue": "ingresos",
  "expenses": "gastos",
  "profit": "ganancias"
}

const Row1 = () => {
  const {palette} = useTheme()
  const {data} = useGetKpisQuery()
  // console.log('data:', data)
  
  //data para grid A
  const revenueExpenses = useMemo(() => {
    return(
      data &&
      data[0].monthlyData.map(({month, revenue, expenses}) => {
        return {
          [keyMap["name"]]: month.substring(0 , 3),
          [keyMap["revenue"]]: revenue,
          [keyMap["expenses"]]: expenses
        }
      })
    )
  }, [data])

// data para grid B
const revenueProfit = useMemo(() => {
  return(
    data &&
    data[0].monthlyData.map(({month, revenue, expenses}) => {
      return {
        [keyMap["name"]]: month.substring(0 , 3),
        [keyMap["revenue"]]: revenue,
        [keyMap["profit"]]: (revenue - expenses).toFixed(2), //unico cambio de calculo
      }
    })
  )
}, [data])

// data para grid C
const revenue = useMemo(() => {
  return(
    data &&
    data[0].monthlyData.map(({month, revenue}) => {
      return {
        [keyMap["name"]]: month.substring(0 , 3),
        [keyMap["revenue"]]: revenue,
       
      }
    })
  )
}, [data])

  return (
    <>
      <DashboardBox gridArea="a">
       <BoxHeader 
       title='Ingresos vs Gastos'
       subtitle='Linea superior representa Ingresos, la inferior Gastos'
       sideText='2022'

       />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={revenueExpenses} //data
          margin={{
            top: 15,
            right: 25,
            left: -10,
            bottom: 60,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"> 
              <stop offset="5%" stopColor="#71f5de" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#71f5de" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1"> 
              <stop offset="5%" stopColor="#71f5de" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#71f5de" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={keyMap["name"]} tickLine={false} style={{fontSize: "10px"}} />
          <YAxis tickLine={false} axisLine={{strokeWidth: "0"}} style={{fontSize: "10px"}} domain={[8000, 23000]}/>
          <Tooltip />
          <Area type="monotone" dataKey={keyMap["revenue"]} dot={true} stroke={palette.primary.main} fillOpacity={1}  fill="url(#colorRevenue)" />
          <Area type="monotone" dataKey={keyMap["expenses"]} dot={true} stroke={palette.primary.main} fillOpacity={1}  fill="url(#colorExpenses)" /> 
        </AreaChart>
      </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
      <BoxHeader 
       title='Ingresos vs Ganancias'
       subtitle='Linea superior representa los Ingresos, inferior las ganancias'
       sideText='2022'

       />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          // width={500}
          // height={400}
          data={revenueProfit} //data
          margin={{
            top: 20,
            right: 0,
            left: -10,
            bottom: 55,
          }}
        >
          <CartesianGrid vertical={false} stroke={palette.grey[800]} />
          {/* <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"> 
              <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.5} />
              <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
            </linearGradient>
          </defs> */}
          <XAxis dataKey={keyMap["name"]} tickLine={false} style={{fontSize: "10px"}} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} style={{fontSize: "10px"}}/>
          <YAxis yAxisId="right" orientation='right' tickLine={false} axisLine={false} style={{fontSize: "10px"}}/>
          <Tooltip />
          <Legend height={20} wrapperStyle={{margin: '0 0 10px 0'}} />
          <Line yAxisId="left" type="monotone" dataKey={keyMap["profit"]} stroke="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey={keyMap["revenue"]} stroke={palette.primary.main} /> 
        </LineChart>
      </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="c">
      <BoxHeader 
       title='Ingresos mes x mes'
       subtitle='Grafico representa ingresos mes por mes'
       sideText='2022'
       />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={revenue}
          margin={{
            top: 17,
            right: 15,
            left: -5,
            bottom: 58,
          }}
        >
          <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"> 
              <stop offset="5%" stopColor="#71f5de" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#71f5de" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={palette.grey[800]} style={{fontSize: '10px'}} />
          <XAxis dataKey={keyMap["name"]} axisLine={false} tickLine={false} style={{fontSize: '10px'}}/>
          <YAxis axisLine={false} tickLine={false} style={{fontSize: '10px'}}/>
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey={keyMap["revenue"]} fill="url(#colorRevenue)" />
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
      </DashboardBox>
    </>
  )
}

export default Row1