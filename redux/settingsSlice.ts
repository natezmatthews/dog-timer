import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  start: string,
  delta: string
}

const initialState: SettingsState = {
    start: '1',
    delta: '1'
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setStart(state, action: PayloadAction<string>) {
        state.start = action.payload
    },
    setDelta(state, action: PayloadAction<string>) {
        state.delta = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setStart, setDelta } = settingsSlice.actions

export default settingsSlice.reducer