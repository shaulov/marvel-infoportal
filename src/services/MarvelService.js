class MarvelService {
    #apiBase = 'https://gateway.marvel.com:443/v1/public/';
    #apiKey = 'apikey=79aa42515873b8889610444e14ec4446';

    DESCRIPTION_PLACEHOLDER = 'Character has no description';
    DESCRIPTION_LENGTH = 210;

    getResource = async (url) => {
        let result = await fetch(url);

        if (!result.ok) {
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this.#apiBase}characters?limit=9&offset=210&${this.#apiKey}`);
        return res.data.results.map(this.#transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this.#apiBase}characters/${id}?${this.#apiKey}`);
        return this.#transformCharacter(res.data.results[0]);
    }

    #transformCharacter = (char) => {

        let description = char.description ? `${char.description.substring(0, this.DESCRIPTION_LENGTH)}...` : this.DESCRIPTION_PLACEHOLDER;

        return {
            id: char.id,
            name: char.name,
            description: description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        };
    }
}

export default MarvelService;