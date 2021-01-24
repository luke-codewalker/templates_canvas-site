import './index.scss';
import { AnimationPlayState, CanvasAnimation } from "./canvas-animation";

const canvasAnimation = new CanvasAnimation(<HTMLCanvasElement>document.getElementById('canvas'));

canvasAnimation.animate(({ canvas, ctx }) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, { frameRate: 30 });


const { tick: clear } = canvasAnimation.animate(({ canvas, ctx }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, { initialPlayState: AnimationPlayState.Paused });

const circleAnimation = canvasAnimation.animate(({ canvas, ctx, frames }) => {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);

    if (frames % 24 === 0) {
        ctx.fillStyle = 'tomato';
    } else {
        ctx.fillStyle = 'teal';
    }
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
}, { frameRate: 12 })

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
        clear();
    }
})
