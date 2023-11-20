import { createReducer, on, Action } from "@ngrx/store";
import { apiData } from "./data.actions";

interface DataState {
  data: any[]; 
}

const initialState: DataState = {
  data: []
};

export const dataReducer = createReducer(
  initialState,
  on(apiData, (state: DataState, action: { data: any } & Action) => {
    return { ...state, data: [...state.data, action.data] };
  }),
);
