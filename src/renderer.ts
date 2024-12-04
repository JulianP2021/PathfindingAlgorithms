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
import { generate } from './Maze/Maze';
import { solveDijkstra } from './SolvingAlgorithms/Dijkstra/dijkstra';
import { solveAStar } from './SolvingAlgorithms/A-Star/a-star';
import { solveBFS } from './SolvingAlgorithms/BFS/bfs';
import { solveDFS } from './SolvingAlgorithms/DFS/dfs';


const canvas = document.getElementById("maze") as HTMLCanvasElement;
const algorithmSelect = document.getElementById("algorithm-select") as HTMLSelectElement;
const sizeInput = document.getElementById("size-input") as HTMLInputElement;
const generateMazeButton = document.getElementById("generate-maze") as HTMLButtonElement;
const clearWallsButton = document.getElementById("clear-walls") as HTMLButtonElement;
const solveMazeButton = document.getElementById("solve-maze") as HTMLButtonElement;

const colors = {
    white: {index: 0, "rgb":[255, 255, 255]},
    red: {index: 1, "rgb":[255, 0, 0]},
    yellow: {index: 2, "rgb":[255, 255, 0]},
    green: {index: 3, "rgb":[0, 255, 255]}
}

const modis = {
    drawWalls: "red",
    drawStart: "white",
    drawEnd: "yellow",
    eraseWalls: "white"
}

const currentModi = Object.entries(modis)[0][0]

let maze: number[][] = Array.from({ length: parseInt(sizeInput.value, 10) }, () => Array(parseInt(sizeInput.value, 10)).fill(0));

// switch (maze[row][col]) {
//     case 1:
//         ctx.fillStyle = 'red';
//         break;
//     case 2:
//         ctx.fillStyle = 'yellow';
//         break;
//     case 3:
//         ctx.fillStyle = 'green';
//         break;
//     default:
//         ctx.fillStyle = 'white';
//         break;

function showSolve(){
    if (maze != null) {
        const { path: path, steps: steps }: { path: [number, number][], steps: [number, number][] } = solveMaze(algorithmSelect.value, maze);
        drawPath(path, canvas, maze.length);
        console.log(steps);
    }
}

solveMazeButton.addEventListener('click', async () => {
    showSolve()
});

function getColorFromIndex(index: number){
    return Object.entries(colors)[index][0]
}

const drawMaze = () => {
    const size = getSize()
    const cellHeight = canvas.height / size;
    const cellWidth = canvas.width / size;
    const ctx = canvas.getContext('2d');
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            ctx.fillStyle = getColorFromIndex(maze[row][col])
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
};

function getSize() {
    const size = parseInt(sizeInput.value, 10);
    return size;
}

generateMazeButton.addEventListener('click', async () => {
    const size = getSize(); // Konvertiere den Wert von sizeInput in eine Ganzzahl
    maze = generate(size);
    drawMaze(); // Zeichne das Labyrinth
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

function getDataFromEvent(e:MouseEvent) : [number, number, number, number, number, string]{
    const size = getSize();
    const cellHeight = canvas.height / size;
    const cellWidth = canvas.width / size;

 
    const posX = Math.floor((e.clientX - canvas.getBoundingClientRect().x) / (canvas.getBoundingClientRect().width/size));
    const posY = Math.floor((e.clientY - canvas.getBoundingClientRect().y) / (canvas.getBoundingClientRect().height/size))
    const colorName = modis[currentModi as keyof typeof modis];
    return [size, cellHeight, cellWidth, posX, posY, colorName]
}

canvas.addEventListener("click", (e:MouseEvent) => {

    const [size, cellHeight, cellWidth, posX, posY, colorName] = getDataFromEvent(e)
    maze[posX][posY] =  colors[colorName as keyof typeof colors].index;

    drawMaze();
});

canvas.addEventListener("mousemove", (e:MouseEvent) => {
    const [size, cellHeight, cellWidth, posX, posY, colorName] = getDataFromEvent(e)
    const ctx = canvas.getContext('2d');

    drawMaze();

    const data = ctx.getImageData(posX * cellWidth + cellWidth/2, posY * cellHeight + cellHeight/2, 1, 1).data
    let color = "";
    for(const [key, value] of Object.entries(colors)){
        let count = 0;
        for(let i = 0;i<value.rgb.length;i++){
            if(value.rgb[i] == data[i])
                count++;
        }
        if(count == value.rgb.length){
            color = key;
        }
        
    }
    if(color == ""){
        return;
    }
    ctx.fillStyle = 'rgba(0, 138, 255, 0.3)';
    ctx.fillRect(posX * cellWidth, posY * cellHeight, cellWidth, cellHeight);
})

clearWallsButton.addEventListener('click', () => {
    const size = parseInt(sizeInput.value, 10); // Konvertiere den Wert von sizeInput in eine Ganzzahl
    maze = Array.from({ length: size }, () => Array(size).fill(0)); // Setze das Labyrinth zurück
    drawMaze(); // Zeichne das Labyrinth
});

function solveMaze(algorithm: string, maze: number[][]): { path: [number, number][], steps: [number, number][] } {
    const {path:path, steps: steps} = (function () { switch (algorithm) {
        case 'dfs':
          return solveDFS(maze)
        case 'bfs':
          return solveBFS(maze)
        case 'dijkstra':
          return solveDijkstra(maze)
        case 'a-star':
          return solveAStar(maze)
        default:
          return {path: [], steps: []};
      }
      }) ();
      
      return {path:path, steps: steps}
}