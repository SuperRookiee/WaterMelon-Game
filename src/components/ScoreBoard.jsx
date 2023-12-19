import sb from "../assets/scss/ScoreBoard.module.scss";
import {useRecoilValue} from "recoil";
import {scoreState} from "../stores/Game.js";

const ScoreBoard = () => {
    const score = useRecoilValue(scoreState);

    return (
        <section>
            <h1 id={sb.title}>수박 게임</h1>
            <span>score : {score}</span>
        </section>
    );
};

export default ScoreBoard;