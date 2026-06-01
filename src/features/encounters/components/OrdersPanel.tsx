"use client";

import { useState } from "react";
import { App, Button, Card, Empty, Flex, Select, Space, Tag } from "antd";
import { ExperimentOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { PRESCRIBABLE_DRUGS } from "../constants";
import { AllergyAlertModal } from "./AllergyAlertModal";

const ALLERGEN = "Penicillin (SEVERE)";

export function OrdersPanel() {
  const { message } = App.useApp();
  const [drug, setDrug] = useState<string>();
  const [orders, setOrders] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ open: boolean; drug: string }>({
    open: false,
    drug: "",
  });

  const prescribe = () => {
    const opt = PRESCRIBABLE_DRUGS.find((d) => d.value === drug);
    if (!opt) {
      message.warning("Select a drug.");
      return;
    }
    if (opt.allergen) {
      // Cross-check vs active drug allergies → block + modal.
      setAlert({ open: true, drug: opt.value });
      return;
    }
    setOrders((p) => [...p, `Rx · ${opt.value}`]);
    setDrug(undefined);
    message.success(`Prescribed ${opt.value}.`);
  };

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="New prescription">
        <Space wrap>
          <Select
            placeholder="Select drug"
            style={{ width: 220 }}
            options={PRESCRIBABLE_DRUGS.map((d) => ({ label: d.label, value: d.value }))}
            value={drug}
            onChange={setDrug}
          />
          <Button type="primary" icon={<MedicineBoxOutlined />} onClick={prescribe}>
            Prescribe
          </Button>
          <Button icon={<ExperimentOutlined />} onClick={() => { setOrders((p) => [...p, "Lab · CBC"]); message.success("Lab order placed: CBC."); }}>
            Order lab (CBC)
          </Button>
        </Space>
      </Card>

      <Card size="small" title={`Orders placed (${orders.length})`}>
        {orders.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No orders yet" />
        ) : (
          <Flex vertical gap={8}>
            {orders.map((o, i) => (
              <Tag key={`${o}-${i}`} color={o.startsWith("Rx") ? "blue" : "purple"}>
                {o}
              </Tag>
            ))}
          </Flex>
        )}
      </Card>

      <AllergyAlertModal
        open={alert.open}
        drug={alert.drug}
        allergen={ALLERGEN}
        onOverride={(reason) => {
          setOrders((p) => [...p, `Rx · ${alert.drug} (override)`]);
          setAlert({ open: false, drug: "" });
          setDrug(undefined);
          message.warning(`Override logged: ${reason}`);
        }}
        onCancel={() => setAlert({ open: false, drug: "" })}
      />
    </Flex>
  );
}
