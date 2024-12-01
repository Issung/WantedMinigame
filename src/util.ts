import * as consts from './consts.ts';
import { Wave } from './wave.ts';

export function randomBool() {
    return Math.random() >= 0.5;
}

export function randomX() {
    return range(-consts.HEAD_WIDTH, consts.WIDTH);
}

export function randomY() {
    return range(-consts.HEAD_HEIGHT, consts.HEIGHT);
}

export function randomOnScreenX() {
    return range(0, consts.WIDTH - consts.HEAD_WIDTH);
}

export function randomOnScreenY() {
    return range(0, consts.HEIGHT - consts.HEAD_HEIGHT);
}

export function range(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function rangeExcludingQ(range: number, excludingRange: number) {
    return rangeExcluding(-range, range, -excludingRange, excludingRange);
}

/** Generate a number between `min` & `max` excluding numbers between `minExcluding` & `maxExcluding` (inclusive). */
export function rangeExcluding(min: number, max: number, minExcluding: number, maxExcluding: number) {
    let result: number;

    do
    {
        result = range(min, max);
    } while (result >= minExcluding && result <= maxExcluding); // exclude numbers between -10 and 10

    return result;
}

export function rangeInt(minInclusive: number, maxInclusive: number): number {
    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

export function rangeIntExcluding(minInclusive: number, maxInclusive: number, exclude: number): number {
    let result: number;

    do
    {
        result = rangeInt(minInclusive, maxInclusive);
    } while (result == exclude); // Keep regenerating if result is the excluded number

    return result;
}

export function setHeadPos(head: HTMLImageElement, x: number, y: number): void {
    head.headX = x;
    head.headY = y;
    head.style.transform = `translate(${x}px, ${y}px)`;
}

export function setHeadGridPositions(heads: HTMLImageElement[], columns: number, rows: number) {
    const spacing = 40; // Spacing between the elements

    // Calculate the total grid dimensions
    const gridWidth = (columns - 1) * spacing;
    const gridHeight = (rows - 1) * spacing;

    let headIndex = 0;

    for (let row = 0; row < rows; ++row) {
        // Calculate the y-position for the current row based on the center
        const y = consts.CENTER_Y - gridHeight / 2 + row * spacing;

        for (let col = 0; col < columns; ++col) {
            if (headIndex >= heads.length) return; // Stop if we run out of heads

            // Calculate the x-position for the current column based on the center
            const x = consts.CENTER_X - gridWidth / 2 + col * spacing;

            // Set the position of the current head
            setHeadPos(heads[headIndex], x, y);
            headIndex++;
        }
    }
}

/** Return `x` & `y` coords wrapped around screen if they were offscreen. */
export function maybeWrap(x: number, y: number) : [number, number] {
    // Wrap X
    if (x < -consts.HEAD_WIDTH)
    {
        x = consts.WIDTH + consts.HEAD_WIDTH;
    }
    else if (x > consts.WIDTH + consts.HEAD_WIDTH)
    {
        x = -consts.HEAD_WIDTH;
    }

    // Wrap Y
    if (y < -consts.HEAD_HEIGHT)
    {
        y = consts.HEIGHT + consts.HEAD_HEIGHT;
    }
    else if (y > consts.HEIGHT + consts.HEAD_HEIGHT)
    {
        y = -consts.HEAD_HEIGHT;
    }

    return [x, y];
}

/**
 * 
 * @param elapsedTime Time since application start.
 * @param amplitude How *tall* the wave is.
 * @param frequency How fast the wave repeats measured in cycles per second (hz).
 * @returns 
 */
function sineWaveImpl(elapsedTime: number, amplitude: number, frequency: number): number {
    return amplitude * Math.sin(2 * Math.PI * frequency * elapsedTime);
}

/**
 * 
 * @param elapsedTime Time since application start.
 * @param amplitude How *tall* the wave is.
 * @param frequency How fast the wave repeats measured in cylces per second (hz).
 * @returns 
 */
export function sineWave(elapsedTime: number, wave: Wave): number {
    return sineWaveImpl(elapsedTime, wave.amplitude, wave.frequency);
}
