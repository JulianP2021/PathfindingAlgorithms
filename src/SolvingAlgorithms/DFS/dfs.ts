export function solveDFS (maze:number[][]) {
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
    const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const previous: [number, number][][] = Array.from({ length: size }, () => Array(size).fill(null));
    const stack: [number, number][] = [];
    const steps: [number, number][] = [];
    stack.push(start);
    while (stack.length > 0) {
        const [row, col] = stack.pop();
        steps.push([row, col]);

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
            stack.push([r, c]);
        }
    }
    const path:[number, number][] = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current[0]][current[1]];
    }
    return {path: path, steps: steps};
}