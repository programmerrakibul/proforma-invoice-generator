import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface InvoiceUiState {
  isPreviewOpen: boolean;
  previewZoom: "fit" | 75 | 100;
  activeMobilePanel: "form" | "preview";
  selectedLineItemId: string | null;
  isDirty: boolean;
  isExporting: boolean;
  isSidebarOpen: boolean;
  lastSavedAt: string | null;
}

const initialState: InvoiceUiState = {
  isPreviewOpen: false,
  previewZoom: "fit",
  activeMobilePanel: "form",
  selectedLineItemId: null,
  isDirty: false,
  isExporting: false,
  isSidebarOpen: true,
  lastSavedAt: null,
};

export const invoiceUiSlice = createSlice({
  name: "invoiceUi",
  initialState,
  reducers: {
    togglePreview: (state) => {
      state.isPreviewOpen = !state.isPreviewOpen;
    },
    setPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.isPreviewOpen = action.payload;
    },
    setPreviewZoom: (state, action: PayloadAction<"fit" | 75 | 100>) => {
      state.previewZoom = action.payload;
    },
    setActiveMobilePanel: (
      state,
      action: PayloadAction<"form" | "preview">
    ) => {
      state.activeMobilePanel = action.payload;
    },
    setSelectedLineItemId: (state, action: PayloadAction<string | null>) => {
      state.selectedLineItemId = action.payload;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    setIsSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setLastSavedAt: (state, action: PayloadAction<string | null>) => {
      state.lastSavedAt = action.payload;
    },
    markSaved: (state) => {
      state.isDirty = false;
      state.lastSavedAt = new Date().toISOString();
    },
  },
});

export const {
  togglePreview,
  setPreviewOpen,
  setPreviewZoom,
  setActiveMobilePanel,
  setSelectedLineItemId,
  setIsDirty,
  setIsExporting,
  setIsSidebarOpen,
  setLastSavedAt,
  markSaved,
} = invoiceUiSlice.actions;

export const invoiceUiReducer = invoiceUiSlice.reducer;
