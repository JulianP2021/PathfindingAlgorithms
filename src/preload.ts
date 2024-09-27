// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('maze', {
    generate: (size: number) => ipcRenderer.invoke('maze:generate', size),
    solve: (algorithm: string): Promise<{path: [number, number][], steps: [number, number][]}> => ipcRenderer.invoke('maze:solve', algorithm)
})
