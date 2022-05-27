import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        selectedItem: null,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();

        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }
    
    onScroll = (evt) => {
        console.log(evt);
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        });
    }

    onCharListLoaded = (newCharList) => {
        let ended = newCharList.length < 9 ? true : false;

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    charSelectedHandle = (id) => {
        this.setState({
            selectedItem: id,
        });
        this.props.onCharSelected(id);
    }

    renderItems = (arr) => {
        const items = arr.map((item) => {
            let imgStyle = {objectFit: 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {objectFit: 'fill'};
            }

            let className = 'char__item ';
            if (item.id === this.state.selectedItem) {
                className += 'char__item_selected';
            }

            return (
                <li 
                    className={className}
                    key={item.id}
                    onClick={() => this.charSelectedHandle(item.id)}>
                    <img src={item.thumbnail} alt="Character item" style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={charEnded ? {display: 'none'} : {}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;