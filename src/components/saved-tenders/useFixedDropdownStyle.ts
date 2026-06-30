import { useEffect, useState, type CSSProperties, type RefObject } from "react";

export const DROPDOWN_GAP_PX = 4;
export const DROPDOWN_Z_INDEX = 30;
/** Must sit above TenderSidePanelDrawer (z-50). */
export const SIDE_PANEL_DROPDOWN_Z_INDEX = 60;
export const DROPDOWN_MAX_HEIGHT_PX = 160;

export type FixedDropdownAlign = "left" | "right";

interface FixedDropdownStyle {
  top: number;
  left: number;
  minWidth: number;
  maxHeight: number;
  transform?: CSSProperties["transform"];
}

export function useFixedDropdownStyle(
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>,
  align: FixedDropdownAlign = "left",
) {
  const [style, setStyle] = useState<FixedDropdownStyle | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStyle(null);
      return;
    }

    let resizeObserver: ResizeObserver | undefined;
    let rafId = 0;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const menuHeight =
        menuRef.current?.offsetHeight ?? DROPDOWN_MAX_HEIGHT_PX;
      const menuWidth = menuRef.current?.offsetWidth ?? rect.width;
      const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_GAP_PX;
      const spaceAbove = rect.top - DROPDOWN_GAP_PX;
      const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow;

      const maxHeight = Math.min(
        DROPDOWN_MAX_HEIGHT_PX,
        Math.max(openUpward ? spaceAbove : spaceBelow, 0),
      );

      const clampedHeight = Math.min(menuHeight, maxHeight || menuHeight);

      let top = openUpward
        ? rect.top - DROPDOWN_GAP_PX - clampedHeight
        : rect.bottom + DROPDOWN_GAP_PX;

      top = Math.max(
        DROPDOWN_GAP_PX,
        Math.min(top, window.innerHeight - clampedHeight - DROPDOWN_GAP_PX),
      );

      let left = align === "right" ? rect.right : rect.left;
      let transform: CSSProperties["transform"] | undefined;

      if (align === "right") {
        transform = "translateX(-100%)";
        if (rect.right - menuWidth < DROPDOWN_GAP_PX) {
          left = rect.left;
          transform = undefined;
        }
      } else if (left + menuWidth > window.innerWidth - DROPDOWN_GAP_PX) {
        left = Math.max(
          DROPDOWN_GAP_PX,
          window.innerWidth - menuWidth - DROPDOWN_GAP_PX,
        );
      }

      setStyle({
        top,
        left,
        minWidth: rect.width,
        maxHeight: maxHeight || DROPDOWN_MAX_HEIGHT_PX,
        transform,
      });
    };

    const observeMenu = () => {
      const menu = menuRef.current;
      if (!menu) {
        rafId = requestAnimationFrame(observeMenu);
        return;
      }

      resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(menu);
      updatePosition();
    };

    updatePosition();
    observeMenu();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, anchorRef, menuRef, align]);

  return style;
}

export function getFixedDropdownMenuStyle(
  style: FixedDropdownStyle,
  zIndex: number = DROPDOWN_Z_INDEX,
): CSSProperties {
  return {
    position: "fixed",
    top: style.top,
    left: style.left,
    minWidth: style.minWidth,
    maxHeight: style.maxHeight,
    transform: style.transform,
    zIndex,
  };
}
