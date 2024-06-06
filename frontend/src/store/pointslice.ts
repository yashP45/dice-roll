import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PointsState {
  points: number;
}

const initialState: PointsState = {
  points: 5000,
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    updatePoints: (state, action: PayloadAction<number>) => {
      state.points = action.payload;
    },
    resetPoints: (state) => {
      state.points = initialState.points;
    },
  },
});

export const { updatePoints  , resetPoints} = pointsSlice.actions;

export default pointsSlice.reducer;
