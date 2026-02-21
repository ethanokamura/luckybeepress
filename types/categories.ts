import { FirebaseDoc } from "./base_types";

export interface Category extends FirebaseDoc {
  name: string;
  order: number;
  supportsBoxSet: boolean;
}
