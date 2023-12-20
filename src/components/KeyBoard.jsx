import kb from '../assets/scss/Keyboard.module.scss';

const KeyBoard = () => {
    const handleButtonClick = (key) => {
        const event = new KeyboardEvent('keydown', { key });
        window.dispatchEvent(event);
    };

    return (
        <section id={kb.control}>
            <div id={kb.keyboard}>
                <button id='up' className={kb.keyButton} onClick={() => handleButtonClick('ArrowUp')}>&uarr;</button>
                <button id='left' className={kb.keyButton} onClick={() => handleButtonClick('ArrowLeft')}>&larr;</button>
                <button id='down' className={kb.keyButton} onClick={() => handleButtonClick('ArrowDown')}>&darr;</button>
                <button id='right' className={kb.keyButton} onClick={() => handleButtonClick('ArrowRight')}>&rarr;</button>
            </div>
        </section>
    );
};

export default KeyBoard;