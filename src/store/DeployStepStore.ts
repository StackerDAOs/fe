import create from 'zustand';
import { persist } from 'zustand/middleware';

interface DeployStepStore {
  maxSteps: number;
  currentStep: number;
  setStep: (step: number) => void;
}

const initialState = {
  maxSteps: 6,
  currentStep: 0,
}

export const useStore = create<DeployStepStore>(persist(
  (set) => ({
    ...initialState,
    setStep: (currentStep) => {
      set(state => ({
        ...state,
        currentStep
      }));
    },
  }),
  {
    name: 'deploy-extensions-steps',
    getStorage: () => sessionStorage,
  }
));