import sb from "../assets/scss/ScoreBoard.module.scss";
import {useRecoilState, useSetRecoilState} from "recoil";
import {scoreState, themeState} from "../stores/Game.js";

const ScoreBoard = () => {
    const [score, setScore] = useRecoilState(scoreState);
    const setTheme = useSetRecoilState(themeState);
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'base' ? 'halloween' : 'base'));
        setScore(0);
    };
    return (
        <section>
            <h1 id={sb.title}>수박 게임</h1>
            <p>score : {score}</p>
            <button onClick={() => toggleTheme()}>테마 변경</button>
            <div className={sb.score}>
                {Array.from({length: 30}, (_, index) => (
                    <div key={index}>Score {index}</div>
                ))}
            </div>
        </section>
    );
};

export default ScoreBoard;