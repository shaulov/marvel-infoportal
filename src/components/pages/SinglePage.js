import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({ Component, dataType }) => {
	const { id } = useParams();
	const [data, setData] = useState(null);

	const { getCharacter, getComic, clearError, process, setProcess } =
		useMarvelService();

	useEffect(() => {
		updateData();
	}, [id]);

	const updateData = () => {
		clearError();

		switch (dataType) {
			case 'comic':
				getComic(id)
					.then(onDataLoaded)
					.then(() => setProcess('confirmed'));
				break;
			case 'char':
				getCharacter(id)
					.then(onDataLoaded)
					.then(() => setProcess('confirmed'));
				break;
			default:
				return null;
		}
	};

	const onDataLoaded = (data) => {
		setData(data);
	};

	return (
		<>
			<AppBanner />
			{setContent(process, Component, data)}
		</>
	);
};

export default SinglePage;
