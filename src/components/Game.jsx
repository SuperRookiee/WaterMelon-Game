import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Bodies, Body, Composite, Engine, Events, Render, Runner, World} from 'matter-js';
import {FRUITS_BASE, FRUITS_HLW} from '../constants/fruits.js';
import {COLLISION_MAX_X, COLLISION_MIN_X, GAME_OPTION, GAME_WIDTH, createWorldBounds} from '../constants/option.js';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {resetState, scoreState} from '../stores/Game';

const Game = memo(({theme}) => {
    const resetSignal = useRecoilValue(resetState);
    const setScoreState = useSetRecoilState(scoreState);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(Engine.create());
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const intervalRef = useRef(null);
    const disableActionRef = useRef(false);
    const currentBodyRef = useRef(null);
    const currentFruitRef = useRef(null);
    const [gameStatus, setGameStatus] = useState('playing');

    const FRUITS = useMemo(() => (theme === 'base' ? FRUITS_BASE : FRUITS_HLW), [theme]);

    const attachWorld = useCallback(() => {
        const engine = engineRef.current;
        const world = engine.world;

        World.clear(world, false);
        Composite.clear(world, false);
        Engine.clear(engine);
        createWorldBounds().forEach((body) => World.add(world, body));
        currentBodyRef.current = null;
        currentFruitRef.current = null;
    }, []);

    const stopMovement = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const spawnFruit = useCallback((awardBonus = false) => {
        const index = Math.floor(Math.random() * (FRUITS.length / 2));
        const fruit = FRUITS[index];
        const body = Bodies.circle(GAME_WIDTH / 2, 70, fruit.radius, {
            index,
            isSleeping: true,
            render: {
                sprite: {
                    texture: `${theme}/${fruit.name}.png`,
                },
            },
            restitution: 0.2,
        });

        currentBodyRef.current = body;
        currentFruitRef.current = fruit;
        World.add(engineRef.current.world, body);
        if (awardBonus) {
            setScoreState((score) => score + 50);
        }
    }, [FRUITS, setScoreState, theme]);

    const resetGame = useCallback(() => {
        stopMovement();
        disableActionRef.current = false;
        setGameStatus('playing');
        attachWorld();
        spawnFruit(true);
    }, [attachWorld, spawnFruit, stopMovement]);

    const dropFruit = useCallback(() => {
        if (!currentBodyRef.current || disableActionRef.current) return;
        currentBodyRef.current.isSleeping = false;
        disableActionRef.current = true;
        setTimeout(() => {
            spawnFruit();
            disableActionRef.current = false;
        }, 800);
    }, [spawnFruit]);

    const move = useCallback((direction) => {
        if (!currentBodyRef.current || !currentFruitRef.current) return;

        if (direction === 'left' && currentBodyRef.current.position.x - currentFruitRef.current.radius > COLLISION_MIN_X) {
            Body.setPosition(currentBodyRef.current, {
                x: currentBodyRef.current.position.x - 1,
                y: currentBodyRef.current.position.y,
            });
        }
        if (direction === 'right' && currentBodyRef.current.position.x + currentFruitRef.current.radius < COLLISION_MAX_X) {
            Body.setPosition(currentBodyRef.current, {
                x: currentBodyRef.current.position.x + 1,
                y: currentBodyRef.current.position.y,
            });
        }
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (disableActionRef.current) return;

        switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
            if (intervalRef.current) return;
            intervalRef.current = setInterval(() => move('left'), 5);
            break;
        case 'KeyD':
        case 'ArrowRight':
            if (intervalRef.current) return;
            intervalRef.current = setInterval(() => move('right'), 5);
            break;
        case 'KeyS':
        case 'ArrowDown':
            dropFruit();
            break;
        default:
            break;
        }
    }, [dropFruit, move]);

    const handleKeyUp = useCallback((event) => {
        switch (event.code) {
        case 'KeyA':
        case 'KeyD':
        case 'ArrowLeft':
        case 'ArrowRight':
            stopMovement();
            break;
        default:
            break;
        }
    }, [stopMovement]);

    useEffect(() => {
        const engine = engineRef.current;
        const render = Render.create({
            engine,
            element: containerRef.current,
            canvas: canvasRef.current,
            options: GAME_OPTION,
        });

        renderRef.current = render;
        Render.run(render);
        runnerRef.current = Runner.run(engine);
        attachWorld();
        spawnFruit(true);

        return () => {
            stopMovement();
            Render.stop(render);
            if (runnerRef.current) {
                Runner.stop(runnerRef.current);
            }
            Engine.clear(engine);
            render.canvas?.remove();
            render.textures = {};
        };
    }, [attachWorld, spawnFruit, stopMovement]);

    useEffect(() => {
        resetGame();
        setScoreState(0);
    }, [resetSignal, theme, resetGame, setScoreState]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    useEffect(() => {
        const engine = engineRef.current;

        const handleCollision = (event) => {
            event.pairs.forEach((collision) => {
                if (collision.bodyA.index === collision.bodyB.index) {
                    const index = collision.bodyA.index;

                    if (index === FRUITS.length - 1) return;

                    World.remove(engine.world, [collision.bodyA, collision.bodyB]);
                    const newFruit = FRUITS[index + 1];
                    const newBody = Bodies.circle(
                        collision.collision.supports[0].x,
                        collision.collision.supports[0].y,
                        newFruit.radius,
                        {
                            render: {
                                sprite: {
                                    texture: `${theme}/${newFruit.name}.png`,
                                },
                            },
                            index: index + 1,
                        },
                    );
                    World.add(engine.world, newBody);
                    setScoreState((score) => score + index * 100);
                }

                if (!disableActionRef.current && (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')) {
                    setGameStatus('over');
                    disableActionRef.current = true;
                    stopMovement();
                }
            });
        };

        Events.on(engine, 'collisionStart', handleCollision);
        return () => {
            Events.off(engine, 'collisionStart', handleCollision);
        };
    }, [FRUITS, setScoreState, stopMovement, theme]);

    return (
        <section className="game-area">
            <div className={`game-frame ${gameStatus === 'over' ? 'is-over' : ''}`} ref={containerRef}>
                <canvas ref={canvasRef}/>
                {gameStatus === 'over' && (
                    <div className="game-overlay">
                        <p>게임 오버! 다시 도전해보세요.</p>
                    </div>
                )}
            </div>
        </section>
    );
});

export default Game;