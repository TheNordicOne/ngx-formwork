import { NgxFwControl } from '../../lib';

export interface TestTextControl extends NgxFwControl {
  type: 'test-text-control';
  hint?: string;
  defaultValue?: string;
  useDefaultTestId?: boolean;
}

export interface UnknownContent extends NgxFwControl {
  type: 'unknown';
}
