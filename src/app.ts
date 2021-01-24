import './index.scss';
import { CanvasAnimation } from "./canvas";

const canvas = new CanvasAnimation(<HTMLCanvasElement>document.getElementById('canvas'));
canvas.frameRate = 24;

window.addEventListener('keypress', e => {
    if (e.key === ' ') {
        canvas.togglePlayState();
    }
})

canvas.aninimate((canvas) => {
    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);

    canvas.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (canvas.frames % 24 === 0) {
        canvas.ctx.fillStyle = 'tomato';
    } else {
        canvas.ctx.fillStyle = 'teal';
    }
    canvas.ctx.beginPath();
    canvas.ctx.arc(x, y, 8, 0, Math.PI * 2);
    canvas.ctx.fill();
})
