import {atom} from "recoil";

/** 점수 **/
export const scoreState = atom({
    key: 'scoreState',
    default: 0,
});

export const themeState = atom({
    key: 'themeState',
    default: 'base',
});