import React from "react";
import { EmojiData } from "emoji-mart";
import { IObject } from "interfaces/IObject";

export interface IPopper {
  open: boolean;
  anchorEl?: HTMLButtonElement;
  onChoose?: (value: React.ChangeEvent<HTMLInputElement> | string) => void;

  select(property: string | EmojiData): void;
  setOpen(open: boolean): void;
  setAnchorEl(e?: HTMLButtonElement): void;
  handleClick(
    e: HTMLButtonElement,
    cb: (value: React.ChangeEvent<HTMLInputElement> | string) => void
  ): void;
  clear(): void;
}

export interface IAttributesEventsPopper extends IPopper {
  size: number;
  currentProperty: IObject;

  back(): void;
}
