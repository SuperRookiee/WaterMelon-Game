import {atom} from 'recoil';

/** 점수 **/
export const scoreState = atom({
    key: 'scoreState',
    default: 0,
});

const getInitialBestScore = () => {
    if (typeof window === 'undefined') return 0;

    const stored = Number(localStorage.getItem('bestScore'));
    return Number.isFinite(stored) ? stored : 0;
};

export const bestScoreState = atom({
    key: 'bestScoreState',
    default: getInitialBestScore(),
});

export const themeState = atom({
    key: 'themeState',
    default: 'base',
});

export const resetState = atom({
    key: 'resetState',
    default: 0,
});