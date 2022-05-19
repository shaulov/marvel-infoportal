class MarvelService {
    #apiBase = 'https://gateway.marvel.com:443/v1/public/';
    #apiKey = 'apikey=79aa42515873b8889610444e14ec4446';

    getResource = async (url) => {
        let result = await fetch(url);

        if (!result.ok) {
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this.#apiBase}characters?limit=9&offset=210&${this.#apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResource(`${this.#apiBase}characters/${id}?${this.#apiKey}`);
    }
}

export default MarvelService;