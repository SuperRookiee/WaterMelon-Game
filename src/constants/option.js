import { Bodies } from "matter-js";

export const GAME_WIDTH = 650;
const GAME_HEIGHT = 800;

const WALL_WIDTH = 20;
const WALL_HEIGHT = GAME_HEIGHT;

export const COLLISION_MIN_X = WALL_WIDTH;
export const COLLISION_MAX_X = GAME_WIDTH - WALL_WIDTH;

const LINE_HEIGHT = 2;

const leftWall = Bodies.rectangle(WALL_WIDTH / 2, WALL_HEIGHT / 2, WALL_WIDTH, WALL_HEIGHT, {
    isStatic: true,
    render: {
        fillStyle: '#E6B143'
    },
});
const rightWall = Bodies.rectangle(GAME_WIDTH - WALL_WIDTH / 2, WALL_HEIGHT / 2, WALL_WIDTH, WALL_HEIGHT, {
    isStatic: true,
    render: {
        fillStyle: '#E6B143'
    },
});
const ground = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - WALL_WIDTH / 2, GAME_WIDTH, WALL_WIDTH, {
    isStatic: true,
    render: {
        fillStyle: '#E6B143'
    },
});
const topLine = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 4, GAME_WIDTH, LINE_HEIGHT, {
    name: 'topLine',
    isStatic: true,
    isSensor: true,
    render: {
        fillStyle: '#E6B143'
    },
});

export const WORLD_OPTION = [leftWall, rightWall, ground, topLine];

export const GAME_OPTION = {
    wireframes: false,
    background: '#F7F4C8',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
}