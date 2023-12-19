import { useState, useEffect, useRef, memo } from 'react';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from '../constants/fruits.js';

const Game = memo(({ setScore }) => {
    const size = window.innerWidth > 450 ? { width: 650, height: 800 } : { width: 350, height: 530 };
    const containerRef = useRef();
    const canvasRef = useRef();
    const [THEME, setTheme] = useState('base');
    const [FRUITS, setFruits] = useState(THEME === 'base' ? FRUITS_BASE : FRUITS_HLW);
    const engine = Engine.create();
    const world = engine.world;

    /** 게임 환경 (x y 가로 세로) **/
    const leftWall = Bodies.rectangle(10, size.height / 2, 20, size.height, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
    });
    const rightWall = Bodies.rectangle(size.width - 10, size.height / 2, 20, size.height, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
    });
    const ground = Bodies.rectangle(size.width / 2, size.height - 10, size.width, 20, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
    });
    const topLine = Bodies.rectangle(size.width / 2, size.height / 5, size.width - 10, 2, {
        name: 'topLine',
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#E6B143' },
    });

    World.add(world, [leftWall, rightWall, ground, topLine]);

    let currentBody = null;
    let currentFruit = null;
    let disableAction = false;
    let interval = null;

    /** 컴포넌트가 마운트될 때 초기 과일 추가 **/
    const addFruit = () => {
        const index = 4;
        const fruit = FRUITS[index];
        const body = Bodies.circle(size.width / 2, size.height / 10, fruit.radius, {
            index: index,
            isSleeping: true,
            render: {
                sprite: {
                    texture: `${THEME}/${fruit.name}.png`
                },
            },
            restitution: 0.2,
        });

        currentBody = body;
        currentFruit = fruit;

        World.add(world, body);
    };

    useEffect(() => {
        const render = Render.create({
            engine,
            element: containerRef.current,
            canvas: canvasRef.current,
            options: {
                wireframes: false,
                background: '#F7F4C8',
                width: size.width,
                height: size.height,
            },
        });
        containerRef.current.appendChild(render.canvas);
        Render.run(render);
        Runner.run(engine);

        return () => {
            Render.stop(render);
            Runner.stop(engine.runner);
            Engine.clear(engine);
        };
    }, [engine]);

    useEffect(() => {
        addFruit();
    }, []);

    useEffect(() => {
        setFruits(THEME === 'base' ? FRUITS_BASE : FRUITS_HLW);
    }, [THEME]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (disableAction) return;

            switch (event.code) {
                case 'KeyA':
                case 'ArrowLeft':
                    if (interval) return;
                    interval = setInterval(() => {
                        if (currentBody.position.x - currentFruit.radius > 30)
                            Body.setPosition(currentBody, {
                                x: currentBody.position.x - 1,
                                y: currentBody.position.y,
                            });
                    }, 5);
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    if (interval) return;
                    interval = setInterval(() => {
                        if (currentBody.position.x + currentFruit.radius < 620)
                            Body.setPosition(currentBody, {
                                x: currentBody.position.x + 1,
                                y: currentBody.position.y,
                            });
                    }, 5);
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    currentBody.isSleeping = false;
                    disableAction = true;
                    setTimeout(() => {
                        addFruit(true);
                        disableAction = false;
                        setScore((prev) => prev + 100)
                    }, 1000);
                    break;
            }
        };

        const handleKeyUp = (event) => {
            switch (event.code) {
                case 'KeyA':
                case 'KeyD':
                case 'ArrowLeft':
                case 'ArrowRight':
                    clearInterval(interval);
                    interval = null;
                    break;
            }
        };

        /** 충돌 이벤트 **/
        const handleCollision = (event) => {
            event.pairs.forEach((collision) => {
                if (collision.bodyA.index === collision.bodyB.index) {
                    const index = collision.bodyA.index;

                    if (index === FRUITS.length - 1) return;

                    World.remove(world, [collision.bodyA, collision.bodyB]);
                    const newFruit = FRUITS[index + 1];
                    const newBody = Bodies.circle(
                        collision.collision.supports[0].x,
                        collision.collision.supports[0].y,
                        newFruit.radius, {
                        render: {
                            sprite: {
                                texture: `${THEME}/${newFruit.name}.png`
                            },
                        },
                        index: index + 1,
                    }
                    );
                    setScore((prev) => prev + (index + 2) * 100)
                    World.add(world, newBody);
                }
                if (!disableAction && (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')) {
                    alert('Game over');
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        Events.on(engine, 'collisionStart', handleCollision);

        return () => {
            /** 컴포넌트가 언마운트되거나 업데이트되기 전에 이벤트 핸들러 등록 해제 **/
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            Events.off(engine, 'collisionStart', handleCollision);
        };
    }, [disableAction, interval, currentBody, currentFruit, THEME, FRUITS, world, engine]);

    return (
        <section ref={containerRef}>
            <canvas ref={canvasRef} />
        </section>
    )
});

export default Game;