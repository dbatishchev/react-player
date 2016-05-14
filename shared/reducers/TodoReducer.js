import Immutable from 'immutable';
import _ from 'lodash';

const defaultState = new Immutable.List();

export default function todoReducer(state = defaultState, action) {
    switch (action.type) {
        case 'GET_TOP_ARTISTS':
            let artists = _.map(action.res.data.artists.artist, (artist) => {
                artist.image = artist.image[3]['#text'];
                return artist;
            });
            return new Immutable.List(artists);
        case 'GET_TODOS':
            return new Immutable.List(action.res.data);
        case 'CREATE_TODO':
            return state.concat(action.res.data.text);
        case 'EDIT_TODO':
            return state.set(action.id, action.text);
        case 'DELETE_TODO':
            return state.delete(action.id);
        default:
            return state;
    }
}
