import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";

export default function VerifyCertificatePage() {
  const [searchParams] = useSearchParams();
  const certId = searchParams.get("cert");
  const decisionNo = searchParams.get("decision");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        // Replace with your real API endpoint
        const response = await axios.get(
          `/api/Certificate/Verify?cert=${certId}&decision=${decisionNo}`
        );
        setData(response.data);
      } catch (err) {
        setError("Certificate not found or invalid.");
      } finally {
        setLoading(false);
      }
    }
    if (certId && decisionNo) fetchCertificate();
    else setLoading(false);
  }, [certId, decisionNo]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-gray-800 shadow-xl w-[900px] p-8 relative font-['Roboto']">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 text-[100px] text-red-500/10 font-bold -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none">
          VIETJET AIR
        </div>

        {/* Header */}
        <div className="flex justify-between text-xs mb-4">
          <div>
            CÔNG TY CỔ PHẦN HÀNG KHÔNG VIETJET<br />
            VIETJET AVIATION JOINT STOCK COMPANY
          </div>
          <div className="text-right">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
            Độc lập - Tự do - Hạnh phúc<br />
            SOCIALIST REPUBLIC OF VIETNAM<br />
            Independence-Freedom-Happiness
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-red-600 text-2xl font-bold mb-4">
          CHỨNG NHẬN / CERTIFICATE
        </h1>

        {/* Content */}
        <div className="flex mb-6">
          <div className="w-36 mr-4">
            <img
              src={
                data.photoUrl ||
                "https://via.placeholder.com/150?text=No+Photo"
              }
              alt="Participant"
              className="border border-black w-full"
            />
          </div>
          <div className="flex-1 text-base leading-relaxed">
            Chứng nhận Ông/Bà (This is to certify that Mr/Ms):{" "}
            <strong>{data.fullName || "____________________"}</strong>
            <br />
            Ngày sinh (Birthday):{" "}
            <strong>{data.birthday || "____________________"}</strong>
            <br />
            Đơn vị (Agency):{" "}
            <strong>
              {data.agency || "Vietjet Aviation Joint Stock Company"}
            </strong>
            <br />
            <br />
            Đã hoàn thành khóa học (Has passed the course of):<br />
            <strong>{data.courseName || "____________________"}</strong>
            <br />
            Từ ngày (from): <strong>{data.startDate || "__/__/____"}</strong> đến ngày (to):{" "}
            <strong>{data.endDate || "__/__/____"}</strong>
            <br />
            Kết quả (Result): <strong>{data.result || "____________________"}</strong>
          </div>
        </div>

        {/* Signature */}
        <div className="text-right mt-8">
          <div className="text-sm mb-2">
            TP. HCM, ngày {data.issueDate || "__/__/____"}<br />
            TUQ. TỔNG GIÁM ĐỐC<br />
            AUTHORIZED BY CHIEF EXECUTIVE OFFICER
          </div>
          <div className="border border-dashed border-gray-400 w-64 h-16 text-xs text-gray-500 mx-auto flex items-center justify-center">
            Vùng dành cho chữ ký số
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs mt-8">
          <div>
            Số Quyết định (Decision No.):{" "}
            <strong>{data.decisionNo || decisionNo || "__________"}</strong>
          </div>
          <div>
            Số vào sổ (Manual No.):{" "}
            <strong>{data.certId || certId || "__________"}</strong>
          </div>
        </div>

        {/* Error or Loading messages */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-700 text-lg font-medium">
            Đang tải thông tin chứng nhận...
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-red-600 text-lg font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
