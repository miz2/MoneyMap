import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTable, Column, CellProps } from 'react-table';
import { useInvestments } from '../context/expense-record-context';
import { MdDelete } from 'react-icons/md';
import { useSnackbar } from 'notistack'; // Import useSnackbar hook
import './InvestmentTable.css'; // Import CSS styles
import { CiExport } from 'react-icons/ci';

interface Investment {
  _id: string; // Ensure the ID field matches your backend
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  firm: string;
}

const InvestmentTable: React.FC<{ onInvestmentAdded: () => void }> = ({ }) => {
  const { investments, fetchInvestments, deleteInvestment } = useInvestments();
  const { enqueueSnackbar } = useSnackbar(); // Hook for notifications
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  useEffect(() => {
    const loadInvestments = async () => {
      setLoading(true);
      try {
        await fetchInvestments();
      } catch (error) {
        enqueueSnackbar('Error fetching investments.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadInvestments(); // Fetch the investments when the component is mounted
  }, [fetchInvestments, enqueueSnackbar]);

  const handleDelete = useCallback(async (investmentId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this investment?');
    if (confirmDelete) {
      try {
        await deleteInvestment(investmentId);
        enqueueSnackbar('Investment deleted successfully!', { variant: 'success' });
        await fetchInvestments(); // Refetch investments after deletion
      } catch (error) {
        enqueueSnackbar('Failed to delete investment.', { variant: 'error' });
      }
    }
  }, [deleteInvestment, enqueueSnackbar, fetchInvestments]);

  const exportToCSV = useCallback(() => {
    if (!investments.length) {
      enqueueSnackbar('No investments to export.', { variant: 'info' });
      return;
    }

    const csvRows = [];
    const headers = ['Description', 'Start Date', 'End Date', 'Amount', 'Firm'];
    csvRows.push(headers.join(','));

    investments.forEach((investment) => {
      const row = [
        investment.description,
        new Date(investment.startDate).toLocaleDateString(),
        new Date(investment.endDate).toLocaleDateString(),
        investment.amount.toLocaleString(),
        investment.firm,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'investments.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [investments, enqueueSnackbar]);

  const columns: Array<Column<Investment>> = useMemo(
    () => [
      { Header: 'Description', accessor: 'description' },
      { Header: 'Start Date', accessor: 'startDate', Cell: ({ value }: CellProps<Investment>) => new Date(value).toLocaleDateString() },
      { Header: 'End Date', accessor: 'endDate', Cell: ({ value }: CellProps<Investment>) => new Date(value).toLocaleDateString() },
      { Header: 'Amount', accessor: 'amount', Cell: ({ value }: CellProps<Investment>) => value.toLocaleString() },
      { Header: 'Firm', accessor: 'firm' },
      {
        Header: 'Delete',
        id: 'delete',
        Cell: ({ row }: { row: { original: { _id: string } } }) => (
          <button
            onClick={() => handleDelete(row.original._id)}
            className="delete-button"
            aria-label={`Delete investment ${row.original._id}`}
          >
            <MdDelete size={20} />
          </button>
        ),
      },
    ],
    [handleDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: investments });

  return (
    <div className="table-div">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No investments found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id ?? row.index}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} key={cell.column.id}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <button onClick={exportToCSV} className="export-button2">
            <CiExport /> 
          </button>
        </>
      )}
    </div>
  );
};

export default InvestmentTable;
