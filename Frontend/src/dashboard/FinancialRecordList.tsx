import React, { useMemo, useState, useEffect } from "react";
import { useTable, Column } from "react-table";
import { FinancialRecord, useFinancialRecords } from "../context/financial-record-context";
import { MdDelete } from "react-icons/md";
import { useSnackbar } from "notistack";
import "./FinancialRecordList.css";
import { CiExport } from "react-icons/ci";

const CATEGORY_OPTIONS = ["Food", "Transport", "Utilities", "Entertainment", "Healthcare"];
const PAYMENT_METHOD_OPTIONS = ["Credit Card", "Debit Card", "Cash", "Bank Transfer"];

interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnId: string;
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  rowIndex,
  columnId,
  updateRecord,
  editable,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    if (value !== initialValue) {
      updateRecord(rowIndex, columnId, value);
      enqueueSnackbar("Record updated successfully!", { variant: "success" });
    }
    setIsEditing(false);
  };

  const renderInput = () => {
    if (columnId === "category" || columnId === "paymentMethod") {
      const options = columnId === "category" ? CATEGORY_OPTIONS : PAYMENT_METHOD_OPTIONS;
      return (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          autoFocus
          style={{ width: "100%" }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
        style={{ width: "100%" }}
      />
    );
  };

  return isEditing ? (
    renderInput()
  ) : (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {value}
    </div>
  );
};

export const FinancialRecordList: React.FC = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const { enqueueSnackbar } = useSnackbar();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    if (id) {
      updateRecord(id, { ...records[rowIndex], [columnId]: value });
    }
  };

  const handleDelete = (recordId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      deleteRecord(recordId);
      enqueueSnackbar("Record deleted successfully!", { variant: "success" });
    }
  };

  const exportToCSV = () => {
    if (!records.length) {
      enqueueSnackbar("No records to export.", { variant: "info" });
      return;
    }

    const csvRows = [];
    const headers = ["Description", "Amount", "Category", "Payment Method", "Date"];
    csvRows.push(headers.join(","));

    records.forEach((record) => {
      const row = [
        record.description,
        record.amount,
        record.category,
        record.paymentMethod,
        new Date(record.date).toLocaleDateString(), // Format date here
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "financial_records.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      { Header: "Description", accessor: "description", editable: true },
      { Header: "Amount", accessor: "amount", editable: true },
      { Header: "Category", accessor: "category", editable: true },
      { Header: "Payment Method", accessor: "paymentMethod", editable: true },
      { Header: "Date", accessor: "date", Cell: ({ value }) => new Date(value).toLocaleDateString(), editable: false }, // Format date here
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original._id ?? "")}
            className="delete-button"
          >
            <MdDelete size={20} />
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: records });

  return (
    <div className="table-div">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {records.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No financial records to display.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id ?? row.index}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.column.id === "delete" ? (
                        cell.render("Cell")
                      ) : (
                        <EditableCell
                          value={cell.value}
                          rowIndex={row.index}
                          columnId={cell.column.id}
                          updateRecord={updateCellRecord}
                          editable={(cell.column as any).editable}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <button onClick={exportToCSV} className="export-button">
        <span><CiExport/></span>
      </button>
    </div>
  );
};

export default FinancialRecordList;
