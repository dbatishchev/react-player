import React         from 'react';
import { PropTypes } from 'react';
import Immutable     from 'immutable';

export default class TodosView extends React.Component {
    static propTypes = {
        todos: PropTypes.instanceOf(Immutable.List).isRequired,
    };

    render() {
        return (
            <div id="todos-list">
                {
                    this.props.todos.map((todo, index) => {
                        let name = todo.get('name');
                        let image = todo.get('image');
                        return (
                            <div key={index}>
                                <span>{name}</span>
                                <span>{image}</span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
