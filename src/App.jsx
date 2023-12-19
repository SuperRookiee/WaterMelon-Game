import app from "./assets/scss/App.module.scss";
import {useRecoilValue} from "recoil";
import {scoreState} from "./stores/Game.js"
import Game from "./components/Game";

const App = () => {
    const score = useRecoilValue(scoreState);

    return (
        <main id={app.water_melon}>
            <section>
                <h1 id={app.title}>수박 게임</h1>
                <span>score : {score}</span>
            </section>
            <Game/>
        </main>
    );
}

export default App;