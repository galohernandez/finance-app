import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetProductsQuery, useGetKpisQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const keyMap = {
  "Operational Expenses": "Gastos Operativos",
  "Non Operational Expenses": "Gastos No Operativos",
  "expense": "gastos",
  "price": "precios"
}

const pieData = [
  { name: "Group A", value: 300 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery(); // le llamo a la data como productData
  // console.log("data graphic d:", operationalData);

  // debo usar operationalData ya que si no Typscript se va a quejar que de donde saque month

  //data para grid D
  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            // "Operational Expenses": operationalExpenses,
            [keyMap["Operational Expenses"]]:operationalExpenses,
            [keyMap["Non Operational Expenses"]]: nonOperationalExpenses,

            // revenue: revenue,
            // expenses: expenses
          };
        }
      )
    );
  }, [operationalData]);

    //data para grid f
    const productExpenseData = useMemo(() => {
      return (
        productData &&
        productData.map(
          ({ _id, price, expense }) => {
            return {
              id: _id,
              [keyMap["price"]]: price,
              [keyMap["expense"]]: expense,
  
              // revenue: revenue,
              // expenses: expenses
            };
          }
        )
      );
    }, [productData]);

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Gastos operativos vs no operativos"
          sideText="2022"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // width={500}
            // height={400}
            data={operationalExpenses} //data
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
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            {/* <Legend height={20} wrapperStyle={{margin: '0 0 10px 0'}} /> */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={keyMap["Non Operational Expenses"]}
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={keyMap["Operational Expenses"]}
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="e">
        <BoxHeader title="Objetivos de campaña marketing" sideText="2022" />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={100}
            height={110}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              data={pieData}
              // cx={120}
              // cy={200}
              stroke="none"
              innerRadius={18}
              outerRadius={38}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          {/* FlexBasis es una version de width hecha para FlexBox y que se adapta de acuerdo a las circunstancias */}
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Objetivos de ventas</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              83
            </Typography>
            <Typography variant="h6">
              Objetivos deseados de la campaña
            </Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Pérdidas</Typography>
            <Typography variant="h6">Pérdidas por debajo del 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Margen de ganancias
            </Typography>
            <Typography variant="h6">
              Margen de ganancia es superior al 30%
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader title="Precios de productos vs gastos" sideText="2022" />
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 25,
              bottom: 40,
              left: -10,
            }}
          >
            <CartesianGrid stroke={palette.grey[800]} />
            <XAxis 
              type="number" 
              dataKey={keyMap["price"]} 
              name="precio" 
              // unit="u" 
              axisLine={false} 
              tickLine={false}
              style={{fontSize:"10px"}}
              tickFormatter={(v) => `$${v}`} // con esto se formatea x para incluir el simbolo de dolar
            />
            <YAxis 
              type="number" 
              dataKey={keyMap["expense"]} 
              name="gasto" 
              // unit="u" 
              axisLine={false} 
              tickLine={false}
              style={{fontSize:"10px"}}
              tickFormatter={(v) => `$${v}`} // con esto se formatea x para incluir el simbolo de dolar
            />
            <ZAxis type="number" range={[20]} />
            {/* <YAxis type="number" dataKey="y" name="weight" unit="kg" /> */}
            <Tooltip formatter={(v) => `$${v}`} />
            <Scatter name="Product Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
