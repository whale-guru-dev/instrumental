export type ControlledProps<T> = {
  value?: T;
  onChange: (value: T) => void;
};

export enum UIStates {
  Idle = "Idle", // Search input related
  Loading = "Loading", // Search input related
}

export type EdgeProps = "start" | "end";
