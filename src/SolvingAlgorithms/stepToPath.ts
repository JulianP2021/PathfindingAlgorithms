export function stepToPath (previous:[number, number][][], steps: [number, number]) {

    const path:[number, number][] = [];
    let current = steps
    while (current) {
        path.unshift(current);
        current = previous[current[0]][current[1]];
    }
    return path;
}