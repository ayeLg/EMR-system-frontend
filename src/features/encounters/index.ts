export type { Encounter, EncounterDetail, EncounterStatus } from "./types";
export {
  useEncounters,
  useEncounter,
  useSaveSoapNote,
  useRecordEncounterVitals,
  useAddEncounterDiagnosis,
  useUpdateEncounterStatus,
} from "./hooks/useEncounters";
export { EncounterTable } from "./components/EncounterTable";
export { EncounterDetailView } from "./components/EncounterDetailView";
