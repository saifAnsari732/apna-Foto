import { create } from 'zustand';

export const useBrandStore = create((set) => ({
  businessName: '',
  whatsappNumber: '',
  logoUri: null,
  primaryColor: '#00F2FE',
  primaryFont: 'inter',

  updateBrandDetails: (details) => set((state) => ({ ...state, ...details })),
  
  clearBrandDetails: () => set({
    businessName: '',
    whatsappNumber: '',
    logoUri: null,
    primaryColor: '#00F2FE',
    primaryFont: 'inter',
  }),
}));
