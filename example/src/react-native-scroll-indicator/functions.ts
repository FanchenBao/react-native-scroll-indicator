/**
 * Compute the position of the indicator given the size of the container it is
 * located, its girth, and the desired position. The goal is to place the
 * center line of the indicator (vertical if the indicator moves in vertical
 * direction, horizontal otherwise) at the desired position. If, by doing so,
 * part of the indicator will be overflowing the container, clamp it such that
 * the indicator is flush with the edge of the container.
 * @param containerSize size of the container orthogonal to the direction of
 * the indicator, i.e., if indicator is vertical, the size will be the width
 * of the container, otherwise height.
 * @param indGirth the width or height of the indicator if it is vertical or
 * horizontal, respectively.
 * @param position desired position of the indicator, as a percentage of the
 * container. e.g. 20 means we want to place a vertical indicator's center line
 * at 20% of the container's width.
 * @returns the absolute position of the indicator as used in the style for
 * top (indicator is horizontal) or left (indicator is vertical)
 */
const getIndPosition = (
  containerSize: number,
  indGirth: number,
  position: number,
) =>
  Math.max(
    0,
    Math.min(
      (position / 100) * containerSize - (indGirth as number) / 2,
      containerSize - (indGirth as number),
    ),
  );

/**
 * Get default position when it is not supplied by the user
 * @param horizontal whether the indicator is horizontal
 * @param position desired position of the indicator, as a percentage of the
 * container. e.g. 20 means we want to place a vertical indicator's center line
 * at 20% of the container's width. If user has not specified it, it will have
 * the value of empty string.
 * @returns default position if it has not been supplied
 */
export const getDefaultPosition = (
  horizontal: boolean,
  position: string | number,
) => {
  let posi = position;
  if (horizontal && position === '') {
    posi = 'bottom';
  } else if (!horizontal && position === '') {
    posi = 'right';
  }
  return posi;
};

/**
 * get the style for indicator's location.
 * @param horizontal whether the indicator is horizontal
 * @param position desired position of the indicator, as a percentage of the
 * container. e.g. 20 means we want to place a vertical indicator's center line
 * at 20% of the container's width.
 * @param orthSize the size of the content view orthogonal to that of the
 * scrolling direction. e.g. if the scrolling is vertical, orthSize is the
 * content view's width, otherwise height.
 * @param indGirth the girth of the indicator, which is width for vertical
 * indicator, or height for horizontal indicator
 * @returns the location style of the indicator, which includes a numeric value
 * for top, bottom, left, or right.
 */
export const getLocStyle = (
  horizontal: boolean,
  position: string | number,
  orthSize: number,
  indGirth: number,
) => {
  let locStyle;
  if (horizontal) {
    if (typeof position === 'string' && ['top', 'bottom'].includes(position)) {
      locStyle = {[position]: 0};
    } else if (typeof position === 'number') {
      locStyle = {
        top: getIndPosition(orthSize, indGirth, position),
      };
    } else {
      throw Error(
        '"position" must be one of "top", "buttom", or a floating number when the scroll view is horizontal',
      );
    }
  } else {
    if (typeof position === 'string' && ['left', 'right'].includes(position)) {
      locStyle = {[position]: 0};
    } else if (typeof position === 'number') {
      locStyle = {
        left: getIndPosition(orthSize, indGirth as number, position),
      };
    } else {
      throw Error(
        '"position" must be one of "left", "right", or a floating number when the scroll view is vertical',
      );
    }
  }
  return locStyle;
};
