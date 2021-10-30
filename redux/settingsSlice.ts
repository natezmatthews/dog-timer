import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  pb: string,
  numRounds: string,
  lowBound: string,
  exponent: string
}

const initialState: SettingsState = {
    pb: '60',
    numRounds: '20',
    lowBound: '.2',
    exponent: '2'
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPb(state, action: PayloadAction<string>) {
        state.pb = action.payload
    },
    setNumRounds(state, action: PayloadAction<string>) {
        state.numRounds = action.payload
    },
    setLowBound(state, action: PayloadAction<string>) {
        state.lowBound = action.payload
    },
    setExponent(state, action: PayloadAction<string>) {
        state.exponent = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setExponent, setPb, setLowBound, setNumRounds } = settingsSlice.actions

export default settingsSlice.reducer