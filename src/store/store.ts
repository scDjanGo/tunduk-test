import { configureStore } from '@reduxjs/toolkit'
import candidatesReducer from './candidatesSlice'
import filtersReducer from './filtersSlice'

export const reduxStore = () =>
  configureStore({
    reducer: {
      candidates: candidatesReducer,
      filters: filtersReducer,
    },
  })

export type AppStore = ReturnType<typeof reduxStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
