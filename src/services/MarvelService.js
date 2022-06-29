import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=79aa42515873b8889610444e14ec4446';
	const _baseOffset = 210;

	const DESCRIPTION_PLACEHOLDER = 'Character has no description';
	const DESCRIPTION_LENGTH = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(
			`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	};

	const getCharacterByName = async (name) => {
		const res = await request(
			`${_apiBase}characters?name=${name}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const getAllComics = async (offset = 10) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
	};

	const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

	const _transformCharacter = (char) => {
		let description = char.description
			? `${char.description.substring(0, DESCRIPTION_LENGTH)}...`
			: DESCRIPTION_PLACEHOLDER;

		return {
			id: char.id,
			name: char.name,
			description: description,
			thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	};

	const _transformComics = (comics) => {
		const price = comics.prices[0].price
			? `${comics.prices[0].price}$`
			: 'Not available';
		const pageCount = comics.pageCount
			? `${comics.pageCount} pages`
			: 'Does not contain information about the number of pages';
		const description = comics.description
			? comics.description
			: 'Comic has no description';

		return {
			id: comics.id,
			title: comics.title,
			thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
			details: comics.urls[0].url,
			price: price,
			pageCount: pageCount,
			description: description,
			language: comics.textObjects.language || 'en-us',
		};
	};

	return {
		loading,
		error,
		getAllCharacters,
		getCharacter,
		getCharacterByName,
		getAllComics,
		getComic,
		clearError,
	};
};

export default useMarvelService;
