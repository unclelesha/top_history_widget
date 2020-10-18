import {FETCH_COUNTRIES, SET_SELECT_COUNTRY_ID} from './types';

const initialState = {
    fetchedCountries: [],
    selectCountryId: '',
};

export const countryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COUNTRIES:
            return {...state, fetchedCountries: action.payload};
        case SET_SELECT_COUNTRY_ID:
            return {...state, selectCountryId: action.payload};
        default: return state;
    }
};
