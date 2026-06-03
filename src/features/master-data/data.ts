export interface MasterRow {
  id: string;
  [key: string]: string | number;
}

export const DEPARTMENTS: MasterRow[] = [
  { id: "1", code: "CARDIO", name: "Cardiology", description: "Heart & vascular" },
  { id: "2", code: "GEN_MED", name: "General Medicine", description: "Internal medicine" },
  { id: "3", code: "PEDS", name: "Pediatrics", description: "Child health" },
  { id: "4", code: "ORTHO", name: "Orthopedics", description: "Bone & joint" },
];

export const SERVICES: MasterRow[] = [
  { id: "1", code: "CONSULT_OPD", name: "OPD Consultation", category: "Consultation", price: 30000, taxRate: 0 },
  { id: "2", code: "ECG", name: "ECG", category: "Procedure", price: 25000, taxRate: 0 },
  { id: "3", code: "DRESSING", name: "Wound dressing", category: "Procedure", price: 8000, taxRate: 0 },
];

export const MEDICATIONS: MasterRow[] = [
  { id: "1", code: "MED-PARA", genericName: "Paracetamol", strength: "500mg", form: "Tablet", unit: "tablet" },
  { id: "2", code: "MED-AMLO", genericName: "Amlodipine", strength: "5mg", form: "Tablet", unit: "tablet" },
  { id: "3", code: "MED-AMOX", genericName: "Amoxicillin", strength: "250mg", form: "Capsule", unit: "capsule" },
];

export const LAB_TESTS: MasterRow[] = [
  { id: "1", code: "CBC", name: "Complete Blood Count", category: "Hematology", sampleType: "Blood", price: 15000 },
  { id: "2", code: "LIPID", name: "Lipid panel", category: "Chemistry", sampleType: "Blood", price: 35000 },
  { id: "3", code: "UA", name: "Urinalysis", category: "Microbiology", sampleType: "Urine", price: 10000 },
];

export const WARDS: MasterRow[] = [
  { id: "1", code: "WARD-A", name: "Ward A (General)", department: "General Medicine", totalBeds: 24 },
  { id: "2", code: "ICU", name: "Intensive Care Unit", department: "Cardiology", totalBeds: 8 },
  { id: "3", code: "PEDS-W", name: "Pediatric Ward", department: "Pediatrics", totalBeds: 16 },
];

export const INSURANCE_PROVIDERS: MasterRow[] = [
  { id: "1", code: "AYA", name: "AYA SOMPO", contact: "01-555111" },
  { id: "2", code: "GGI", name: "Grand Guardian", contact: "01-555222" },
  { id: "3", code: "IKBZ", name: "IKBZ Insurance", contact: "01-555333" },
];
