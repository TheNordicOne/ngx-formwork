import { OneOf } from '../../../shared/helper/type.helper';

type NgxFwBaseContent = {
  type: string;
};

export type NgxFwFormGroup = NgxFwBaseContent & {
  id: string;
  title?: string;
};

export type NgxFwControl = NgxFwBaseContent & {
  id: string;
};

export type NgxFwContent = OneOf<[NgxFwFormGroup, NgxFwControl]>;
