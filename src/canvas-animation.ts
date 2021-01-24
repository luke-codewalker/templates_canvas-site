import { uuid } from "./utils";

export type AnimationFunctionArgs = {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    frames: number;
}
export type AnimationFunction = (args: AnimationFunctionArgs) => void;
export enum AnimationPlayState {
    Paused, Playing
};
export type AnimationOptions = {
    frameRate?: number;
    initialPlayState?: AnimationPlayState;
    id?: string;
}


type AnimationControls = {
    pause: () => void;
    restart: () => void;
    togglePlayState: () => void;
    setFrameRate: (newFps: number | null) => void;
    getFrameRate: () => number | null;
    tick: (options?: { respectFrameRate: boolean }) => void;
}

export class CanvasAnimation {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    animations: { [key: string]: AnimationControls } = {};

    constructor(canvas?: HTMLCanvasElement) {
        if (canvas) {
            this.canvas = canvas;
            this.canvas.width = canvas.clientWidth;
            this.canvas.height = canvas.clientHeight;
            window.addEventListener('resize', () => {
                this.canvas.width = canvas.clientWidth;
                this.canvas.height = canvas.clientHeight;
            });
        } else {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 600;
            document.body.appendChild(this.canvas);
        }

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error("Canvas does not support drawing context");
        }

        this.ctx = context;
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    fillCircle(x: number, y: number, r = 6) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    animate(animationFunction: AnimationFunction, options?: AnimationOptions): AnimationControls {
        let frameRate: number | null = options?.frameRate ?? null;
        let frames = 0;
        let playState: AnimationPlayState = options?.initialPlayState ?? AnimationPlayState.Playing;
        let lastAnimationTime = 0;

        const animationLoop = () => {
            const nextFrameDue = frameRate ? Date.now() - lastAnimationTime > 1000 / frameRate : true;

            if (nextFrameDue && playState === AnimationPlayState.Playing) {
                lastAnimationTime = Date.now();
                frames++;
                if (!Number.isSafeInteger(frames)) {
                    console.warn('Frames count is getting beyond Number.MAX_SAFE_INTEGER. Resetting frames to 0');
                    frames = 0;
                }
                animationFunction({ canvas: this.canvas, ctx: this.ctx, frames });
            }

            if (playState === AnimationPlayState.Playing) {
                window.requestAnimationFrame(animationLoop);
            }
        }
        animationLoop();

        const pause = () => {
            playState = AnimationPlayState.Paused;
        }

        const setFrameRate = (newFps: number | null) => {
            if (newFps !== null && newFps <= 0) {
                return;
            }

            frameRate = newFps;
        };

        const getFrameRate = () => frameRate;

        const restart = () => {
            playState = AnimationPlayState.Playing;
            setFrameRate(options?.frameRate ?? null);
            animationLoop();
        }

        const togglePlayState = () => {
            if (playState === AnimationPlayState.Playing) {
                pause();
            } else if (playState === AnimationPlayState.Paused) {
                restart();
            }
        }

        const tick = (options?: { respectFrameRate: boolean }) => {
            if (!options?.respectFrameRate) {
                setFrameRate(null);
            }

            playState = AnimationPlayState.Playing;
            animationLoop();
            playState = AnimationPlayState.Paused;
        }

        this.animations[options?.id ?? uuid()] = { pause, restart, togglePlayState, setFrameRate, getFrameRate, tick };

        return { pause, restart, togglePlayState, setFrameRate, getFrameRate, tick };
    }
}