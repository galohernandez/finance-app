import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetTransactionsQuery,
  useGetProductsQuery,
  useGetKpisQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";

import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";


interface CategoryTranslations {
  [key: string]: string;
}

const categoryTranslations: CategoryTranslations = {
  salaries: "salarios",
  supplies: "inventario",
  services: "servicios",
};

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];
  const { data: transactionData } = useGetTransactionsQuery(); // se usa el Transactions Query
  const { data: productData } = useGetProductsQuery(); // se usa el Product
  const { data: kpiData } = useGetKpisQuery(); // se usa tambios los KPIs

  // console.log("transactionData:", transactionData);

  // data para piechartdata
  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);
  //fin de data para piechart data

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Gasto",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Precio",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  //columnas para transactions
  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Comprador",
      flex: 0.67,
      // renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Q(t)",
      flex: 0.1,

      renderCell: (params: GridCellParams) => {
        if (Array.isArray(params.value)) {
          return (params.value as Array<string>).length;
        } else {
          // return or handle some default value when params.value is not an array
          return 0;
        }
      },
    },
  ];
  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="Lista de Productos"
          sideText={`${productData?.length} productos`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            // esta es la forma de cambiar estilos del datagrid de MaterialUI, debe ser desde una box
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            rows={productData || []}
            columns={productColumns}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Listado de Transacciones"
          sideText={`${transactionData?.length} últimas transacciones`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            // esta es la forma de cambiar estilos del datagrid de MaterialUI, debe ser desde una box
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            rows={transactionData || []}
            columns={transactionColumns}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader title="Gastos por Categoría" sideText="2022" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => {
            const translatedName =
              categoryTranslations[data[0].name] || data[0].name;
            return (
              <Box key={`${translatedName}-${i}`}>
                <PieChart width={100} height={70}>
                  <Pie
                    data={data}
                    stroke="none"
                    innerRadius={15}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
                <Typography variant="h6">{translatedName}</Typography>
              </Box>
            );
          })}
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="j">
        <BoxHeader title="Resumen general de operaciones" sideText="2022" />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width="40%"
          ></Box>
        </Box>
        <Typography margin="1.0rem" variant="h6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra
          vestibulum lorem et congue. Integer molestie orci at ipsum efficitur
          lobortis. 
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
