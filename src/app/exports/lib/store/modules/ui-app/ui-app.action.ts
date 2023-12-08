import { createAction, props } from "@ngrx/store";

export const setModeUI = createAction(
  '[UI] - Solicitamos modo de interface',
  props<{
    mode: string
  }>()
);

export const initModeUI = createAction(
  '[UI] - Chequeamos modo de interface'
);
