import { createSlice, current } from '@reduxjs/toolkit'
import { indicatorDefaults } from '../../../src/constants';

const initialState = {...indicatorDefaults}

const enformationSlice = createSlice({
  name: 'enfSettings',
  initialState,
  reducers: {
    setEnfSettings(state, action) {
        const indicator= action.payload.indicator;
        const value = action.payload.value;
        state[indicator] = value
    },
    reset: () => initialState
  },
})

export const { setEnfSettings,  reset} = enformationSlice.actions
export default enformationSlice.reducer
