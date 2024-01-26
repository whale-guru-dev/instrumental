import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC } from "react";

export type TableData = {
  asset: JSX.Element;
  apy: JSX.Element;
  tvl: JSX.Element;
  totalFees: JSX.Element;
  cta: JSX.Element;
};

type TableProps = {
  headers: Record<string, string>[];
  data: TableData[];
};

const MUITable: FC<TableProps> = ({ headers, data }) => {
  const theme = useTheme();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="table">
        <TableHead>
          <TableRow sx={{ my: 8 }}>
            {headers.map((header, index) => {
              let heading = null;
              if (Object.keys(header) === ["cta"]) {
                heading = <TableCell key={index} />;
              } else {
                heading = (
                  <TableCell key={index}>
                    <Typography color="GrayText" variant="body2">
                      {Object.values(header).toString()}
                    </Typography>
                  </TableCell>
                );
              }
              return heading;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((tableRow, tableRowIndex) => (
            <TableRow key={tableRowIndex}>
              {Object.values(tableRow).map((tableCell, tableCellIndex) => {
                return (
                  <TableCell
                    key={tableCellIndex}
                    sx={{
                      padding: theme.spacing(6, 0),
                    }}
                  >
                    {tableCell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MUITable;
