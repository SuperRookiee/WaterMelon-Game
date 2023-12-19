import {useState, useEffect, useRef, memo} from 'react';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from '../constants/fruits.js';

const Game = memo(() => {
    const containerRef = useRef();
    const canvasRef = useRef();
    const [THEME, setTheme] = useState('base');
    const [FRUITS, setFruits] = useState(THEME === 'halloween' ? FRUITS_HLW : FRUITS_BASE);

    const engine = Engine.create();

    useEffect(() => {
        const render = Render.create({
            engine,
            element: containerRef.current,
            canvas: canvasRef.current,
            options: {
                wireframes: false,
                background: '#F7F4C8',
                width: 650,
                height: 900,
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

    const world = engine.world;

    const leftWall = Bodies.rectangle(15, 395, 30, 950, {
        isStatic: true,
        render: {
            fillStyle: '#E6B143'
        },
    });

    const rightWall = Bodies.rectangle(635, 395, 30, 950, {
        isStatic: true,
        render: {
            fillStyle: '#E6B143'
        },
    });

    const ground = Bodies.rectangle(310, 885, 680, 30, {
        isStatic: true,
        render: {
            fillStyle: '#E6B143'
        },
    });

    const topLine = Bodies.rectangle(310, 150, 675, 2, {
        name: 'topLine',
        isStatic: true,
        isSensor: true,
        render: {
            fillStyle: '#E6B143'
        },
    });

    World.add(world, [leftWall, rightWall, ground, topLine]);


    let currentBody = null;
    let currentFruit = null;
    let disableAction = false;
    let interval = null;

    const addFruit = () => {
        const index = Math.floor(Math.random() * 5);
        const fruit = FRUITS[index];

        const body = Bodies.circle(300, 50, fruit.radius, {
            index: index,
            isSleeping: true,
            render: {
                sprite: {
                    texture: `${fruit.name}.png`
                },
            },
            restitution: 0.2,
        });

        currentBody = body;
        currentFruit = fruit;

        World.add(world, body);
    };

    useEffect(() => {
        addFruit(); // 컴포넌트가 마운트될 때 초기 과일 추가
    }, []); // 빈 배열을 전달하여 한 번만 실행되도록 함

    useEffect(() => {
        setFruits(THEME === 'halloween' ? FRUITS_HLW : FRUITS_BASE); // 테마가 변경될 때마다 과일 업데이트
    }, [THEME]);

    useEffect(() => {
        // 이벤트 핸들러 등록 및 해제
        const handleKeyDown = (event) => {
            if (disableAction) {
                return;
            }

            switch (event.code) {
                case 'KeyA':
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
                    if (interval) return;
                    interval = setInterval(() => {
                        if (currentBody.position.x + currentFruit.radius < 590)
                            Body.setPosition(currentBody, {
                                x: currentBody.position.x + 1,
                                y: currentBody.position.y,
                            });
                    }, 5);
                    break;

                case 'KeyS':
                    currentBody.isSleeping = false;
                    disableAction = true;

                    setTimeout(() => {
                        addFruit();
                        disableAction = false;
                    }, 1000);
                    break;
            }
        };

        const handleKeyUp = (event) => {
            switch (event.code) {
                case 'KeyA':
                case 'KeyD':
                    clearInterval(interval);
                    interval = null;
                    break;
            }
        };

        const handleCollision = (event) => {
            event.pairs.forEach((collision) => {
                if (collision.bodyA.index === collision.bodyB.index) {
                    const index = collision.bodyA.index;

                    if (index === FRUITS.length - 1) {
                        return;
                    }

                    World.remove(world, [collision.bodyA, collision.bodyB]);

                    const newFruit = FRUITS[index + 1];

                    const newBody = Bodies.circle(
                        collision.collision.supports[0].x,
                        collision.collision.supports[0].y,
                        newFruit.radius, {
                        render: {
                            sprite: {
                                texture: `${newFruit.name}.png`
                            },
                        },
                        index: index + 1,
                    }
                    );

                    World.add(world, newBody);
                }

                if (
                    !disableAction &&
                    (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')
                ) {
                    alert('Game over');
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        Events.on(engine, 'collisionStart', handleCollision);

        return () => {
            // 컴포넌트가 언마운트되거나 업데이트되기 전에 이벤트 핸들러 등록 해제
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