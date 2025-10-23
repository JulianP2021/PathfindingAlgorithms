import { init, stepToPath } from "../utils";
import { stepsType } from "../types";

export function solveAStar(maze: number[][]) {
	const { size, start, end } = init(maze);
	const visited: boolean[][] = Array.from({ length: size }, () =>
		Array(size).fill(false)
	);
	const distance: number[][] = Array.from({ length: size }, () =>
		Array(size).fill(Infinity)
	);
	const previous: [number, number][][] = Array.from({ length: size }, () =>
		Array(size).fill(null)
	);
	const queue: [number, number, number][] = [[start[0], start[1], 0]];
	distance[start[0]][start[1]] = 0;
	const steps: stepsType = [];
	while (queue.length > 0) {
		const result = solveAStarInternal(
			maze,
			start,
			end,
			visited,
			distance,
			previous,
			size,
			queue,
			steps
		);
		if (result[0] === end[0] && result[1] === end[1]) {
			break;
		}
	}
	const path = stepToPath(previous, end);
	return { path: path, steps: steps };
}

function solveAStarInternal(
	maze: number[][],
	start: [number, number],
	end: [number, number],
	visited: boolean[][],
	distance: number[][],
	previous: [number, number][][],
	size: number,
	queue: [number, number, number][],
	steps: stepsType
) {
	queue.sort((a, b) => a[2] - b[2]);
    console.log(queue, steps);
	const [row, col, dist] = queue.shift();
	visited[row][col] = true;
	steps.push({
		way: stepToPath(previous, [row, col]),
		visited: JSON.parse(JSON.stringify(visited)),
	});
	if (row === end[0] && col === end[1]) {
		return [row, col];
	}
	const neighbors = [
		[row - 1, col],
		[row + 1, col],
		[row, col - 1],
		[row, col + 1],
	];
	for (const [r, c] of neighbors) {
		if (r < 0 || c < 0 || r >= size || c >= size || maze[r][c] === 1) {
			continue;
		}
		const newDist =
			dist + Math.pow(2, Math.abs(r - end[0])) + Math.pow(2, Math.abs(c - end[1]));
		if (newDist < distance[r][c] && !visited[r][c]) {
			distance[r][c] = newDist;
			previous[r][c] = [row, col];
			queue.push([r, c, newDist]);
		}
	}
	return [row, col];
}

export function solveAStarBothSides(maze: number[][]): {
	path: [number, number][];
	steps: stepsType;
} {
	// Implementation for A* Both Sides can be added here
	const { size, start, end } = init(maze);
	const visited: boolean[][] = Array.from({ length: size }, () =>
		Array(size).fill(false)
	);
	const distance1: number[][] = Array.from({ length: size }, () =>
		Array(size).fill(Infinity)
	);
	const distance2: number[][] = Array.from({ length: size }, () =>
		Array(size).fill(Infinity)
	);
	const previous1: [number, number][][] = Array.from({ length: size }, () =>
		Array(size).fill(null)
	);
    const previous2: [number, number][][] = Array.from({ length: size }, () =>
		Array(size).fill(null)
	);
	const queue1: [number, number, number][] = [[start[0], start[1], 0]];
	const queue2: [number, number, number][] = [[end[0], end[1], 0]];
	distance1[start[0]][start[1]] = 0;
	distance2[end[0]][end[1]] = 0;
	const steps: stepsType = [];
	const meetingPoints: Map<string, [number, number][]> = new Map();
	while (queue1.length > 0 || queue2.length > 0) {
		const result1 = solveAStarInternal(
			maze,
			start,
			end,
			visited,
			distance1,
			previous1,
			size,
			queue1,
			steps
		);
		const result2 = solveAStarInternal(
			maze,
			end,
			start,
			visited,
			distance2,
			previous2,
			size,
			queue2,
			steps
		);

        if(meetingPoints.has(`[${result1[0]}, ${result1[1]}]`)) {
            const path1 = stepToPath(previous1, [result1[0], result1[1]]);
            const path2 = meetingPoints.get(`[${result1[0]}, ${result1[1]}]`).reverse();
            steps.push({
                way: [...path1, ...path2],
                visited: JSON.parse(JSON.stringify(visited)),
            });
            return { path: [...path1, ...path2], steps: steps };
        }
        if(meetingPoints.has(`[${result2[0]}, ${result2[1]}]`)) {
            const path1 = meetingPoints.get(`[${result2[0]}, ${result2[1]}]`).reverse();
            const path2 = stepToPath(previous2, [result2[0], result2[1]]);
            steps.push({
                way: [...path1, ...path2],
                visited: JSON.parse(JSON.stringify(visited)),
            });
            return { path: [...path1, ...path2], steps: steps };
        }
        if (result1[0] === result2[0] && result1[1] === result2[1]) {
            const path1 = stepToPath(previous1, [result1[0], result1[1]]);
            const path2 = stepToPath(previous2, [result2[0], result2[1]]).reverse();
            steps.push({
                way: [...path1, ...path2],
                visited: JSON.parse(JSON.stringify(visited)),
            });
            return { path: [...path1, ...path2], steps: steps };
        }
        meetingPoints.set(`[${result1[0]}, ${result1[1]}]`, stepToPath(previous1, [result1[0], result1[1]]));
        meetingPoints.set(`[${result2[0]}, ${result2[1]}]`, stepToPath(previous2, [result2[0], result2[1]]));
	}

	return { path: [], steps: [] };
}
