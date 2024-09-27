/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

const canvas = document.getElementById("maze") as HTMLCanvasElement;
const algorithmSelect = document.getElementById("algorithm-select") as HTMLSelectElement;
const sizeInput = document.getElementById("size-input") as HTMLInputElement;
const generateMazeButton = document.getElementById("generate-maze") as HTMLButtonElement;
const clearWallsButton = document.getElementById("clear-walls") as HTMLButtonElement;
const solveMazeButton = document.getElementById("solve-maze") as HTMLButtonElement;

let maze: number[][] = Array.from({ length: parseInt(sizeInput.value, 10) }, () => Array(10).fill(0));

solveMazeButton.addEventListener('click', async () => {
    if (maze != null) {
        const { path: path, steps: steps }: { path: [number, number][], steps: [number, number][] } = await (window as any).maze.solve({ algorithm: algorithmSelect.value,  maze: maze });
        drawPath(path, canvas, maze.length);
        console.log(steps);
    }
});

const drawMaze = (maze: number[][], canvas: HTMLCanvasElement, size: number) => {
    const cellHeight = canvas.height / size;
    const cellWidth = canvas.width / size;
    const ctx = canvas.getContext('2d');
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            switch (maze[row][col]) {
                case 1:
                    ctx.fillStyle = 'red';
                    break;
                case 2:
                    ctx.fillStyle = 'yellow';
                    break;
                case 3:
                    ctx.fillStyle = 'green';
                    break;
                default:
                    ctx.fillStyle = 'white';
                    break;
            }
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
};

generateMazeButton.addEventListener('click', async () => {
    const size = parseInt(sizeInput.value, 10); // Konvertiere den Wert von sizeInput in eine Ganzzahl
    maze = await (window as any).maze.generate(size); // Generiere das Labyrinth
    drawMaze(maze, canvas, size); // Zeichne das Labyrinth
});

const drawPath = (path: [number, number][], canvas: HTMLCanvasElement, size: number) => {
    const cellHeight = canvas.height / size;
    const cellWidth = canvas.width / size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    for (const [row, col] of path) {
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
}
clearWallsButton.addEventListener('click', () => {
    const size = parseInt(sizeInput.value, 10); // Konvertiere den Wert von sizeInput in eine Ganzzahl
    maze = Array.from({ length: size }, () => Array(size).fill(0)); // Setze das Labyrinth zurück
    drawMaze(maze, canvas, size); // Zeichne das Labyrinth
});