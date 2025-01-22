import { MedalType } from "./constants/medal.constant";

export type MedalRecordDto = {
  country: string;
} & {
  [key in MedalType]: number;
};