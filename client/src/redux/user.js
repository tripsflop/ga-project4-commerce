import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
  },
  reducers: {
    addUserId: (state, action) => {
      state._id = action.payload._id;
    },
  },
});

export const { addUserId } = userSlice.actions;
export default userSlice.reducer;
