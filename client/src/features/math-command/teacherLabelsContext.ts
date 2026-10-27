import {createContext, useContext} from "react";
import type {TeacherLabels} from "../../../../server/src/shared/teacherLabels";
type LabelsContext = { data?: TeacherLabels; busy: boolean; error: string; save: (action: Record<string, unknown>) => Promise<boolean> };
export const Context = createContext<LabelsContext>({ busy: false, error: '', save: async () => false });
export const useTeacherLabels = () => useContext(Context);
