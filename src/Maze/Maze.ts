export function generate(size: number) {
  const cols = size; // Anzahl der Spalten
  const rows = size; // Anzahl der Zeilen

  // Erstellen eines 2D-Arrays für das Labyrinth
  const maze: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Zufälliges Labyrinth generieren (einfaches Beispiel)
  for(let row = 1; row < rows - 1; row++) {
    for(let col = 1; col < cols - 1; col++) {
      maze[row][col] = Math.random() > 0.7 ? 1 : 0;
    }
  }

  maze[1][1] = 2; // Startpunkt
  maze[rows - 2][cols - 2] = 3; // Zielpunkt
  return maze;
}