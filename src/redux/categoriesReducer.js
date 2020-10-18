import {FETCH_CATEGORIES} from './types';

const initialState = {
    fetchedCategories: [],
    subCategoriesMap: {
        1: 'Top Free',
        2: 'Top Paid',
        3: 'Top Grossing',
        4: 'Top Free',
        5: 'Top Paid',
        6: 'Top Grossing',
        7: 'New Free',
        8: 'New Paid',
        9: 'Trending',
    },
};

export const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES:
            return {...state, fetchedCategories: action.payload};
        default: return state;
    }
};
