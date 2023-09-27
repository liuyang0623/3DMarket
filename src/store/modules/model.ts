import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getModelList } from "@/api/model";
import { message } from "antd";

export interface ParamsI {
  order_by_type?: number;
  time_type?: number;
  category_id?: number;
  if_collection?: number;
  if_function?: number;
  get_type?: number;
  min_price?: number;
  max_price?: number;
  name?: string;
}
export interface ModelStateI {
  modelList: Array<any>;
  params: ParamsI;
  hasMore: boolean;
}

const initialState: ModelStateI = {
  modelList: [],
  params: {},
  hasMore: true,
};

interface QueryI {
  page_number: number;
  page_size: number;
  filter?: any;
  type?: "load" | "turn";
}
export const fetchModelList = createAsyncThunk(
  "model/fetchModelList",
  async (query: QueryI = { page_number: 0, page_size: 30, type: "load" }) => {
    return new Promise<any>(async (resolve) => {
      console.log(query.filter)
      const res = await getModelList({
        page_number: query.page_number,
        page_size: query.page_size,
        ...query.filter,
        min_price: query.filter.min_price === 0 ? undefined : query.filter.min_price,
        max_price: query.filter.max_price === 500 ? undefined : query.filter.max_price,
      });
      if (res.errcode === 0) {
        resolve({
          data: res.data,
          type: query.type || "load",
        });
      } else {
        message.error(res.msg);
      }
    });
  }
);

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelList: (state, { payload }) => {
      state.modelList = payload;
    },
    setParams: (state, { payload }) => {
      state.params = {
        ...state.params,
        ...payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModelList.fulfilled, (state, action) => {
      if (action.payload.type === "turn") {
        state.modelList = [...state.modelList, ...action.payload.data.list];
        state.hasMore =
          action.payload.data.total_count > state.modelList.length;
      } else {
        state.modelList = action.payload.data.list;
        state.hasMore =
          action.payload.data.total_count > state.modelList.length;
      }
    });
  },
});

export const { setModelList, setParams } = modelSlice.actions;

export default modelSlice.reducer;
