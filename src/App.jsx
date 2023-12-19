import { useRecoilState } from "recoil";
import { scoreState } from "./stores/Game";
import ScoreBoard from "./components/ScoreBoard";
import Game from "./components/Game";
import KeyBoard from "./components/KeyBoard";

const App = () => {
    const [score, setScore] = useRecoilState(scoreState);

    return (
        <main id={`water_melon`}>
            <ScoreBoard score={score} />
            <Game setScore={setScore} />
            <KeyBoard />
        </main>
    );
};

export default App;