
import {createAction,props} from "@ngrx/store"


export const apiData = createAction('[data] apidata',props<{data:any}>())
export const reStoreData = createAction('[data] restore',props<{restore:any}>())
export const editdata = createAction('[data] edit data',props<{editdata:any}>())