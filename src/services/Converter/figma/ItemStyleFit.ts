import { Constrains, IFigmaNode } from './IFigmaNode';

class ItemStyleFit {
  source: IFigmaNode;
  isRow = false;
  isColumn = false;
  alignItems?: string;
  justifyContent?: string;

  get isChildrenAbsolute(): boolean {
    return !this.isRow && !this.isColumn;
  }

  get isScrollHorizontal(): boolean {
    const { width } = this.source.absoluteBoundingBox;
    if (this.source.constraints.horizontal === Constrains.SCALE) {
      return false;
    }
    return width > 800;
  }

  constructor(source: IFigmaNode) {
    this.source = source;
  }

  init() {
    this.checkIsRow();
    !this.isRow && this.checkIsColumn();
    (this.isRow || this.isColumn) && this.checkAlignment();
    return this;
  }

  checkIsRow() {
    const { x } = this.source.absoluteBoundingBox;
    let l = this.source.children.length, i = 0, itemWX = x;
    this.isRow = true;
    while (l--) {
      const child = this.source.children[i++];
      const box = child.absoluteBoundingBox;
      if (box.x < itemWX) {
        this.isRow = false;
        break;
      }
      itemWX = box.x + box.width;
    }
  }

  checkIsColumn() {
    const { y } = this.source.absoluteBoundingBox;
    let l = this.source.children.length, i = 0, itemHY = y;
    this.isColumn = true;
    while (l--) {
      const child = this.source.children[i++];
      const box = child.absoluteBoundingBox;
      if (box.y < itemHY) {
        this.isColumn = false;
        break;
      }
      itemHY = box.y + box.height;
    }
  }

  checkAlignment() {
    this.alignmentByX();
    (this.isRow || this.isColumn) && this.alignmentByY();
  }

  alignmentByX() {
    const { x, width } = this.source.absoluteBoundingBox;

    const item1 = this.source.children[0].absoluteBoundingBox;
    const item1InCenterX = item1.width / 2 + item1.x === x + width / 2;
    if (item1InCenterX && this.checkJustifyContentCenterIfColumn) {
      this.justifyContent = 'center';
    } else {
      if (this.isColumn) {
        this.isColumn = false;
        return;
      }
      const childrenWidth = this.source.children.map(c => c.absoluteBoundingBox.width).reduce((s, a) => s + a, 0);
      const spaceX = width - childrenWidth;
      if (spaceX === 0) {
        return;
      }
      if (item1.x - x > 0) {
        const space = spaceX / (this.source.children.length * 2);
        if (!this.checkSpace(space, false)) {
          this.isRow = false;
        } else {
          this.justifyContent = 'space-around';
        }
      } else {
        const space = spaceX / ((this.source.children.length - 1) * 2);
        if (!this.checkSpace(space, true)) {
          this.isRow = false;
        } else {
          this.justifyContent = 'space-between';
        }
      }
    }
  }

  checkSpace(space: number, isBetween: boolean) {
    const { x } = this.source.absoluteBoundingBox;
    let l = this.source.children.length, i = 0, distance = isBetween ? x : x + space;
    while (l--) {
      const child = this.source.children[i++];
      const box = child.absoluteBoundingBox;
      const center = box.x + box.width / 2;
      if (distance + box.width / 2 !== center) {
        return false;
      }
      distance = box.x + box.width + space * 2;
    }
    return true;
  }

  get checkJustifyContentCenterIfColumn() {
    if (!this.isColumn) return true;
    const { x, width } = this.source.absoluteBoundingBox;
    let l = this.source.children.length, i = 0;
    while (l--) {
      const child = this.source.children[i++];
      const box = child.absoluteBoundingBox;
      if (box.width / 2 + box.x !== x + width / 2) {
        return false;
      }
    }
    return true;
  }

  alignmentByY() {
    if (this.isRow) {
      this.alignmentByYIfRow();
    } else {
      this.alignmentByYIfColumn();
    }
  }

  alignmentByYIfRow() {
    const { y, height } = this.source.absoluteBoundingBox;
    const y2 = y + height;
    let l = this.source.children.length, i = 0, isStart = true, isEnd = true;
    const isCenter = true;
    while (l--) {
      const child = this.source.children[i++];
      const box = child.absoluteBoundingBox;
      if (box.y !== y) {
        isStart = false;
      }
      if (box.y + box.height !== y2) {
        isEnd = false;
      }
      if (y + height / 2 !== box.y + box.height / 2) {
        isStart = false;
      }
      if (!isStart && !isEnd && !isCenter) {
        this.isRow = false;
        return;
      }
    }
    if (isStart) {
      this.alignItems = 'flex-start';
    } else if (isEnd) {
      this.alignItems = 'flex-end';
    } else {
      this.alignItems = 'center';
    }
  }

  alignmentByYIfColumn() {
    const childrenHeight = this.source.children.map(c => c.absoluteBoundingBox.height).reduce((s, a) => s + a, 0);
    if (childrenHeight === 0) {
      return;
    }
    const { y, height } = this.source.absoluteBoundingBox;
    const last = this.source.children[this.source.children.length - 1];
    const lastBox = last.absoluteBoundingBox;
    if (lastBox.y + lastBox.height === y + height) {
      this.alignItems = 'flex-end';
    } else {
      this.alignItems = 'center';
    }
  }

  getRelativeBox(item: IFigmaNode) {
    const styles: { key: string; value: string | number; unit?: string }[] = [];
    const { x, y, width, height } = this.source.absoluteBoundingBox;
    const x2 = x + width;
    const y2 = y + height;
    const box = item.absoluteBoundingBox;
    const topPx = box.y - y;
    const topPercent = topPx / height * 100;
    const leftPx = box.x - x;
    const leftPercent = leftPx / width * 100;
    const bottomPx = y2 - (box.y + box.height);
    const bottomPercent = bottomPx / height * 100;
    const rightPx = x2 - (box.x + box.width);
    const rightPercent = rightPx / width * 100;

    if (this.isChildrenAbsolute) {
      styles.push({ key: 'position', value: 'absolute' });
      switch (item.constraints.vertical) {
        case Constrains.TOP:
          styles.push(
            { key: 'top', value: topPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.BOTTOM:
          styles.push(
            { key: 'bottom', value: bottomPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.TOP_BOTTOM:
          styles.push(
            { key: 'top', value: topPx },
            { key: 'bottom', value: bottomPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.CENTER:
          styles.push(
            { key: 'height', value: box.height },
            { key: 'left', value: leftPercent, unit: '%' },
            { key: 'right', value: rightPercent, unit: '%' },
            { key: 'top', value: topPercent, unit: '%' },
          );
          break;
        case Constrains.SCALE:
          styles.push(
            { key: 'top', value: topPercent, unit: '%' },
            { key: 'left', value: leftPercent, unit: '%' },
            { key: 'right', value: rightPercent, unit: '%' },
            { key: 'bottom', value: bottomPercent, unit: '%' }
          );
          break;
      }
      switch (item.constraints.horizontal) {
        case Constrains.LEFT:
          styles.push(
            { key: 'left', value: leftPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.RIGHT:
          styles.push(
            { key: 'right', value: rightPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.LEFT_RIGHT:
          styles.push(
            { key: 'left', value: leftPx },
            { key: 'right', value: rightPx },
            { key: 'width', value: box.width },
            { key: 'height', value: box.height }
          );
          break;
        case Constrains.CENTER:
          styles.push(
            { key: 'width', value: box.width },
            { key: 'left', value: leftPercent, unit: '%' },
            { key: 'bottom', value: bottomPercent, unit: '%' },
            { key: 'top', value: topPercent, unit: '%' },
          );
          break;
        case Constrains.SCALE:
          styles.push(
            { key: 'top', value: topPercent, unit: '%' },
            { key: 'left', value: leftPercent, unit: '%' },
            { key: 'right', value: rightPercent, unit: '%' },
            { key: 'bottom', value: bottomPercent, unit: '%' }
          );
          break;
      }
    }
    return styles;
  }

}

export default ItemStyleFit;
