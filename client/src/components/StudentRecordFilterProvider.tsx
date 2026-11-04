import { useMemo, useState, type ReactNode } from "react";
import { StudentRecordFilterContext } from "../lib/studentRecordFilters";

export function StudentRecordFilterProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const context = useMemo(() => ({ values, setValues }), [values]);
  return <StudentRecordFilterContext.Provider value={context}>{children}</StudentRecordFilterContext.Provider>;
}
