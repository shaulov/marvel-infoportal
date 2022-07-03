import { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />;
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />;
		case 'confirmed':
			return <Component />;
		case 'error':
			return <ErrorMessage />;
		default:
			throw new Error('Unexpected process state');
	}
};

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});

	const onScroll = () => {
		if (newItemLoading) return;
		if (charEnded) {
			window.removeEventListener('scroll', onScroll);
		}
		if (
			window.pageYOffset + window.innerHeight >=
			document.body.offsetHeight
		) {
			onRequest(offset, false);
		}
	};

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
			.then(() => setProcess('confirmed'));
	};

	const onCharListLoaded = (newCharList) => {
		let ended = newCharList.length < 9 ? true : false;

		setCharList((charList) => [...charList, ...newCharList]);
		setNewItemLoading(false);
		setOffset((offset) => offset + 9);
		setCharEnded(ended);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item) =>
			item.classList.remove('char__item_selected')
		);
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (
				item.thumbnail ===
				'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			) {
				imgStyle = { objectFit: 'fill' };
			}

			return (
				<CSSTransition
					key={item.id}
					timeout={500}
					className="char__item"
				>
					<li
						className="char__item"
						ref={(el) => (itemRefs.current[i] = el)}
						onClick={() => {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}}
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								props.onCharSelected(item.id);
								focusOnItem(i);
							}
						}}
					>
						<img
							src={item.thumbnail}
							alt="Character item"
							style={imgStyle}
						/>
						<div className="char__name">{item.name}</div>
					</li>
				</CSSTransition>
			);
		});

		return (
			<ul className="char__grid">
				<TransitionGroup component={null}>{items}</TransitionGroup>
			</ul>
		);
	}

	const elements = useMemo(() => {
		return setContent(process, () => renderItems(charList), newItemLoading);
		// eslint-disable-next-line
	}, [process]);

	return (
		<div className="char__list">
			{elements}
			<button
				className="button button__main button__long"
				disabled={newItemLoading}
				onClick={() => onRequest(offset)}
				style={charEnded ? { display: 'none' } : {}}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
