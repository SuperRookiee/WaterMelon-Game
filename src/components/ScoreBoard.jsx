import sb from '../assets/scss/ScoreBoard.module.scss';
import {useEffect} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {bestScoreState, resetState, scoreState, themeState} from '../stores/Game.js';

const ScoreBoard = () => {
    const [score, setScore] = useRecoilState(scoreState);
    const [bestScore, setBestScore] = useRecoilState(bestScoreState);
    const setResetState = useSetRecoilState(resetState);
    const [theme, setTheme] = useRecoilState(themeState);

    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
        }
    }, [bestScore, score, setBestScore]);

    useEffect(() => {
        localStorage.setItem('bestScore', bestScore.toString());
    }, [bestScore]);

    const triggerReset = () => {
        setScore(0);
        setResetState((value) => value + 1);
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'base' ? 'halloween' : 'base'));
        triggerReset();
    };

    return (
        <section className={sb.panel}>
            <div className={sb.header}>
                <div>
                    <p className={sb.kicker}>Watermelon Merge</p>
                    <h1 id={sb.title}>수박 게임</h1>
                    <p className={sb.tagline}>서서히 커지는 과일을 이어 붙여 더 큰 과일을 만들어 보세요!</p>
                </div>
                <div className={sb.themeToggle}>
                    <span>현재 테마</span>
                    <strong>{theme === 'base' ? '기본' : '할로윈'}</strong>
                    <button type="button" onClick={toggleTheme}>테마 변경</button>
                </div>
            </div>

            <div className={sb.scores}>
                <div>
                    <p className={sb.label}>현재 점수</p>
                    <p className={sb.value}>{score}</p>
                </div>
                <div>
                    <p className={sb.label}>최고 점수</p>
                    <p className={sb.value}>{bestScore}</p>
                </div>
            </div>

            <div className={sb.actions}>
                <button type="button" onClick={triggerReset}>게임 리셋</button>
                <p className={sb.helper}>A/D 또는 방향키로 이동하고 S/↓로 과일을 떨어트릴 수 있어요.</p>
            </div>
        </section>
    );
};

export default ScoreBoard;