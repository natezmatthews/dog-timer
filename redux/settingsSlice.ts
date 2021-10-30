import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  pb: string,
  numRounds: string,
  lowBound: string,
  noise: string,
  floor: string
}

const initialState: SettingsState = {
    pb: '60',
    numRounds: '20',
    lowBound: '.2',
    noise: '2',
    floor: '2'
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
    setNoise(state, action: PayloadAction<string>) {
        state.noise = action.payload
    },
    setFloor(state, action: PayloadAction<string>) {
        state.floor = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setNoise, setPb, setLowBound, setNumRounds, setFloor } = settingsSlice.actions

export default settingsSlice.reducer