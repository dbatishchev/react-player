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
        default:
            return state;
    }
}
