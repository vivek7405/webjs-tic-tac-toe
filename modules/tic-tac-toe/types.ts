/** The two players. X always opens. */
export type Mark = 'X' | 'O';

/** One square: a played mark, or null while it is empty. */
export type Cell = Mark | null;

/** The nine squares, read in row-major order (0, 1, 2 is the top row). */
export type Board = readonly Cell[];

/** The three indices of a completed line. */
export type Line = readonly [number, number, number];
