export enum ItemAccess {
  PUBLIC = "PUBLIC",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  name: string;
  access: ItemAccess;
};