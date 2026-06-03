"use client";

import { Tabs } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { MasterCrud } from "@/features/master-data/MasterCrud";
import {
  DEPARTMENTS,
  SERVICES,
  MEDICATIONS,
  LAB_TESTS,
  WARDS,
  INSURANCE_PROVIDERS,
} from "@/features/master-data/data";

export default function MasterDataPage() {
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
                entity="Department"
                initialData={DEPARTMENTS}
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
                entity="Service"
                initialData={SERVICES}
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Category", dataIndex: "category", key: "category" },
                  { title: "Price (Ks)", dataIndex: "price", key: "price" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  { name: "category", label: "Category" },
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
                entity="Medication"
                initialData={MEDICATIONS}
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Generic name", dataIndex: "genericName", key: "genericName" },
                  { title: "Strength", dataIndex: "strength", key: "strength" },
                  { title: "Form", dataIndex: "form", key: "form" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "genericName", label: "Generic name", required: true },
                  { name: "strength", label: "Strength" },
                  { name: "form", label: "Form" },
                  { name: "unit", label: "Unit" },
                ]}
              />
            ),
          },
          {
            key: "lab-tests",
            label: "Lab tests",
            children: (
              <MasterCrud
                entity="Lab test"
                initialData={LAB_TESTS}
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
                  { name: "category", label: "Category" },
                  { name: "sampleType", label: "Sample type" },
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
                entity="Ward"
                initialData={WARDS}
                columns={[
                  { title: "Code", dataIndex: "code", key: "code" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Department", dataIndex: "department", key: "department" },
                  { title: "Beds", dataIndex: "totalBeds", key: "totalBeds" },
                ]}
                fields={[
                  { name: "code", label: "Code", required: true },
                  { name: "name", label: "Name", required: true },
                  { name: "department", label: "Department" },
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
                entity="Insurance provider"
                initialData={INSURANCE_PROVIDERS}
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
