/** A sine wave movement for a head. */
export type Wave = {
    /** Size of the waves. */
    amplitude: number;
    /** Number of bumps per second in the wave (hz). */
    frequency: number;
    /** Speed moving along the sine wave. */
    speed: number;
    /** Is this head moving along the sine wave horizontally or vertically. */
    horizontal: boolean;
};