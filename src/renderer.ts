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

import "./index.css";
import { generate } from "./Maze/Maze";
import { solveDijkstra } from "./SolvingAlgorithms/Dijkstra/dijkstra";
import {
	solveAStar,
	solveAStarBothSides,
} from "./SolvingAlgorithms/A-Star/a-star";

import { solveBFS } from "./SolvingAlgorithms/BFS/bfs";
import { solveDFS } from "./SolvingAlgorithms/DFS/dfs";
import { stepsType } from "./SolvingAlgorithms/types";

import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

export function setupDocumentListeners() {
	const canvas = document.getElementById("maze") as HTMLCanvasElement;
	const algorithmSelect = document.getElementById(
		"algorithm-select"
	) as HTMLSelectElement;
	const modiSelect = document.getElementById(
		"modi-select"
	) as HTMLSelectElement;
	const sizeInput = document.getElementById("size-input") as HTMLInputElement;
	const timeInput = document.getElementById("time-input") as HTMLInputElement;

	const generateMazeButton = document.getElementById(
		"generate-maze"
	) as HTMLButtonElement;
	const clearWallsButton = document.getElementById(
		"clear-walls"
	) as HTMLButtonElement;
	const solveMazeButton = document.getElementById(
		"solve-maze"
	) as HTMLButtonElement;

	const sleepNow = (delay: number) =>
		new Promise(resolve => setTimeout(resolve, delay));

	const colors = {
		cleanColor: {
			index: 0,
			rgb: [255, 255, 255],
			rgbString: "rgb(255, 255, 255)",
			stringVal: "white",
		},
		wallColor: {
			index: 1,
			rgb: [255, 0, 0],
			rgbString: "rgb(255, 0, 0)",
			stringVal: "red",
		},
		startColor: {
			index: 2,
			rgb: [255, 255, 0],
			rgbString: "rgb(255, 255, 0)",
			stringVal: "yellow",
		},
		endColor: {
			index: 3,
			rgb: [0, 255, 0],
			rgbString: "rgb(0, 255, 0)",
			stringVal: "green",
		},
		algColor: {
			index: 4,
			rgb: [0, 0, 255],
			rgbString: "rgb(0, 0, 255)",
			stringVal: "blue",
		},
		hoverColor: {
			index: 5,
			rgb: [0, 138, 255],
			rgbString: "rgba(0, 138, 255, 0.3)",
			stringVal: "Not defined",
		},
		visitedColor: {
			index: 6,
			rgb: [0, 50, 25],
			rgbString: "rgba(0, 50, 25, 0.3)",
			stringVal: "Not defined",
		},
	};

	const modis = {
		drawWalls: "wallColor",
		drawStart: "startColor",
		drawTarget: "endColor",
		eraseWalls: "cleanColor",
	};

	let currentModi = Object.entries(modis)[0][0];
	let showingSolve = false;
	let maze: number[][] = [];
	let stopped = false;

	async function showSolve(timeout: number = 50) {
		if (maze != null) {
			const {
				path: path,
				steps: steps,
			}: { path: [number, number][]; steps: stepsType } = solveMaze(
				algorithmSelect.value,
				maze
			);
			showingSolve = true;
			for (let step of steps) {
				if (stopped) {
					return;
				}
				drawPath(step.way, canvas, maze.length);
				drawVisited(step.visited, canvas, maze.length);
				await sleepNow(timeout);
				drawMaze();
			}
			drawPath(path, canvas, maze.length);
			showingSolve = false;
		}
	}

	solveMazeButton.addEventListener("click", async () => {
		const value = Math.min(
			parseInt(timeInput.max, 10),
			Math.max(parseInt(timeInput.min, 10), parseInt(timeInput.value, 10))
		);
		timeInput.value = value.toString();
		stopped = false;
		showSolve(value);
	});

	function getColorFromIndex(index: number) {
		return Object.entries(colors)[index][1].rgbString;
	}

	const drawMaze = () => {
		const size = getSize();
		const cellHeight = canvas.height / size;
		const cellWidth = canvas.width / size;
		const ctx = canvas.getContext("2d");
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				ctx.fillStyle = getColorFromIndex(maze[row][col]);
				ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
			}
		}
	};

	function getSize() {
		const size = Math.min(
			parseInt(sizeInput.max, 10),
			Math.max(parseInt(sizeInput.min, 10), parseInt(sizeInput.value, 10))
		);
		sizeInput.value = size.toString();
		return size;
	}

	generateMazeButton.addEventListener("click", async () => {
		stopped = true;
		const size = getSize();
		maze = generate(size);
		drawMaze();
	});

	function getColorFromPixelData(data: Uint8ClampedArray) {
		let color = null;
		for (const [key, value] of Object.entries(colors)) {
			let count = 0;
			for (let i = 0; i < value.rgb.length; i++) {
				if (value.rgb[i] == data[i]) count++;
			}
			if (count == value.rgb.length) {
				color = value.rgb;
			}
		}
		return color;
	}

	const drawVisited = (
		visited: boolean[][],
		canvas: HTMLCanvasElement,
		size: number
	) => {
		const cellHeight = canvas.height / size;
		const cellWidth = canvas.width / size;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = colors.visitedColor.rgbString;
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (
					getColorFromPixelData(
						ctx.getImageData(
							i * cellWidth + cellWidth / 2,
							j * cellHeight + cellHeight / 2,
							1,
							1
						).data
					) == colors.cleanColor.rgb &&
					visited[j][i]
				) {
					ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
				}
			}
		}
	};

	const drawPath = (
		path: [number, number][],
		canvas: HTMLCanvasElement,
		size: number
	) => {
		const cellHeight = canvas.height / size;
		const cellWidth = canvas.width / size;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = colors.algColor.rgbString;
		for (const [row, col] of path) {
			ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
		}
	};

	function getDataFromEvent(
		e: MouseEvent
	): [number, number, number, number, number, string] {
		const size = getSize();
		const cellHeight = canvas.height / size;
		const cellWidth = canvas.width / size;

		const posX = Math.floor(
			(e.clientX - canvas.getBoundingClientRect().x) /
				(canvas.getBoundingClientRect().width / size)
		);
		const posY = Math.floor(
			(e.clientY - canvas.getBoundingClientRect().y) /
				(canvas.getBoundingClientRect().height / size)
		);
		const colorName = modis[currentModi as keyof typeof modis];
		return [size, cellHeight, cellWidth, posX, posY, colorName];
	}

	canvas.addEventListener("click", (e: MouseEvent) => {
		const [size, cellHeight, cellWidth, posX, posY, colorName] =
			getDataFromEvent(e);
		const modi = modis[currentModi as keyof typeof modis];
		maze[posY][posX] = colors[modi as keyof typeof colors].index;

		drawMaze();
	});

	canvas.addEventListener("mousemove", (e: MouseEvent) => {
		if (showingSolve) {
			return;
		}
		const [size, cellHeight, cellWidth, posX, posY, colorName] =
			getDataFromEvent(e);
		const ctx = canvas.getContext("2d");

		drawMaze();

		const data = ctx.getImageData(
			posX * cellWidth + cellWidth / 2,
			posY * cellHeight + cellHeight / 2,
			1,
			1
		).data;
		let color = "";
		for (const [key, value] of Object.entries(colors)) {
			let count = 0;
			for (let i = 0; i < value.rgb.length; i++) {
				if (value.rgb[i] == data[i]) count++;
			}
			if (count == value.rgb.length) {
				color = key;
			}
		}
		if (color == "") {
			return;
		}
		ctx.fillStyle = colors.hoverColor.rgbString;
		ctx.fillRect(posX * cellWidth, posY * cellHeight, cellWidth, cellHeight);
	});

	clearWallsButton.addEventListener("click", () => {
		const size = getSize();
		maze = Array.from({ length: size }, () => Array(size).fill(0));
		drawMaze(); // Zeichne das Labyrinth
	});

	modiSelect.addEventListener("change", (e: Event) => {
		currentModi = modiSelect.value;
	});

	// Custom steppers: delegate clicks on .step to increment/decrement nearby number input
	document.addEventListener("click", e => {
		const target = e.target as HTMLElement;
		if (!target) return;

		if (target.classList.contains("step")) {
			// find the closest .number-input ancestor
			const container = target.closest(".number-input");
			if (!container) return;
			const input = container.querySelector("input[type=number]") as HTMLInputElement | null;
			if (!input) return;
			const stepAmount = 1;
			const min = input.min !== "" ? parseInt(input.min, 10) : undefined;
			const max = input.max !== "" ? parseInt(input.max, 10) : undefined;
			let value = input.value === "" ? 0 : parseInt(input.value, 10);
			if (target.classList.contains("step-up")) {
				value = isNaN(value) ? (min ?? 0) : value + stepAmount;
				if (typeof max !== "undefined") value = Math.min(value, max);
			} else if (target.classList.contains("step-down")) {
				value = isNaN(value) ? (min ?? 0) : value - stepAmount;
				if (typeof min !== "undefined") value = Math.max(value, min);
			}
			input.value = value.toString();
			// trigger change for any listeners
			input.dispatchEvent(new Event("change", { bubbles: true }));
		}
	});

	function solveMaze(
		algorithm: string,
		maze: number[][]
	): { path: [number, number][]; steps: stepsType } {
		console.log(maze);
		const { path: path, steps: steps } = (function () {
			switch (algorithm) {
				case "dfs":
					return solveDFS(maze);
				case "bfs":
					return solveBFS(maze);
				case "dijkstra":
					return solveDijkstra(maze);
				case "a-star":
					return solveAStar(maze);
				case "a-star both sides":
					return solveAStarBothSides(maze);
				default:
					return { path: [], steps: [] };
			}
		})();

		return { path: path, steps: steps };
	}
}
