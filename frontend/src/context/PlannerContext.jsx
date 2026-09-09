import { createContext, useContext } from 'react';

export const PlannerContext = createContext(null);

export function usePlannerContext() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlannerContext must be used inside <PlannerContext.Provider>');
  return ctx;
}
