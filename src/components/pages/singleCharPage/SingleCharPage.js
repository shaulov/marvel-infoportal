import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import useMarvelService from '../../../services/MarvelService';

import '../singleComicPage/SingleComicPage';

const SingleCharPage = () => {
	const { charId } = useParams();
	const [char, setChar] = useState(null);

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [charId]);

	const updateChar = () => {
		clearError();
		getCharacter(charId).then(onCharLoaded);
	};

	const onCharLoaded = (char) => {
		setChar(char);
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !char) ? <View comic={char} /> : null;

	return (
		<>
			{errorMessage}
			{spinner}
			{content}
		</>
	);
};

const View = ({ comic }) => {
	const { name, thumbnail, fullDescription } = comic;

	return (
		<div className="single-comic">
			<img src={thumbnail} alt={name} className="single-comic__img" />
			<div className="single-comic__info">
				<h2 className="single-comic__name">{name}</h2>
				<p className="single-comic__descr">{fullDescription}</p>
			</div>
			<Link to="/" className="single-comic__back">
				Back to all
			</Link>
		</div>
	);
};

export default SingleCharPage;
