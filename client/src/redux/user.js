import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
    role: "",
  },
  reducers: {
    addUserId: (state, action) => {
      state._id = action.payload._id;
      state.role = action.payload.role;
    },
  },
});

export const { addUserId } = userSlice.actions;
export default userSlice.reducer;
