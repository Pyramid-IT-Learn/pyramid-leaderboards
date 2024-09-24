import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useParams } from 'react-router-dom';
import { fetchBatchData, fetchBatchUpdateTime } from '../utils/api';
import ExcelJS from 'exceljs';
import { ColDef } from 'ag-grid-community';

interface RowData {
  Rank: number;
  Handle: string;
  Codeforces_Handle: string;
  Codeforces_Rating: number;
  GFG_Handle: string;
  GFG_Contest_Score: number;
  GFG_Practice_Score: number;
  Leetcode_Handle: string;
  Leetcode_Rating: number;
  Codechef_Handle: string;
  Codechef_Rating: number;
  HackerRank_Handle: string;
  HackerRank_Practice_Score: number;
  Percentile: number;
  Codeforces_Status: boolean;
  GFG_Status: boolean;
  Leetcode_Status: boolean;
  Codechef_Status: boolean;
  HackerRank_Status: boolean;
}

const Leaderboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { database, collection } = useParams<{ database: string; collection: string }>();

  const getColor = (data?: RowData, field?: keyof Omit<RowData, 'Rank' | 'Handle'>) => {
    if (data && field) {
      const statusField = `${field.replaceAll('_Handle', '').replaceAll('_Rating', '').replaceAll('_Practice_Score', '').replaceAll('_Contest_Score', '')}_Status` as keyof RowData; // Cast to keyof RowData
      if (data[statusField]) {
        return { color: 'white' };
      }
    }
    return { color: 'red' };
  };

  const columnDefs: ColDef<RowData>[] = [
    { headerName: 'Rank', field: 'Rank', sortable: true, width: 100, pinned: 'left', filter: 'agNumberColumnFilter' },
    { headerName: 'Handle', field: 'Handle', sortable: true, width: 150, pinned: 'left', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Codeforces Handle', field: 'Codeforces_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellStyle: (params) => getColor(params.data, 'Codeforces_Handle') },
    { headerName: 'Codeforces Rating', field: 'Codeforces_Rating', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'Codeforces_Rating') },
    { headerName: 'GFG Handle', field: 'GFG_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellStyle: (params) => getColor(params.data, 'GFG_Handle') },
    { headerName: 'GFG Contest Score', field: 'GFG_Contest_Score', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'GFG_Contest_Score') },
    { headerName: 'GFG Practice Score', field: 'GFG_Practice_Score', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'GFG_Practice_Score') },
    { headerName: 'Leetcode Handle', field: 'Leetcode_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellStyle: (params) => getColor(params.data, 'Leetcode_Handle') },
    { headerName: 'Leetcode Rating', field: 'Leetcode_Rating', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'Leetcode_Rating') },
    { headerName: 'Codechef Handle', field: 'Codechef_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellStyle: (params) => getColor(params.data, 'Codechef_Handle') },
    { headerName: 'Codechef Rating', field: 'Codechef_Rating', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'Codechef_Rating') },
    { headerName: 'HackerRank Handle', field: 'HackerRank_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellStyle: (params) => getColor(params.data, 'HackerRank_Handle') },
    { headerName: 'HackerRank Practice Score', field: 'HackerRank_Practice_Score', sortable: true, filter: 'agNumberColumnFilter', cellStyle: (params) => getColor(params.data, 'HackerRank_Practice_Score') },
    { headerName: 'Percentile', field: 'Percentile', sortable: true, filter: 'agNumberColumnFilter' }
  ];  

  useEffect(() => {
    const fetchData = async () => {
      if (database && collection) {
        try {
          const response = await fetchBatchData(database, collection);
          const data = response.data.map((row: any, index: number) => ({
            Rank: index + 1,
            Handle: row.hallTicketNo,
            Codeforces_Handle: row.codeforcesUsername,
            Codeforces_Rating: row.codeforcesRating,
            GFG_Handle: row.geeksforgeeksUsername,
            GFG_Contest_Score: row.geeksforgeeksWeeklyRating,
            GFG_Practice_Score: row.geeksforgeeksPracticeRating,
            Leetcode_Handle: row.leetcodeUsername,
            Leetcode_Rating: row.leetcodeRating === null ? null : Number(row.leetcodeRating).toFixed(2),
            Codechef_Handle: row.codechefUsername,
            Codechef_Rating: row.codechefRating,
            HackerRank_Handle: row.hackerrankUsername,
            HackerRank_Practice_Score: row.hackerrankPracticeRating === null ? null : Number(row.hackerrankRating).toFixed(2),
            Percentile: row.percentile === null ? null : Number(row.Percentile).toFixed(2),
            Codeforces_Status: row.codeforcesStatus,
            GFG_Status: row.geeksforgeeksStatus,
            Leetcode_Status: row.leetcodeStatus,
            Codechef_Status: row.codechefStatus,
            HackerRank_Status: row.hackerrankStatus
          }));
          setRowData(data);

          // Fetch last updated time
          const updateResponse = await fetchBatchUpdateTime(database, collection);
          setLastUpdated(updateResponse.data.lastUpdateTime || null);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [database, collection]);

  const onExportClick = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leaderboard');
  
    // Define column headers
    worksheet.columns = [
      { header: 'Rank', key: 'Rank' },
      { header: 'Handle', key: 'Handle' },
      { header: 'Codeforces Handle', key: 'Codeforces_Handle' },
      { header: 'Codeforces Rating', key: 'Codeforces_Rating' },
      { header: 'GFG Handle', key: 'GFG_Handle' },
      { header: 'GFG Contest Score', key: 'GFG_Contest_Score' },
      { header: 'GFG Practice Score', key: 'GFG_Practice_Score' },
      { header: 'Leetcode Handle', key: 'Leetcode_Handle' },
      { header: 'Leetcode Rating', key: 'Leetcode_Rating' },
      { header: 'Codechef Handle', key: 'Codechef_Handle' },
      { header: 'Codechef Rating', key: 'Codechef_Rating' },
      { header: 'HackerRank Handle', key: 'HackerRank_Handle' },
      { header: 'HackerRank Practice Score', key: 'HackerRank_Practice_Score' },
      { header: 'Percentile', key: 'Percentile' },
    ];
  
    // Add rows with conditional coloring
    rowData.forEach(data => {
      const row = worksheet.addRow(data);
  
      // Apply red fill for cells based on status
      const columnsToColor = [
        'Codeforces_Handle',
        'Codeforces_Rating',
        'GFG_Handle',
        'GFG_Contest_Score',
        'GFG_Practice_Score',
        'Leetcode_Handle',
        'Leetcode_Rating',
        'Codechef_Handle',
        'Codechef_Rating',
        'HackerRank_Handle',
        'HackerRank_Practice_Score'
      ];
  
      columnsToColor.forEach(column => {
        const statusKey = `${column.split('_')[0]}_Status` as keyof RowData;
        if (data[statusKey] !== undefined && !data[statusKey]) {
          const cellIndex = worksheet.getColumn(column).number; // Get column index
          row.getCell(cellIndex).fill = {
            type: 'pattern',
            pattern: 'darkHorizontal',
            fgColor: { argb: 'FFC08080' }, // Light red fill
          };
        }
      });
    });

    // Header style
    worksheet.getRow(1).font = { bold: true };

    // Auto resize columns
    worksheet.columns.forEach(column => {
      if (column.header) {
        column.width = column.header.length * 1.2;
      }
    });

    // Save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Download with the file name being the collection name
    a.download = `${collection}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rowData, collection]);  

  return (
    <div className="container mx-auto p-4 bg-opacity-10 bg-grey backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
      <div id="lastUpdated" className="text-center mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Last Updated: <span className="text-blue-400">{lastUpdated ? new Date(lastUpdated).toLocaleString() : 'N/A'}</span>
        </h2>
      </div>
      {database && collection ? (
        <>
          <div className="ag-theme-alpine-dark w-full h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] shadow-lg shadow-primary-950">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
          <div className="text-center mt-4">
            <button
              onClick={onExportClick}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded shadow-lg shadow-primary-800 hover:shadow-primary-900 transition-colors duration-300"
            >
              Export to Excel
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-3xl font-bold text-gray-600 text-center">
            Please select a college and batch to view and manage leaderboards. 📊
          </p>
        </div>
      )}
      <div className="text-center mt-4">
        <h1 className="text-lg font-semibold">App By: <a href="https://www.instagram.com/gabyah92" className="text-primary-400 hover:underline">gabyah92</a> & <a href="https://github.com/dog-broad" className="text-primary-400 hover:underline">Rushyendra</a></h1>
      </div>
    </div>
  );
};

export default Leaderboard;
