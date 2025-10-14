// src/pages/ImportTraineePage.jsx
import { useState } from "react";
import { read, utils } from "xlsx";
import { message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ImportTraineePage = () => {
  const [TraineeData, setTraineeData] = useState([]);
  const [externalCertifyData, setExternalCertifyData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [externalColumns, setExternalColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeSheet, setActiveSheet] = useState("Trainee"); // Toggle state

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);

      if (!file.type.includes("sheet") && !file.type.includes("excel")) {
        throw new Error("Only accept Excel (.xlsx, .xls) file.");
      }

      setSelectedFile(file);

      const data = await file.arrayBuffer();
      const workbook = read(data);

      // Trainee Sheet
      const traineeSheet = workbook.Sheets["Trainee"];
      if (!traineeSheet) throw new Error("Cannot find sheet 'Trainee'");

      const excelDateToJSDate = (serial) => {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        const day = String(date_info.getDate()).padStart(2, "0");
        const month = String(date_info.getMonth() + 1).padStart(2, "0");
        const year = date_info.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const jsonTrainee = utils.sheet_to_json(traineeSheet).map((row) => ({
        ...row,
        DateOfBirth:
          typeof row.DateOfBirth === "number"
            ? excelDateToJSDate(row.DateOfBirth)
            : row.DateOfBirth,
      }));

      if (jsonTrainee.length === 0) {
        throw new Error("'Trainee' sheet has no data");
      }

      const TraineeCols = Object.keys(jsonTrainee[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
      }));

      // External Certificate Sheet
      const externalCertifySheet = workbook.Sheets["ExternalCertificate"];
      const jsonExternalCertify = externalCertifySheet
        ? utils.sheet_to_json(externalCertifySheet)
        : [];
      const externalCols =
        jsonExternalCertify.length > 0
          ? Object.keys(jsonExternalCertify[0]).map((key) => ({
              title: key,
              dataIndex: key,
              key: key,
            }))
          : [];

      setColumns(TraineeCols);
      setExternalColumns(externalCols);
      setTraineeData(jsonTrainee);
      setExternalCertifyData(jsonExternalCertify);
    } catch (err) {
      console.error(err);
      setError("Error: " + err.message);
      message.error("Cannot read file.");
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-4xl text-gray-900 font-bold mb-4">
            Trainee Import Page
          </h2>

          {!TraineeData.length && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-all duration-200 ${
                isDragging
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-gray-300 hover:border-cyan-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <UploadOutlined className="text-4xl text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">Drag Excel File Here</p>
                  <label className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg cursor-pointer transition-colors duration-200">
                    <span className="ml-2">Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Only accept .xlsx or .xls files
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-semibold mb-2">
                    Error:
                  </p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          )}

          {TraineeData.length > 0 && (
            <div>
              {/* Switch View Tabs */}
              <div className="flex mb-4 space-x-3">
                <button
                  onClick={() => setActiveSheet("Trainee")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeSheet === "Trainee"
                      ? "!bg-cyan-600 !text-white"
                      : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
                  }`}
                >
                  Trainee ({TraineeData.length})
                </button>
                <button
                  onClick={() => setActiveSheet("ExternalCertificate")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeSheet === "ExternalCertificate"
                      ? "!bg-cyan-600 !text-white"
                      : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
                  }`}
                >
                  External Certificate ({externalCertifyData.length})
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {activeSheet === "Trainee"
                    ? `Trainee Data (${TraineeData.length})`
                    : `External Certificate Data (${externalCertifyData.length})`}
                </h2>
                <button
                  onClick={() => {
                    setTraineeData([]);
                    setExternalCertifyData([]);
                    setColumns([]);
                    setExternalColumns([]);
                    setSelectedFile(null);
                    setError(null);
                    setActiveSheet("Trainee");
                  }}
                  className="px-4 py-2 text-sm text-cyan-600 !bg-gray-200 hover:text-cyan-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Re-import
                </button>
              </div>

              {/* Table Rendering */}
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {(activeSheet === "Trainee"
                        ? columns
                        : externalColumns
                      ).map((col) => (
                        <th
                          key={col.key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(activeSheet === "Trainee"
                      ? TraineeData
                      : externalCertifyData
                    ).map((row, index) => {
                      const rowCols =
                        activeSheet === "Trainee" ? columns : externalColumns;
                      return (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          {rowCols.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {row[column.dataIndex] || "-"}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportTraineePage;
