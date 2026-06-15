"use client";

import { Tabs } from "antd";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { MasterCrud } from "@/features/master-data/MasterCrud";

export default function MasterDataPage() {
  const t = useTranslations("services.categories");
  return (
    <>
      <PageHeader title="Master data" subtitle="Reference catalogs (admin)" />
      <Tabs
        items={[
          {
            key: "departments",
            label: "Departments",
            children: (
              <MasterCrud
                resource="departments"
                entity="Department"
                showActiveToggle
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Description", dataIndex: "description", key: "description" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  { name: "description", label: "Description" },
                ]}
              />
            ),
          },
          {
            key: "services",
            label: "Services",
            children: (
              <MasterCrud
                resource="services"
                entity="Service"
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  {
                    title: "Category",
                    dataIndex: "category",
                    key: "category",
                    render: (val: string) => {
                      const map: Record<string, string> = {
                        Consultation: t("consultation"),
                        Procedure: t("procedure"),
                        Investigation: t("investigation"),
                        "Room Charge": t("roomCharge"),
                        "Nursing Fee": t("nursingFee"),
                        "Medical Supplies": t("medicalSupplies"),
                      };
                      return map[val] || val;
                    },
                  },
                  { title: "Price (Ks)", dataIndex: "price", key: "price" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  {
                    name: "category",
                    label: "Category",
                    type: "select",
                    required: true,
                    options: [
                      { label: t("consultation"), value: "Consultation" },
                      { label: t("procedure"), value: "Procedure" },
                      { label: t("investigation"), value: "Investigation" },
                      { label: t("roomCharge"), value: "Room Charge" },
                      { label: t("nursingFee"), value: "Nursing Fee" },
                      { label: t("medicalSupplies"), value: "Medical Supplies" },
                    ],
                  },
                  { name: "price", label: "Price (Ks)", type: "number", required: true },
                  { name: "taxRate", label: "Tax rate (%)", type: "number" },
                ]}
              />
            ),
          },
          {
            key: "medications",
            label: "Medications",
            children: (
              <MasterCrud
                resource="medications"
                entity="Medication"
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Generic name", dataIndex: "genericName", key: "genericName" },
                  { title: "Strength", dataIndex: "strength", key: "strength" },
                  { title: "Form", dataIndex: "form", key: "form" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "genericName", label: "Generic name", required: true },
                  { name: "strength", label: "Strength", required: true },
                  { name: "form", label: "Form", required: true },
                  { name: "unit", label: "Unit", required: true },
                ]}
              />
            ),
          },
          {
            key: "lab-tests",
            label: "Lab tests",
            children: (
              <MasterCrud
                resource="lab-tests"
                entity="Lab test"
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Category", dataIndex: "category", key: "category" },
                  { title: "Sample", dataIndex: "sampleType", key: "sampleType" },
                  { title: "Price (Ks)", dataIndex: "price", key: "price" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  { name: "category", label: "Category", required: true },
                  { name: "sampleType", label: "Sample type", required: true },
                  { name: "price", label: "Price (Ks)", type: "number", required: true },
                ]}
              />
            ),
          },
          {
            key: "wards",
            label: "Wards",
            children: (
              <MasterCrud
                resource="wards"
                entity="Ward"
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Department", dataIndex: "department", key: "department" },
                  { title: "Beds", dataIndex: "totalBeds", key: "totalBeds" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  {
                    name: "departmentId",
                    label: "Department",
                    type: "select",
                    selectFromDepartments: true,
                    required: true,
                  },
                  { name: "totalBeds", label: "Total beds", type: "number", required: true },
                ]}
              />
            ),
          },
          {
            key: "insurance",
            label: "Insurance providers",
            children: (
              <MasterCrud
                resource="insurance-providers"
                entity="Insurance provider"
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Contact", dataIndex: "contact", key: "contact" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  { name: "contact", label: "Contact" },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}
