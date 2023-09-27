import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pullUserInfo } from "@/api/user";
import { message } from "antd";

export interface UserStateI {
  user_info: any;
  roles: any;
  token: string;
}

const initialState: UserStateI = {
  user_info: {},
  roles: [],
  token: "",
};

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  return new Promise<any>(async (resolve) => {
    const res = await pullUserInfo({});
    if (res.errcode === 0) {
      resolve({
        user_info: res.data,
        roles: [],
      });
    } else {
      message.error(res.msg);
    }
  });
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.user_info = {
        ...state.user_info,
        ...payload,
      };
    },
    setToken: (state, { payload }) => {
      state.token = payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.roles = action.payload.roles;
      state.user_info = JSON.parse(
        JSON.stringify({
          ...state.user_info,
          ...action.payload.user_info,
        })
      );
    });
  },
});

export const { setUserInfo, setToken } = userSlice.actions;

export default userSlice.reducer;
