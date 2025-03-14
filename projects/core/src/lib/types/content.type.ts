type NgxFwBaseContent = {
  type: string;
};

export type NgxFwFormGroup = NgxFwBaseContent & {
  id: string;
  title?: string;
  controls: NgxFwContent[];
};

export type NgxFwControl = NgxFwBaseContent & {
  id: string;
  label: string;
  defaultValue?: unknown;
  nonNullable?: boolean;
  [key: string]: unknown;
};

export type NgxFwContent = NgxFwFormGroup | NgxFwControl;
