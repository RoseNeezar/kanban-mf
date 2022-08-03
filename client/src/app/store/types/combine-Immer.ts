import produce from 'immer'
import { State, SetState, GetState, StoreApi } from 'zustand'

type StateCreator<
  T extends State,
  CustomSetState = SetState<T>,
  U extends State = T
> = (set: CustomSetState, get: GetState<T>, api: StoreApi<T>) => U

const immer =
  <T extends State, U extends State>(
    config: StateCreator<T, (fn: (draft: T) => void) => void, U>
  ): StateCreator<T, SetState<T>, U> =>
  (set, get, api) =>
    config(fn => set(produce(fn) as (state: T) => T), get, api)

const combine =
  <PrimaryState extends State, SecondaryState extends State>(
    initialState: PrimaryState,
    create: (
      set: SetState<PrimaryState>,
      get: GetState<PrimaryState>,
      api: StoreApi<PrimaryState>
    ) => SecondaryState
  ): StateCreator<PrimaryState & SecondaryState> =>
  (set, get, api) =>
    Object.assign(
      {},
      initialState,
      create(
        set as unknown as SetState<PrimaryState>,
        get as GetState<PrimaryState>,
        api as unknown as StoreApi<PrimaryState>
      )
    )

export const combineAndImmer = <
  PrimaryState extends State,
  SecondaryState extends State
>(
  initialState: PrimaryState,
  config: StateCreator<
    PrimaryState,
    (fn: (draft: PrimaryState) => void) => void,
    SecondaryState
  >
): StateCreator<PrimaryState & SecondaryState> => {
  return combine(initialState, immer(config))
}
