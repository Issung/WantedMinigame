import * as util from './util.ts';
import { Speed } from "./speed";
import * as consts from './consts.ts';
import { Wave } from './wave.ts';

function speed() {
    return util.rangeExcluding(-consts.MAX_SPEED, consts.MAX_SPEED, -consts.MIN_SPEED, consts.MIN_SPEED);
}

export type Params = {
    readonly heads: HTMLImageElement[];
    readonly deltaTime: number;
    readonly elapsedTime: number;
}

export interface Level {
    headcount(): number;
    init(heads: HTMLImageElement[]): void;
    update(params: Params): void;
}

export class Level0 implements Level {
    headcount(): number {
        return 1;
    }

    init(heads: HTMLImageElement[]): void {
        util.setHeadPos(heads[0], consts.CENTER_X, consts.CENTER_Y);
    }

    update(_: Params): void {
    }
}

export class Level1 implements Level {
    headcount(): number {
        return 4;
    }

    init(heads: HTMLImageElement[]): void {
        util.setHeadGridPositions(heads, 2, 2);
    }

    update(_: Params): void {
    }
}

export class Level2 implements Level {
    headcount(): number {
        return 5*2;
    }

    init(heads: HTMLImageElement[]): void {
        util.setHeadGridPositions(heads, 5, 2);
    }

    update(_: Params): void {
    }
}

export class Level3 implements Level {
    headcount(): number {
        return 4*4;
    }

    init(heads: HTMLImageElement[]): void {
        util.setHeadGridPositions(heads, 4, 4);
    }

    update(_: Params): void {
    }
}

/** Random movement with boundary bouncing. */
export class Level4 implements Level {
    private speeds: Speed[];

    constructor() {
        this.speeds = Array.from({ length: consts.HEAD_COUNT }, () => ({ x: speed(), y: speed() }));
    }

    headcount(): number {
        return 30;
    }

    init(_: HTMLImageElement[]): void {
        
    }

    update(params: Params): void {
        params.heads.forEach((head, i) => {
            let speed = this.speeds[i];
            let x = (head.headX ?? util.randomOnScreenX()) + (speed.x * params.deltaTime);
            let y = (head.headY ?? util.randomOnScreenY()) + (speed.y * params.deltaTime);
    
            // If against left/right side then reverse X speed (bounce).
            if (x < 0 || x > consts.WIDTH - consts.HEAD_WIDTH) {
                speed.x = -speed.x;
            }

            // If against top/bottom side then reverse Y speed (bounce).
            if (y < 0 || y > consts.HEIGHT - consts.HEAD_HEIGHT) {
                speed.y = -speed.y;
            }

            util.setHeadPos(head, x, y);
        });
    }
}

/** Random movement with screen wrapping. */
export class Level5 implements Level {
    private speeds: Speed[];

    constructor() {
        this.speeds = Array.from({ length: this.headcount() }, () => ({ x: speed(), y: speed() }));
    }

    headcount(): number {
        return consts.HEAD_COUNT;
    }

    init(_: HTMLImageElement[]): void {
        
    }

    update(params: Params): void {
        params.heads.forEach((img, i) => {
            let speed = this.speeds[i];
            let x = (img.headX ?? util.randomX()) + (speed.x * params.deltaTime);
            let y = (img.headY ?? util.randomY()) + (speed.y * params.deltaTime);
    
            [x, y] = util.maybeWrap(x, y);
    
            util.setHeadPos(img, x, y);
        });
    }
}

/** Sine waves */
export class Level6 implements Level {
    private waves: Wave[];

    constructor() {
        this.waves = Array.from(
            { length: this.headcount() },
            () => ({ 
                //amplitude: util.rangeExcludingQ(20, 5),
                amplitude: 20,
                //frequency: util.rangeExcludingQ(0.5, 0.1),
                frequency: 0.5,
                speed: speed(),
                horizontal: util.randomBool(),
            })
        );
    }

    headcount(): number {
        return 50;
    }

    init(heads: HTMLImageElement[]): void {
        heads.forEach(head => {
            head.headInitialX = head.headX = util.randomX();
            head.headInitialY = head.headY = util.randomY();
        });
    }

    update(params: Params): void {
        params.heads.forEach((head, i) => {
            let wave = this.waves[i];
            let sineOffset = util.sineWave(params.elapsedTime, wave);

            let x = head.headX;
            let y = head.headY;

            if (wave.horizontal) {
                x += wave.speed * params.deltaTime;
                y = head.headInitialY + sineOffset;
            }
            else {
                x = head.headInitialX + sineOffset;
                y += wave.speed * params.deltaTime;
            }

            [x, y] = util.maybeWrap(x, y);
    
            util.setHeadPos(head, x, y);
        });
    }
}