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
}

export class CanvasAnimation {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

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

    animate(animationFunction: AnimationFunction, options?: AnimationOptions) {
        let frameRate: number | null = options?.frameRate ?? null;
        let frames = 0;
        let playState: AnimationPlayState = options?.initialPlayState ?? AnimationPlayState.Playing;
        let lastAnimationTime = 0;

        const animationLoop = () => {
            const nextFrameDue = frameRate ? Date.now() - lastAnimationTime > 1000 / frameRate : true;

            if (nextFrameDue && playState === AnimationPlayState.Playing) {
                lastAnimationTime = Date.now();
                frames++;
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

        return { pause, restart, togglePlayState, setFrameRate, getFrameRate, tick };
    }
}