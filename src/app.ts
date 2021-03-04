import './index.scss';
import { AnimationPlayState, CanvasAnimation } from "./lib/canvas-animation";
import { random } from './lib/utils';

const canvasAnimation = new CanvasAnimation(<HTMLCanvasElement>document.getElementById('canvas'));

canvasAnimation.animate(({ canvas, ctx }) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, { frameRate: 30 });


canvasAnimation.animate(({ canvas, ctx }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, { initialPlayState: AnimationPlayState.Paused, id: 'clearAnimation' });

const circleAnimation = canvasAnimation.animate(({ canvas, ctx, frames }) => {
    const x = random(0, canvas.width);
    const y = random(0, canvas.height);

    if (frames % 12 === 0) {
        ctx.fillStyle = 'tomato';
    } else {
        ctx.fillStyle = 'teal';
    }

    canvasAnimation.fillCircle(x, y, 6);
}, { frameRate: 20 })

window.addEventListener('keypress', e => {
    if (e.key === ' ') {
        circleAnimation.togglePlayState();
    }

    if (e.key === '+') {
        circleAnimation.setFrameRate((circleAnimation.getFrameRate() ?? 24) * 2);
    }

    if (e.key === '-') {
        circleAnimation.setFrameRate((circleAnimation.getFrameRate() ?? 24) / 2);
    }

    if (e.key === 'c') {
        canvasAnimation.animations['clearAnimation'].tick();
    }
})
