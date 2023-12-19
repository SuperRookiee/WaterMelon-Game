import Game from "./components/Game";
import app from "./assets/scss/App.module.scss";

const App = () => {
    return (
        <main id={app.water_melon}>
            <section>
                <h1 id={app.title}>수박 게임 (スイカゲーム)</h1>
            </section>
            <Game/>
        </main>
    );
}

export default App;