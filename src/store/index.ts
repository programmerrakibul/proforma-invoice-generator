import { configureStore } from "@reduxjs/toolkit";
import { invoiceUiReducer } from "@/features/invoices/store/invoice-ui.slice";

export const store = configureStore({
  reducer: {
    invoiceUi: invoiceUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["invoiceUi/setLastSavedAt", "invoiceUi/markSaved"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
