import { Link } from 'react-router-dom';

import './singleCharLayout.scss';

const SingleCharLayout = ({ data }) => {
	const { name, thumbnail, fullDescription } = data;

	return (
		<div className="single-char">
			<img src={thumbnail} alt={name} className="single-comic__img" />
			<div className="single-char__info">
				<h2 className="single-char__name">{name}</h2>
				<p className="single-char__descr">{fullDescription}</p>
			</div>
			<Link to="/" className="single-char__back">
				Back to all
			</Link>
		</div>
	);
};

export default SingleCharLayout;
