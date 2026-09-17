// У библиотеки page-flip (StPageFlip) нет своих типов — описано только то,
// чем пользуется components/CatalogBook.tsx.
declare module "page-flip" {
  export interface FlipSetting {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    usePortrait?: boolean;
    showCover?: boolean;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    mobileScrollSupport?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    autoSize?: boolean;
    startPage?: number;
  }

  export interface FlipEvent {
    data: unknown;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: FlipSetting);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: "flip" | "changeOrientation" | "changeState" | "init" | "update", cb: (e: FlipEvent) => void): PageFlip;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    update(): void;
    destroy(): void;
  }
}
