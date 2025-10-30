import React, { useState } from "react";
import { Card, Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

import { createPlan } from "../../service/TrainingPlanService";
import { useNavigate } from "react-router";

export default function CreatePlanPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const formatDate = (d) => ({
        year: d.year(),
        month: d.month() + 1,
        day: d.date(),
        dayOfWeek: d.format("dddd"),
      });

      const payload = {
        planId: values.planId,
        planName: values.planName,
        description: values.description,
        startDate: formatDate(values.startDate),
        endDate: formatDate(values.endDate),
        specialtyId: values.specialtyId,
      };

      const res = await createPlan(payload);
      message.success("Plan created successfully!");
      navigate("/plan");
    } catch (err) {
      console.error("Error creating plan:", err);
      message.error("Failed to create plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full min-h-[80vh] bg-white flex justify-center">
      <Card
        title="Create New Training Plan"
        className="w-full max-w-2xl shadow-md border border-gray-200"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Plan ID"
            name="planId"
            rules={[{ required: true, message: "Please input Plan ID" }]}
          >
            <Input placeholder="Enter Plan ID" />
          </Form.Item>

          <Form.Item
            label="Plan Name"
            name="planName"
            rules={[{ required: true, message: "Please input Plan Name" }]}
          >
            <Input placeholder="Enter Plan Name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter Description" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select Start Date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select End Date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            label="Specialty ID"
            name="specialtyId"
            rules={[{ required: true, message: "Please input Specialty ID" }]}
          >
            <Input placeholder="Enter Specialty ID" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate("/plan")}
              style={{
                borderColor: "#ff6200ff",
                color: "#ff6200ff",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: "#ff6200ff",
                borderColor: "#ff6200ff",
                color: "white",
              }}
            >
              Create Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
