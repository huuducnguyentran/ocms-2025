// TrainingPlanPage.jsx

// TrainingPlanPage.jsx

import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { getAllPlans, getPlanById } from "../../service/TrainingPlanService";

export default function TrainingPlanPage() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const res = await getAllPlans();
    setPlans(res?.data || []);
  };

  const loadDetail = async (id) => {
    if (!id) return; // ✅ prevent /undefined
    setLoading(true);
    const res = await getPlanById(id);
    setDetail(res?.data || null);
    setLoading(false);
  };

  return (
    <div className="flex h-full gap-4 p-4">
      {/* LEFT LIST */}
      <div className="w-1/3 space-y-2 overflow-auto pr-2">
        {plans?.map((p) => (
          <Card
            key={p.planId}
            hoverable
            onClick={() => {
              setSelected(p.planId);
              loadDetail(p.planId);
            }}
            className={selected === p.planId ? "border-blue-500 border" : ""}
          >
            <div className="font-semibold">{p.planName}</div>
            <div className="text-sm text-gray-500">{p.description}</div>
          </Card>
        ))}
      </div>

      {/* RIGHT DETAIL */}
      <div className="flex-1 border rounded-lg p-4 overflow-auto">
        {loading && <Spin />}
        {!loading && detail && (
          <>
            <h2 className="text-xl font-semibold mb-2">{detail.planName}</h2>
            <p className="mb-4 text-gray-600">{detail.description}</p>
          </>
        )}
        {!loading && !detail && <div>Select a plan...</div>}
      </div>
    </div>
  );
}
