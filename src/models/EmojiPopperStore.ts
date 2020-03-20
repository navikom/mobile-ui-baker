import React from "react";
import {action, observable} from "mobx";
import {BaseEmoji} from "emoji-mart";
import {IPopper} from "interfaces/IPopper";

export class EmojiPopperStore implements IPopper {
 @observable open = false;
 @observable anchorEl?: HTMLButtonElement;
 @observable onChoose?: (value: React.ChangeEvent<HTMLInputElement> | string) => void;

 @action handleClick(e: HTMLButtonElement, cb: (value: (React.ChangeEvent<HTMLInputElement> | string)) => void): void {
  this.setOpen(this.anchorEl !== e || !this.open);
  this.setAnchorEl(e);
  this.onChoose = cb;
 }

 @action select = (emoji: BaseEmoji) => {
  this.onChoose!(emoji.native);
  this.clear();
 };

 @action setAnchorEl(e?: HTMLButtonElement): void {
  this.anchorEl = e;
 }

 @action setOpen(open: boolean): void {
  this.open = open;
 }

 @action clear(): void {
  this.setAnchorEl();
  this.setOpen(false);
  this.onChoose = undefined;
 }

}
