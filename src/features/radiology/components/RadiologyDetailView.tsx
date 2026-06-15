"use client";

import { useState } from "react";
import {
  Card,
  Skeleton,
  Tag,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Space,
  App,
  Image,
  Empty,
} from "antd";
import {
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useRadiologyOrder,
  useStartRadiologyScan,
  useSubmitRadiologyResults,
  useCancelRadiologyOrder,
} from "../hooks/useRadiology";
import { RADIOLOGY_PRIORITY_META, RADIOLOGY_STATUS_META } from "../constants";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const MOCK_SCANS = [
  {
    label: "Chest X-ray (Normal)",
    value: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    findings: "Lung fields are clear bilaterally. Hilar structures are normal. No pleural effusion or pneumothorax is identified. Cardiomediastinal silhouette is within normal limits. Visualized bony structures and soft tissues are unremarkable.",
    impression: "Normal chest X-ray.",
  },
  {
    label: "Chest X-ray (Pneumonia)",
    value: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
    findings: "Patchy airspace opacity is noted in the right lower lobe, consistent with consolidation. There is no significant pleural effusion. Heart size is normal. Bony thorax is intact.",
    impression: "Right lower lobe pneumonia.",
  },
  {
    label: "Brain MRI (Normal)",
    value: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80",
    findings: "MRI of the brain demonstrates normal ventricular size and sulcal pattern. No acute ischemic infarct, hemorrhage, or mass effect. Cranial nerves and vascular flow voids are preserved.",
    impression: "Unremarkable brain MRI.",
  },
  {
    label: "Abdominal Ultrasound (Gallstones)",
    value: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    findings: "The gallbladder is distended and contains multiple echogenic foci with posterior acoustic shadowing, consistent with cholelithiasis. The gallbladder wall is of normal thickness at 2mm. No pericholecystic fluid is present.",
    impression: "Cholelithiasis (Gallstones) without acute cholecystitis.",
  },
];

export function RadiologyDetailView({ id }: Readonly<{ id: string }>) {
  const { message, modal } = App.useApp();
  const { data, isLoading } = useRadiologyOrder(id);
  const startScanMutation = useStartRadiologyScan(id);
  const submitResultsMutation = useSubmitRadiologyResults(id);
  const cancelOrderMutation = useCancelRadiologyOrder(id);
  const [form] = Form.useForm();
  const [selectedScanUrl, setSelectedScanUrl] = useState<string>("");

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!data) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Radiology order not found" />;

  const handleStartScan = async () => {
    try {
      await startScanMutation.mutateAsync();
      message.success("Radiology scan started successfully.");
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const msg = apiErr.response?.data?.message ?? apiErr.message ?? "Failed to start scan";
      message.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleSubmitResults = async (values: {
    findings: string;
    impression: string;
    imagingUrl?: string;
  }) => {
    try {
      await submitResultsMutation.mutateAsync({
        findings: values.findings,
        impression: values.impression,
        imagingUrl: values.imagingUrl || selectedScanUrl || undefined,
      });
      message.success("Radiology results submitted successfully.");
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const msg =
        apiErr.response?.data?.message ?? apiErr.message ?? "Failed to submit results";
      message.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleCancelOrder = () => {
    modal.confirm({
      title: "Cancel radiology order?",
      content: "Are you sure you want to cancel this order? This action cannot be undone.",
      okText: "Yes, cancel",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await cancelOrderMutation.mutateAsync();
          message.success("Radiology order cancelled successfully.");
        } catch (err: unknown) {
          const apiErr = err as {
            response?: { data?: { message?: string | string[] } };
            message?: string;
          };
          const msg =
            apiErr.response?.data?.message ?? apiErr.message ?? "Failed to cancel order";
          message.error(Array.isArray(msg) ? msg.join(", ") : msg);
        }
      },
    });
  };

  const handleScanTemplateChange = (val: string) => {
    const scan = MOCK_SCANS.find((s) => s.value === val);
    if (scan) {
      setSelectedScanUrl(scan.value);
      form.setFieldsValue({
        findings: scan.findings,
        impression: scan.impression,
        imagingUrl: scan.value,
      });
    }
  };

  const isCompleted = data.status === "COMPLETED";
  const isInProgress = data.status === "IN_PROGRESS";
  const isPending = data.status === "PENDING";
  const isCancelled = data.status === "CANCELLED";

  return (
    <>
      <PageHeader
        title={`RAD-${data.id.substring(0, 8).toUpperCase()}`}
        subtitle={`${data.patientName} · ${data.mrn}`}
        actions={
          <Space>
            <Tag
              color={RADIOLOGY_PRIORITY_META[data.priority].color}
              style={{ marginInlineEnd: 8 }}
            >
              {RADIOLOGY_PRIORITY_META[data.priority].label}
            </Tag>
            <Tag color={RADIOLOGY_STATUS_META[data.status].color}>
              {RADIOLOGY_STATUS_META[data.status].label}
            </Tag>
          </Space>
        }
      />

      <Space vertical size="middle" style={{ width: "100%" }}>
        {/* Order Details Panel */}
        <Card size="small" title="Order Information">
          <Space vertical style={{ width: "100%" }}>
            <div>
              <Text type="secondary">Procedure: </Text>
              <Text strong>{data.description}</Text>
            </div>
            <div>
              <Text type="secondary">Ordered by: </Text>
              <Text>{data.orderedBy}</Text>
            </div>
            <div>
              <Text type="secondary">Ordered at: </Text>
              <Text>{new Date(data.orderedAt).toLocaleString()}</Text>
            </div>
            {data.notes && (
              <div>
                <Text type="secondary">Clinical Notes: </Text>
                <Paragraph style={{ marginTop: 4, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                  {data.notes}
                </Paragraph>
              </div>
            )}
          </Space>
        </Card>

        {/* Action / Input Panels */}
        {isPending && (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space vertical size="small" style={{ width: "100%" }}>
                  <Text strong style={{ fontSize: 16 }}>
                    Awaiting Scan Execution
                  </Text>
                  <Text type="secondary">
                    Click below to start the scan execution. This will lock the order state to IN_PROGRESS.
                  </Text>
                </Space>
              }
            >
              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartScan}
                  loading={startScanMutation.isPending}
                >
                  Start Scan
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={handleCancelOrder}
                  loading={cancelOrderMutation.isPending}
                >
                  Cancel Order
                </Button>
              </Space>
            </Empty>
          </Card>
        )}

        {isInProgress && (
          <Card title="Enter Scan Findings & Results">
            <Form form={form} layout="vertical" onFinish={handleSubmitResults}>
              <Form.Item label="Template Selection (Optional)">
                <Select
                  placeholder="Select a scan template to pre-fill..."
                  onChange={handleScanTemplateChange}
                  options={MOCK_SCANS.map((s) => ({ label: s.label, value: s.value }))}
                />
              </Form.Item>

              <Form.Item
                name="findings"
                label="Clinical Findings"
                rules={[{ required: true, message: "Please enter clinical findings" }]}
              >
                <TextArea rows={6} placeholder="Detailed observations of the scan..." />
              </Form.Item>

              <Form.Item
                name="impression"
                label="Diagnostic Impression"
                rules={[{ required: true, message: "Please enter diagnostic impression" }]}
              >
                <TextArea rows={3} placeholder="Final radiological diagnosis / impression..." />
              </Form.Item>

              <Form.Item name="imagingUrl" label="Imaging Scan URL" hidden>
                <Input />
              </Form.Item>

              {selectedScanUrl && (
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                    Scan Preview:
                  </Text>
                  <div
                    style={{
                      maxHeight: 250,
                      width: "100%",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #d9d9d9",
                      background: "#000",
                      textAlign: "center",
                    }}
                  >
                    <Image
                      alt="Selected Scan"
                      src={selectedScanUrl}
                      style={{ maxHeight: 248, maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>
              )}

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    htmlType="submit"
                    loading={submitResultsMutation.isPending}
                  >
                    Submit Results
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelOrder}
                    loading={cancelOrderMutation.isPending}
                  >
                    Cancel Order
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}

        {isCompleted && data.details && (
          <Card title="Radiology Report" extra={<Tag color="green">Verified & Completed</Tag>}>
            <Space vertical style={{ width: "100%" }} size="middle">
              {data.details.imagingUrl && (
                <div style={{ textAlign: "center", background: "#000", padding: 16, borderRadius: 8 }}>
                  <Image
                    alt="Radiology Scan"
                    src={data.details.imagingUrl}
                    style={{ maxHeight: 350, maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              )}

              <div>
                <Title level={5}>Clinical Findings</Title>
                <Paragraph style={{ padding: 12, background: "#f9f9f9", borderRadius: 4, borderLeft: "4px solid #1890ff" }}>
                  {data.details.findings}
                </Paragraph>
              </div>

              <div>
                <Title level={5}>Diagnostic Impression</Title>
                <Paragraph style={{ padding: 12, background: "#f9f9f9", borderRadius: 4, borderLeft: "4px solid #52c41a" }}>
                  {data.details.impression}
                </Paragraph>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                <Text type="secondary">Performed by: </Text>
                <Text strong>{data.details.performedBy} </Text>
                <Text type="secondary">at </Text>
                <Text>{new Date(data.details.performedAt).toLocaleString()}</Text>
              </div>
            </Space>
          </Card>
        )}

        {isCancelled && (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space vertical size="small" style={{ width: "100%" }}>
                  <Text strong style={{ fontSize: 16 }}>
                    Order Cancelled
                  </Text>
                  <Text type="secondary">
                    This radiology order was cancelled and no further actions can be performed.
                  </Text>
                </Space>
              }
            />
          </Card>
        )}
      </Space>
    </>
  );
}
