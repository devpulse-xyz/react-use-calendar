import { TFalsy } from "../interfaces/global.interface";

export default function cn(...classes: (string | TFalsy)[]) {
  return classes.filter(Boolean).join(' ');
}
