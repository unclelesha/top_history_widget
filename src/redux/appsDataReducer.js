import {FETCH_APPS_DATA} from './types';

const initialState = {
    fetchedAppsData: {},
};

export const appsDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_APPS_DATA:
            return {...state, fetchedAppsData: action.payload};
        default: return state;
    }
};
