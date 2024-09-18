import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useParams } from 'react-router-dom';
import { fetchBatchData, fetchBatchUpdateTime } from '../utils/api'; // Assuming you have this API function
import ExcelJS from 'exceljs';
import { ColDef, ColGroupDef } from 'ag-grid-community';

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
}

const Leaderboard: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { database, collection } = useParams<{ database: string; collection: string }>();

  const numberSort = (num1: number, num2: number) => num1 - num2;
  const floatSort = (num1: number, num2: number) => parseFloat(num1.toString()) - parseFloat(num2.toString());

  const columnDefs = [
    { headerName: 'Rank', field: 'Rank', sortable: true, width: 100, comparator: numberSort, pinned: 'left', filter: 'agNumberColumnFilter'},
    { headerName: 'Handle', field: 'Handle', sortable: true, width: 150, pinned: 'left', filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'Codeforces Handle', field: 'Codeforces_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'Codeforces Rating', field: 'Codeforces_Rating', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter'},
    { headerName: 'GFG Handle', field: 'GFG_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'GFG Contest Score', field: 'GFG_Contest_Score', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter'},
    { headerName: 'GFG Practice Score', field: 'GFG_Practice_Score', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter'},
    { headerName: 'Leetcode Handle', field: 'Leetcode_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'Leetcode Rating', field: 'Leetcode_Rating', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter'},
    { headerName: 'Codechef Handle', field: 'Codechef_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'Codechef Rating', field: 'Codechef_Rating', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter'},
    { headerName: 'HackerRank Handle', field: 'HackerRank_Handle', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true},
    { headerName: 'HackerRank Practice Score', field: 'HackerRank_Practice_Score', sortable: true, comparator: numberSort, filter: 'agNumberColumnFilter', width: 260},
    { headerName: 'Percentile', field: 'Percentile', sortable: true, comparator: floatSort, filter: 'agNumberColumnFilter' }
  ] as (ColDef<RowData, any> | ColGroupDef<RowData>)[];

  useEffect(() => {
    if (database && collection) {
      const fetchData = async () => {
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
            Leetcode_Rating: row.leetcodeRating,
            Codechef_Handle: row.codechefUsername,
            Codechef_Rating: row.codechefRating,
            HackerRank_Handle: row.hackerrankUsername,
            HackerRank_Practice_Score: row.hackerrankRating,
            Percentile: row.Percentile,
            TotalRating: row.TotalRating,
          }));
          setRowData(data);
          
          // Fetch last updated time
          const updateResponse = await fetchBatchUpdateTime(database, collection);
          setLastUpdated(updateResponse.data.lastUpdateTime || null);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [database, collection]);

  const onExportClick = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leaderboard');

    // Define column headers
    worksheet.columns = [
      { header: 'Rank', key: 'Rank', width: 10 },
      { header: 'Handle', key: 'Handle', width: 30 },
      { header: 'Codeforces Handle', key: 'Codeforces_Handle', width: 20 },
      { header: 'Codeforces Rating', key: 'Codeforces_Rating', width: 20 },
      { header: 'GFG Handle', key: 'GFG_Handle', width: 20 },
      { header: 'GFG Contest Score', key: 'GFG_Contest_Score', width: 20 },
      { header: 'GFG Practice Score', key: 'GFG_Practice_Score', width: 20 },
      { header: 'Leetcode Handle', key: 'Leetcode_Handle', width: 20 },
      { header: 'Leetcode Rating', key: 'Leetcode_Rating', width: 20 },
      { header: 'Codechef Handle', key: 'Codechef_Handle', width: 20 },
      { header: 'Codechef Rating', key: 'Codechef_Rating', width: 20 },
      { header: 'HackerRank Handle', key: 'HackerRank_Handle', width: 20 },
      { header: 'HackerRank Practice Score', key: 'HackerRank_Practice_Score', width: 20 },
      { header: 'Percentile', key: 'Percentile', width: 20 },
    ];

    // Add rows
    rowData.forEach(data => {
      worksheet.addRow(data);
    });

    // Save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LeaderboardExport.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }, [rowData]);

  return (
    <div className="w-full h-full bg-black text-white font-sans antialiased mt-8 md:mb-0 mb-16">
      <div className="container mx-auto p-4 bg-opacity-10 bg-white backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
        <div id="lastUpdated" className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Last Updated: <span className="text-blue-400">
              {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'N/A'}
            </span>
          </h2>
        </div>
        {database && collection ? (
          <>
            <div className="ag-theme-alpine-dark w-full h-[calc(100vh)] shadow-lg shadow-primary-950">
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
    </div>
  );
};

export default Leaderboard;
