declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { generate } from './Maze/Maze';
import { solveDijkstra } from './SolvingAlgorithms/Dijkstra/dijkstra';
import { solveAStar } from './SolvingAlgorithms/A-Star/a-star';
import { solveBFS } from './SolvingAlgorithms/BFS/bfs';
import { solveDFS } from './SolvingAlgorithms/DFS/dfs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('maze:generate', async (event, size: number) => {
  return generate(size);
});

ipcMain.handle('maze:solve', async (event, {algorithm: algorithm, maze: maze}): Promise<{ path: [number, number][], steps: [number, number][] }> => {
  console.log(maze);
  
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
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
