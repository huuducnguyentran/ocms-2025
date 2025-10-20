import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Spin, Button, Descriptions, message, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  getAllTrainees,
  getExternalCertificateByUserId,
} from "../../service/TraineeService";

export default function TraineeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  // Fetch trainee info
  useEffect(() => {
    const fetchTrainee = async () => {
      setLoading(true);
      try {
        const res = await getAllTrainees();
        if (res.success) {
          const found = res.data.find((t) => t.userId === id);
          if (found) setTrainee(found);
          else message.warning("Trainee not found.");
        } else {
          message.error(res.message || "Failed to load trainees.");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching trainees.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainee();
  }, [id]);

  // Fetch external certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!id) return;
      setLoadingCerts(true);
      try {
        const res = await getExternalCertificateByUserId(id);
        if (res.success) {
          setCertificates(res.data);
        } else {
          message.warning(res.message || "No certificates found.");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching certificates.");
      } finally {
        setLoadingCerts(false);
      }
    };
    fetchCertificates();
  }, [id]);

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#6C63FF",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-[#6C63FF]">
          Trainee Details
        </h2>
        <div />
      </div>

      {/* Trainee Info */}
      <Spin spinning={loading}>
        {trainee ? (
          <Card className="shadow-md rounded-md p-6 mb-8">
            <Descriptions
              title={trainee.fullName}
              bordered
              column={1}
              labelStyle={{ fontWeight: 600, width: 200 }}
            >
              <Descriptions.Item label="Trainee ID">
                {trainee.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {trainee.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {trainee.sex}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {trainee.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {trainee.status}
              </Descriptions.Item>
              <Descriptions.Item label="Address">-</Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          !loading && (
            <div className="text-center text-gray-500 text-lg">
              No trainee data found.
            </div>
          )
        )}
      </Spin>

      {/* External Certificates Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-[#6C63FF] mb-4">
          External Certificates
        </h3>
        <Spin spinning={loadingCerts}>
          {certificates && certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Card
                  key={cert.externalCertificateId}
                  onClick={() =>
                    navigate(
                      `/external-certificate/${cert.externalCertificateId}`
                    )
                  }
                  className="shadow-sm hover:shadow-md transition-all border border-[#EDEBFF] cursor-pointer"
                  style={{ borderRadius: "10px" }}
                >
                  <p className="text-[#6C63FF] font-semibold mb-1">
                    {cert.certificateCode}
                  </p>
                  <p className="text-gray-700 text-base">
                    {cert.certificateName}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            !loadingCerts && (
              <Empty
                description="No external certificates found."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          )}
        </Spin>
      </div>
    </div>
  );
}
