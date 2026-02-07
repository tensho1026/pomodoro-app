export type CreateSessionFieldErrors = Partial<
  Record<"title" | "note" | "minutesPerSet" | "setCount", string>
>;

export type CreateSessionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: CreateSessionFieldErrors;
};

export const initialCreateSessionState: CreateSessionState = {
  status: "idle",
  message: "",
};
