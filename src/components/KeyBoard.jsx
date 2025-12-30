import kb from '../assets/scss/Keyboard.module.scss';

const KeyBoard = () => {
    const dispatchKey = (type, key, code) => {
        const event = new KeyboardEvent(type, {key, code});
        window.dispatchEvent(event);
    };

    const handlePointerDown = (key, code) => dispatchKey('keydown', key, code);
    const handlePointerUp = (key, code) => dispatchKey('keyup', key, code);

    return (
        <section id={kb.control}>
            <div id={kb.keyboard}>
                <button
                    aria-label="과일 밀기"
                    className={kb.keyButton}
                    onMouseDown={() => handlePointerDown('ArrowUp', 'ArrowUp')}
                    onMouseUp={() => handlePointerUp('ArrowUp', 'ArrowUp')}
                    onMouseLeave={() => handlePointerUp('ArrowUp', 'ArrowUp')}
                >
                    &uarr;
                </button>
                <button
                    aria-label="왼쪽 이동"
                    className={kb.keyButton}
                    onMouseDown={() => handlePointerDown('ArrowLeft', 'ArrowLeft')}
                    onMouseUp={() => handlePointerUp('ArrowLeft', 'ArrowLeft')}
                    onMouseLeave={() => handlePointerUp('ArrowLeft', 'ArrowLeft')}
                >
                    &larr;
                </button>
                <button
                    aria-label="과일 떨어뜨리기"
                    className={kb.keyButton}
                    onMouseDown={() => handlePointerDown('ArrowDown', 'ArrowDown')}
                    onMouseUp={() => handlePointerUp('ArrowDown', 'ArrowDown')}
                    onMouseLeave={() => handlePointerUp('ArrowDown', 'ArrowDown')}
                >
                    &darr;
                </button>
                <button
                    aria-label="오른쪽 이동"
                    className={kb.keyButton}
                    onMouseDown={() => handlePointerDown('ArrowRight', 'ArrowRight')}
                    onMouseUp={() => handlePointerUp('ArrowRight', 'ArrowRight')}
                    onMouseLeave={() => handlePointerUp('ArrowRight', 'ArrowRight')}
                >
                    &rarr;
                </button>
            </div>
        </section>
    );
};

export default KeyBoard;