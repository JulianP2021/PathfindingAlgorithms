<template>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8" />
        <title>Pathfinding Visualizer</title>
    </head>

    <body>
        <div class="background-title">
            <h1>Pathfinding Visualizer</h1>
        </div>
        <p>Click to draw walls, click on the modi select to draw the start and endpoint.</p>
        <div class="center">
            <button id="clear-walls">Clear walls</button>
        </div>
        <div class="center">
            Select draw mode:
            <select id="modi-select">
                <option value="drawWalls">draw Walls</option>
                <option value="drawStart">draw Start</option>
                <option value="drawTarget">draw Target</option>
                <option value="eraseWalls">erase Target</option>
            </select>
        </div>
        <div class="center">
            <label for="size-input">Maze Size:</label>
            <input type="number" id="size-input" min="5" max="50" value="10" />

        </div>
        <div class="center">
            <label for="time-input">Time (ms):</label>
            <input type="number" id="time-input" min="1" max="50" value="10" />

        </div>
        <br>

        <div class="center">
            <select id="algorithm-select">
                <option value="dijkstra">Dijkstra</option>
                <option value="a-star">A*</option>
                <option value="bfs">Breath-First Search</option>
                <option value="dfs">Depth-First Search</option>
            </select>
        </div>

        <div class="stretch">
            <button id="solve-maze">Solve maze</button>
            <button id="generate-maze">Generate random maze</button>
        </div>

        <br>

        <canvas id="maze"></canvas>

    </body>

    </html>
</template>

<script setup>

import { onMounted, onUnmounted } from 'vue';
import { setupDocumentListeners } from './renderer.ts';

onMounted(() => {
    setupDocumentListeners();
    console.log('Event listeners set up');
});
console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>