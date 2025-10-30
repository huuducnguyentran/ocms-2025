// src/pages/TrainingPlanPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Spin, Badge, Empty, message, Drawer, Button } from "antd";
import {
  getAllPlans,
  getPlanWithCourseById,
} from "../../service/TrainingPlanService";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

/**
 * TrainingPlanPage
 * Left: list of plans as vertical cards
 * Right: selected plan full detail (all API fields)
 *
 * Date format: DD/MM/YYYY
 */
export default function TrainingPlanPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openCourseDrawer, setOpenCourseDrawer] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  // When selectedPlanId changes, load detail
  useEffect(() => {
    if (!selectedPlanId) return;
    loadDetail(selectedPlanId);
  }, [selectedPlanId]);

  const safeArrayFromResult = (res) => {
    // Accept either: array, { data: [...] }, { data: { data: [...] } }, etc.
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  };

  const safeObjectFromResult = (res) => {
    if (!res) return null;
    if (typeof res === "object" && !Array.isArray(res) && !res.data) return res;
    if (res.data && typeof res.data === "object" && !Array.isArray(res.data))
      return res.data;
    if (
      res.data?.data &&
      typeof res.data.data === "object" &&
      !Array.isArray(res.data.data)
    )
      return res.data.data;
    return null;
  };

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await getAllPlans();
      const arr = safeArrayFromResult(res);
      setPlans(arr);

      // auto-select first plan if exists
      if (arr.length > 0) {
        setSelectedPlanId(arr[0].planId || arr[0].id || null);
      } else {
        setSelectedPlanId(null);
        setDetail(null);
      }
    } catch (err) {
      console.error("Error loading plans:", err);
      message.error("Failed to load plans.");
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadDetail = async (planId) => {
    if (!planId) return;
    try {
      setLoadingDetail(true);
      const res = await getPlanWithCourseById(planId);
      const obj = safeObjectFromResult(res);
      setDetail(obj);
    } catch (err) {
      console.error("Error loading plan detail:", err);
      message.error("Failed to load plan detail.");
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (isoOrDateStr) => {
    if (!isoOrDateStr) return "-";
    try {
      const d = new Date(isoOrDateStr);
      if (isNaN(d)) return isoOrDateStr;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return isoOrDateStr;
    }
  };

  return (
    <div className="p-6 w-full min-h-[80vh] bg-white">
      {/* Top bread/title */}
      {/* Top bread/title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3620AC]">
            Training Plans
          </h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/create-plan")}
          style={{
            backgroundColor: "#ff6200ff",
            borderColor: "#ff6200ff",
            color: "white",
          }}
        >
          Create New Plan
        </Button>
      </div>

      <div className="flex gap-6">
        {/* LEFT: Cards list */}
        <div className="w-1/3">
          <div className="bg-white border rounded-lg p-4 h-[70vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">All Plans</h3>
              <div className="text-sm text-gray-400">{plans.length} plans</div>
            </div>

            <Spin spinning={loadingPlans}>
              {plans.length === 0 && !loadingPlans ? (
                <Empty description="No plans" />
              ) : (
                plans.map((p) => {
                  const id = p.planId ?? p.id ?? p.planID;
                  const isSelected = id && id === selectedPlanId;
                  return (
                    <Card
                      key={id || Math.random()}
                      hoverable
                      onClick={() => {
                        if (id) setSelectedPlanId(id);
                      }}
                      className={`mb-3 transition-shadow cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-indigo-200 shadow-md"
                          : ""
                      }`}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-sm text-[#262626]">
                            {p.planName || p.name || "-"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {p.description || "-"}
                          </div>
                        </div>

                        <div className="text-right ml-3">
                          <Badge
                            color={
                              p.status === "Pending"
                                ? "#faad14"
                                : p.status === "Active"
                                ? "#52c41a"
                                : p.status === "Approved"
                                ? "#1890ff"
                                : "#8c8c8c"
                            }
                            text={
                              <span className="text-xs">{p.status || "-"}</span>
                            }
                          />
                          <div className="text-xs text-gray-400 mt-2">
                            {formatDate(p.startDate)} - {formatDate(p.endDate)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </Spin>
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        <div className="flex-1">
          <div className="bg-[#F5F7FF] rounded-lg p-6 min-h-[70vh]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#3620AC]">
                  {detail ? detail.planName : "Select a plan"}
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  {detail ? detail.planId : ""}
                </div>
              </div>
            </div>

            <Spin spinning={loadingDetail}>
              {!loadingDetail && !detail && (
                <div className="py-12">
                  <Empty description="Select a plan from the left to view details" />
                </div>
              )}

              {!loadingDetail && detail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Description
                      </div>
                      <div className="text-gray-800 mt-1">
                        {detail.description || "-"}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Status
                      </div>
                      <div className="text-gray-800 mt-1">
                        {detail.status || "-"}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Start Date
                      </div>
                      <div className="text-gray-800 mt-1">
                        {formatDate(detail.startDate)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        End Date
                      </div>
                      <div className="text-gray-800 mt-1">
                        {formatDate(detail.endDate)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Created At
                      </div>
                      <div className="text-gray-800 mt-1">
                        {formatDate(detail.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Created By
                      </div>
                      <div className="text-gray-800 mt-1">
                        {detail.createdByUserName || "-"} (
                        {detail.createdByUserId || "-"})
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Approved At
                      </div>
                      <div className="text-gray-800 mt-1">
                        {detail.approvedAt
                          ? formatDate(detail.approvedAt)
                          : "-"}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Specialty
                      </div>
                      <div className="text-gray-800 mt-1">
                        {detail.specialtyName || "-"} (
                        {detail.specialtyId || "-"})
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 font-semibold">
                        Other
                      </div>
                      <div className="text-gray-800 mt-1">
                        {/* render any other fields defensively */}
                        {Object.keys(detail)
                          .filter(
                            (k) =>
                              [
                                "planId",
                                "planName",
                                "description",
                                "startDate",
                                "endDate",
                                "status",
                                "createdByUserId",
                                "createdByUserName",
                                "approvedAt",
                                "specialtyId",
                                "specialtyName",
                                "createdAt",
                              ].indexOf(k) === -1
                          )
                          .map((k) => (
                            <div key={k} className="text-sm text-gray-700">
                              <span className="font-medium">{k}:</span>{" "}
                              <span>{String(detail[k])}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!loadingDetail && detail?.courses?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#2B2B6B] mb-3">
                    Courses in this Plan
                  </h3>

                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {detail.courses.map((course) => (
                      <div
                        key={course.courseId}
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenCourseDrawer(true);
                        }}
                        className="cursor-pointer min-w-[260px] bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-lg transition"
                      >
                        <div className="font-semibold text-[#2B2B6B]">
                          {course.courseName}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {course.courseId}
                        </div>

                        <div className="text-sm text-gray-700 line-clamp-3 mb-3">
                          {course.description || "-"}
                        </div>

                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          {course.status}
                        </div>

                        <div className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">Subjects:</span>{" "}
                          {course.subjects?.length || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Spin>
            <Drawer
              title={selectedCourse?.courseName}
              open={openCourseDrawer}
              width={420}
              onClose={() => setOpenCourseDrawer(false)}
            >
              {selectedCourse ? (
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-sm text-gray-700">
                      Course ID
                    </div>
                    <div>{selectedCourse.courseId}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-sm text-gray-700">
                      Description
                    </div>
                    <div>{selectedCourse.description || "-"}</div>
                  </div>

                  <div>
                    <div className="font-semibold text-sm text-gray-700 mb-2">
                      Subjects
                    </div>
                    {selectedCourse.subjects?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedCourse.subjects.map((s) => (
                          <div
                            key={s.subjectId}
                            className="border rounded p-2 bg-gray-50"
                          >
                            <div className="font-medium">{s.subjectName}</div>
                            <div className="text-xs text-gray-500">
                              {s.subjectId}
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                              {s.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No subjects</div>
                    )}
                  </div>
                </div>
              ) : null}
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
