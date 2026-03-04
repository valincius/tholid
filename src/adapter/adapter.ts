export type AdapterType<Input = object, Output = object> = {
  compare: (existing: unknown) => existing is Output;
  adapt: (existing: Output, value: Input) => void;
};

export type Adapter<Input, Output> = AdapterType<Input, Output>;
