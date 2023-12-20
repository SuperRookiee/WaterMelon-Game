import {useRecoilValue} from "recoil";
import {themeState} from "./stores/Game";
import ScoreBoard from "./components/ScoreBoard";
import Game from "./components/Game";
import KeyBoard from "./components/KeyBoard";

const App = () => {
    const theme = useRecoilValue(themeState);
    return (
        <main id={`water_melon`}>
            <ScoreBoard/>
            <Game theme={theme}/>
            <KeyBoard/>
        </main>
    );
};

export default App;