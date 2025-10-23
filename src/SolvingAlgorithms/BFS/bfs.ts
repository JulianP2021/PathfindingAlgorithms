import { stepsType } from "../types";
import { init, stepToPath } from "../utils";

export function solveBFS(maze: number[][]) {
    const {size, start, end} = init(maze);
    const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const previous: [number, number][][] = Array.from({ length: size }, () => Array(size).fill(null));
    const queue: [number, number][] = [[start[0], start[1]]];
    const steps: stepsType = [];
    while (queue.length > 0) {
        const [row, col] = queue.shift();
        steps.push({way:stepToPath(previous, [row, col]), visited:JSON.parse(JSON.stringify(visited))})
        if (visited[row][col]) {
            continue;
        }
        visited[row][col] = true;
        if (row === end[0] && col === end[1]) {
            break;
        }
        const neighbors = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];
        for (const [r, c] of neighbors) {
            if (r < 0 || c < 0 || r >= size || c >= size || maze[r][c] === 1 || visited[r][c]) {
                continue;
            }

            previous[r][c] = [row, col];
            queue.push([r, c]);

        }
    }
    const path = stepToPath(previous, end);
    return { path: path, steps: steps };
}