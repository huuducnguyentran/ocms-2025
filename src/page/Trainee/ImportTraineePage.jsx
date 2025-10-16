// src/pages/ImportTraineePage.jsx
import { useState } from "react";
import { read, utils } from "xlsx";
import { message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { importTrainee } from "../../service/TraineeService";

const ImportTraineePage = () => {
  const [TraineeData, setTraineeData] = useState([]);
  const [externalCertifyData, setExternalCertifyData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [externalColumns, setExternalColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSheet, setActiveSheet] = useState("Trainees");
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null); // ✅ store API results

  // Convert Excel date serial number → dd/MM/yyyy
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const day = String(date_info.getDate()).padStart(2, "0");
    const month = String(date_info.getMonth() + 1).padStart(2, "0");
    const year = date_info.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /** ✅ Handle local file preview (no API here) */
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setImportResult(null);

      if (!file.type.includes("sheet") && !file.type.includes("excel")) {
        throw new Error("Only accept Excel (.xlsx, .xls) file.");
      }

      const data = await file.arrayBuffer();
      const workbook = read(data);

      // Parse "Trainee" sheet
      const traineeSheet = workbook.Sheets["Trainees"];
      if (!traineeSheet) throw new Error("Cannot find sheet 'Trainees'");

      const jsonTrainee = utils.sheet_to_json(traineeSheet).map((row) => ({
        ...row,
        DateOfBirth:
          typeof row.DateOfBirth === "number"
            ? excelDateToJSDate(row.DateOfBirth)
            : row.DateOfBirth,
      }));

      if (jsonTrainee.length === 0) {
        throw new Error("'Trainees' sheet has no data");
      }

      const TraineeCols = Object.keys(jsonTrainee[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
      }));

      // Parse "ExternalCertificate" sheet if exists
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
      setFile(file);

      message.success("Excel file loaded successfully!");
    } catch (err) {
      console.error(err);
      const msg =
        err.message || "Unknown error occurred while reading Excel file.";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  /** ✅ Confirm Import — call API here */
  const handleConfirmImport = async () => {
    if (!file) {
      message.warning("Please upload an Excel file first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImportResult(null);

      const response = await importTrainee(file);

      if (!response.success) {
        message.error(response.message || "Import failed from server.");
        setError(response.message);
        return;
      }

      message.success(response.message || "Import completed.");

      // ✅ Store import summary
      setImportResult(response.data);
    } catch (err) {
      console.error(err);
      const apiMessage =
        err.response?.data?.message ||
        err.message ||
        "Error during import request.";
      setError(apiMessage);
      message.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="p-8 w-full bg-white min-h-screen">
      <h2 className="text-lg font-semibold text-indigo-700 mb-6 w-full max-w-6xl">
        Import Trainee
      </h2>

      {/* --- UPLOAD SECTION --- */}
      {!TraineeData.length && (
        <div className="!flex !flex-1 !items-center !justify-center !w-full !mt-10">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`w-[1000px] h-[50vh] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
            }`}
          >
            <DownloadOutlined className="text-7xl text-indigo-600 mb-6" />
            <p className="text-xl text-indigo-700 font-semibold mb-4">
              Drag Excel File Here
            </p>

            <label className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-lg cursor-pointer transition-all">
              Import
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>

            <p className="text-sm text-gray-500 mt-4">
              Only accept .xlsx or .xls
            </p>
          </div>
        </div>
      )}

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="w-full max-w-5xl mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* --- LOADING --- */}
      {loading && (
        <div className="mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* --- PREVIEW SECTION --- */}
      {TraineeData.length > 0 && (
        <div className="!w-full !max-w-6xl !mt-8 !bg-white !shadow-lg !rounded-xl !p-6 !border !border-indigo-100">
          {/* SWITCH BUTTONS */}
          <div className="!flex !space-x-3 !mb-6">
            <button
              onClick={() => setActiveSheet("Trainee")}
              className={`!px-5 !py-2 !rounded-lg !text-sm !font-semibold !transition-all ${
                activeSheet === "Trainee"
                  ? "!bg-indigo-600 !text-white !shadow-md"
                  : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
              }`}
            >
              Trainee ({TraineeData.length})
            </button>
            <button
              onClick={() => setActiveSheet("ExternalCertificate")}
              className={`!px-5 !py-2 !rounded-lg !text-sm !font-semibold !transition-all ${
                activeSheet === "ExternalCertificate"
                  ? "!bg-indigo-600 !text-white !shadow-md"
                  : "!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
              }`}
            >
              External Certificate ({externalCertifyData.length})
            </button>
          </div>

          {/* TITLE + REIMPORT */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-700">
              {activeSheet === "Trainee"
                ? `Trainee Data (${TraineeData.length})`
                : `External Certificate Data (${externalCertifyData.length})`}
            </h3>
            <button
              onClick={() => {
                setTraineeData([]);
                setExternalCertifyData([]);
                setColumns([]);
                setExternalColumns([]);
                setError(null);
                setImportResult(null);
                setFile(null);
              }}
              className="!px-4 !py-2 !text-sm !text-white !bg-indigo-600 hover:!bg-indigo-700 rounded-lg !transition-all"
            >
              Re-import
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold">
                <tr>
                  {(activeSheet === "Trainee" ? columns : externalColumns).map(
                    (col) => (
                      <th key={col.key} className="px-4 py-3">
                        {col.title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {(activeSheet === "Trainee"
                  ? TraineeData
                  : externalCertifyData
                ).map((row, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition-all`}
                  >
                    {(activeSheet === "Trainee"
                      ? columns
                      : externalColumns
                    ).map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-2 text-gray-700 whitespace-nowrap"
                      >
                        {row[col.dataIndex] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ CONFIRM IMPORT BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={handleConfirmImport}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-all"
            >
              {loading ? "Importing..." : "Confirm Import"}
            </button>
          </div>
        </div>
      )}

      {/* ✅ IMPORT RESULT SECTION */}
      {importResult && (
        <div className="mt-10 max-w-6xl bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Import Summary
          </h3>

          {/* Trainee Result */}
          <div className="mb-6">
            <h4 className="font-semibold text-green-800 mb-2">
              Trainee Import
            </h4>
            <p>Total Rows: {importResult.traineeData.totalRows}</p>
            <p>Success: {importResult.traineeData.successCount}</p>
            <p>Failures: {importResult.traineeData.failureCount}</p>

            {importResult.traineeData.errors?.length > 0 && (
              <div className="mt-3 bg-white border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-700 mb-2">
                  Failure Details:
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-700">
                  {importResult.traineeData.errors.map((err, idx) => (
                    <li key={idx}>
                      Row {err.rowNumber}: {err.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* External Certificate Result */}
          <div>
            <h4 className="font-semibold text-green-800 mb-2">
              External Certificate Import
            </h4>
            <p>Total Rows: {importResult.externalCertificateData.totalRows}</p>
            <p>Success: {importResult.externalCertificateData.successCount}</p>
            <p>Failures: {importResult.externalCertificateData.failureCount}</p>

            {importResult.externalCertificateData.errors?.length > 0 && (
              <div className="mt-3 bg-white border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-700 mb-2">
                  Failure Details:
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-700">
                  {importResult.externalCertificateData.errors.map(
                    (err, idx) => (
                      <li key={idx}>
                        Row {err.rowNumber}: {err.reason}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportTraineePage;
