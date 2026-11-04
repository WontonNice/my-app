import { createContext, useCallback, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";

type FilterValues = Record<string, unknown>;

export const StudentRecordFilterContext = createContext<{
  values: FilterValues;
  setValues: Dispatch<SetStateAction<FilterValues>>;
} | null>(null);

/** Share filter choices across student remounts, never student data or open records. */
export function useStudentRecordFilter<T>(key: string, initial: T | (() => T), enabled = true): [T, Dispatch<SetStateAction<T>>] {
  const shared = useContext(StudentRecordFilterContext);
  const context = enabled ? shared : null;
  const [fallback, setFallback] = useState(initial);
  const setValues = context?.setValues;
  const hasValue = !!context && Object.hasOwn(context.values, key);

  // Capture defaults too, including existing saved preferences on the first student.
  useEffect(() => {
    if (hasValue || !setValues) return;
    setValues(current => Object.hasOwn(current, key) ? current : { ...current, [key]: fallback });
  }, [key, fallback, hasValue, setValues]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(update => {
    if (!setValues) { setFallback(update); return; }
    setValues(current => {
      const previous = Object.hasOwn(current, key) ? current[key] as T : fallback;
      const next = typeof update === "function" ? (update as (value: T) => T)(previous) : update;
      return Object.is(previous, next) && Object.hasOwn(current, key) ? current : { ...current, [key]: next };
    });
  }, [key, fallback, setValues]);

  return [hasValue ? context!.values[key] as T : fallback, setValue];
}
