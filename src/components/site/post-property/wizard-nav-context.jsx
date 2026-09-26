"use client";

import { createContext, useContext } from "react";

// Lets any step (currently just Preview's Edit-picker) jump to another step
// without threading goToStep through every STEP_COMPONENTS entry.
const WizardNavContext = createContext(null);

export function WizardNavProvider({ goToStep, children }) {
  return <WizardNavContext.Provider value={{ goToStep }}>{children}</WizardNavContext.Provider>;
}

export function useWizardNav() {
  return useContext(WizardNavContext);
}
