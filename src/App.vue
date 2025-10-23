<template>
    <div class="app">
        <aside class="config" aria-label="Configuration panel">
            <h2 class="config-title">Controls</h2>
            <p class="hint">Click to draw walls, use draw mode to place start/target.</p>

            <div class="control-row">
                <button id="clear-walls">Clear walls</button>
            </div>

            <div class="control-row">
                <label for="modi-select">Draw mode</label>
                <select id="modi-select">
                    <option value="drawWalls">Draw Walls</option>
                    <option value="drawStart">Draw Start</option>
                    <option value="drawTarget">Draw Target</option>
                    <option value="eraseWalls">Erase Walls</option>
                </select>
            </div>

            <div class="control-row">
                <label for="size-input">Maze size</label>
                <input type="number" id="size-input" min="5" max="50" value="10" />
            </div>

            <div class="control-row">
                <label for="time-input">Delay (ms)</label>
                <input type="number" id="time-input" min="1" max="200" value="10" />
            </div>

            <div class="control-row">
                <label for="algorithm-select">Algorithm</label>
                <select id="algorithm-select">
                    <option value="dijkstra">Dijkstra</option>
                    <option value="a-star">A*</option>
                    <option value="a-star both sides">A* Both Sides</option>
                    <option value="bfs">Breadth-First Search</option>
                    <option value="dfs">Depth-First Search</option>
                </select>
            </div>

            <div class="control-row actions">
                <button id="solve-maze" class="primary">Solve maze</button>
                <button id="generate-maze" class="secondary">Generate maze</button>
            </div>
        </aside>

        <main class="main">
            <header class="title-card">
                <h1>Pathfinding Visualizer - Julian</h1>
            </header>

            <section class="canvas-wrap">
                <canvas id="maze"></canvas>
            </section>
        </main>
    </div>
</template>

<script setup>

import { onMounted, onUnmounted } from 'vue';
import { setupDocumentListeners } from './renderer.ts';

onMounted(() => {
    setupDocumentListeners();
});
</script>