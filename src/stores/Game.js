import {atom} from 'recoil';

/** 점수 **/
export const scoreState = atom({
    key: 'scoreState',
    default: 0,
});

export const bestScoreState = atom({
    key: 'bestScoreState',
    default: typeof window !== 'undefined'
        ? Number(localStorage.getItem('bestScore') || 0)
        : 0,
});

export const themeState = atom({
    key: 'themeState',
    default: 'base',
});

export const resetState = atom({
    key: 'resetState',
    default: 0,
});