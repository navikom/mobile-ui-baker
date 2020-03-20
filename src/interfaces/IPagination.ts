import React from "react";

export interface IPagination<T> {
  items: T[];
  fetching: boolean;
  count: number;
  viewPage: number;
  allFetched: boolean;
  viewRowsPerPage: number;
  rowsPerPageOptions: number[];
  size: number;
  getById(id: number): T | undefined;
  fetchItems(): Promise<boolean>;
  getNext(): Promise<boolean>;
  tryGetNext(): Promise<void>;
  reachedBottom(scrollTop: number, height: number): Promise<void>;
  handleChangePageInView(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void;
  handleChangeRowsPerPage(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void;
  push(data: T[]): void;
}
