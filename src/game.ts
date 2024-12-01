import { Level, Level0, Level1, Level2, Level3, Level4, Level5, Level6, Params } from './levels.ts';
import * as util from './util.ts';
import * as consts from './consts.ts';

console.log('game.ts');

declare global {
    interface HTMLImageElement {
        headInitialX: number;

        headInitialY: number;

        /** The X value in style.translate. */
        headX: number;

        /** The Y value in style.translate. */
        headY: number;

        /** Is this img element the wanted head? Only set for the wanted head. */
        isWanted: boolean | undefined;
    }
}

enum State {
    InProgress,
    ShowSelectionResult,
}

const levels = [Level0, Level1, Level2, Level3, Level4, Level5, Level6];
//const levels = [Level3, Level4, Level5, Level6];
const bottom = document.querySelector<HTMLDivElement>('div#bottom')!;
let lastNow = performance.now();
let elapsedTime = 0; // Track cumulative time
let animationRequestId = requestAnimationFrame(animate);
let state = State.InProgress;
let heads: HTMLImageElement[] = [];
let level: Level = new Level0();

function resetScene() {
    bottom.style.backgroundColor = 'black';
    document.querySelectorAll('img.head').forEach(head => head.remove());
}

function newLevel() {
    resetScene();

    let wanted = util.rangeInt(0, 3);
    document.querySelector<HTMLImageElement>('div#top img#wanted')!.src = `/img/${wanted}lg.png`;
    
    const RandomLevel = levels[util.rangeInt(0, levels.length - 1)];
    level = new RandomLevel();
    
    let headcount = level.headcount();
    let wantedHeadImageIndex = util.rangeInt(0, headcount - 1);
    //console.log(`wantedHeadImageIndex:${wantedHeadImageIndex}`);

    heads = Array.from({length: headcount}, (_, index) => {
        let head = document.createElement('img');
        head.className = 'head';
        bottom.appendChild(head);

        if (index == wantedHeadImageIndex) {
            head.src = `/img/${wanted}.png`;
            head.isWanted = true;
        }
        else {
            head.src = `/img/${util.rangeIntExcluding(0, 3, wanted)}.png`;
        }

        head.addEventListener('click', onHeadClick);

        return head;
    });
    
    level.init(heads);
    state = State.InProgress;
}

function animate() {
    //console.log(`animate() state: ${state}.`);

    try {
        if (state != State.InProgress) {
            return;
        }

        let deltaTime = (performance.now() - lastNow) / 1000;
        elapsedTime += deltaTime;

        const params: Params = {
            heads: heads,
            deltaTime: deltaTime,
            elapsedTime: elapsedTime,
        };

        level.update(params);

        document.querySelectorAll<HTMLImageElement>('img.head')
    }
    finally {
        lastNow = performance.now();
        animationRequestId = requestAnimationFrame(animate);
    }
}

function onHeadClick(this: HTMLImageElement, ev: MouseEvent) {
    heads.forEach(head => {
        if (head != this) {
            head.style.visibility = 'hidden';
        }
    });

    if (this.isWanted) {
        bottom.style.backgroundColor = '#FFE742';
        this.id = 'correct';
    }
    else {
        bottom.style.backgroundColor = 'red';
        this.id = 'incorrect';
    }

    state = State.ShowSelectionResult;

    setTimeout(() => {
        newLevel();
    }, 750);
}

newLevel();