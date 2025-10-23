export function stepToPath(
	previous: [number, number][][],
	steps: [number, number]
) {
	const path: [number, number][] = [];
	let current = steps;
	while (current) {
		path.unshift(current);
		current = previous[current[0]][current[1]];
	}
	return path;
}

export function init(maze: number[][]) {
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
	return { size, start, end };
}
