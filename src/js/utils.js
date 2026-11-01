

export function calcTileType(index, boardSize) {
  
  if (!Number.isInteger(index) || !Number.isInteger(boardSize)) {
    throw new TypeError('index and boardSize must be integers');
  }

  if (boardSize <= 0) {
    throw new RangeError('boardSize must be greater than 0');
  }

  if (index < 0 || index >= boardSize ** 2) {
    throw new RangeError('index is out of board bounds');
  }

  const row = Math.floor(index / boardSize);
  const column = index % boardSize;

  const isTop = row === 0;
  const isBottom = row === boardSize - 1;
  const isLeft = column === 0;
  const isRight = column === boardSize - 1;

  if (isTop && isLeft) return 'top-left';
  if (isTop && isRight) return 'top-right';
  if (isBottom && isLeft) return 'bottom-left';
  if (isBottom && isRight) return 'bottom-right';

  if (isTop) return 'top';
  if (isBottom) return 'bottom';
  if (isLeft) return 'left';
  if (isRight) return 'right';

  return 'center';
}


export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
