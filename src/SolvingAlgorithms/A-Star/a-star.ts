export function solveAStar(maze : number[][]) {
    const size = maze.length;
    let start: [number, number] = [0, 0];
    let end: [number, number] = [0, 0];
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (maze[row][col] === 2) {
                start = [row, col];
                break;
            }
            if (maze[row][col] === 3) {
                end = [row, col];
                break;
            }
        }
    }
    const distance: number[][] = Array.from({ length: size }, () => Array(size).fill(Infinity));
    const previous: [number, number][][] = Array.from({ length: size }, () => Array(size).fill(null));
    const queue: [number, number, number][] = [[start[0], start[1], 0]];
    distance[start[0]][start[1]] = 0;
    const steps: [number, number][] = [];
    while (queue.length > 0) {
        queue.sort((a, b) => a[2] - b[2]);
        const [row, col, dist] = queue.shift();
        steps.push([row, col]);
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
            if (r < 0 || c < 0 || r >= size || c >= size || maze[r][c] === 1) {
                continue;
            }
            const newDist = dist + Math.abs(r - end[0]) + Math.abs(c - end[1]);
            if (newDist < distance[r][c]) {
                distance[r][c] = newDist;
                previous[r][c] = [row, col];
                queue.push([r, c, newDist]);
            }
        }
    }
    const path: [number, number][] = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current[0]][current[1]];
    }
    return {path: path, steps: steps};
}