export type AnimationFunction = (canvas: CanvasAnimation) => void;
export enum AnimationPlayState {
    Paused, Playing
};

export class CanvasAnimation {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    frameRate: number | null = null;
    frames = 0;
    playState: AnimationPlayState = AnimationPlayState.Playing;
    private lastAnimationTime = 0;

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

    pause() {
        this.playState = AnimationPlayState.Paused;
    }

    restart() {
        this.playState = AnimationPlayState.Playing;
    }

    togglePlayState() {
        if (this.playState === AnimationPlayState.Playing) {
            this.pause();
        } else if (this.playState === AnimationPlayState.Paused) {
            this.restart();
        }
    }

    aninimate(animationFunction: AnimationFunction) {
        const nextFrameDue = this.frameRate ? Date.now() - this.lastAnimationTime > 1000 / this.frameRate : true;

        if (nextFrameDue && this.playState === AnimationPlayState.Playing) {
            this.lastAnimationTime = Date.now();
            this.frames++;
            animationFunction(this);
        }

        window.requestAnimationFrame(() => this.aninimate(animationFunction));
    }
}