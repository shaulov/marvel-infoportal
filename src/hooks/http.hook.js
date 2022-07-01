import { useState, useCallback } from 'react';

export const useHttp = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [process, setProcess] = useState('waiting');

	const request = useCallback(
		async (
			url,
			method = 'GET',
			body = null,
			headers = { 'Content-Type': 'aplication/json' }
		) => {
			setLoading(true);
			setProcess('loading');

			try {
				const response = await fetch(url, { method, body, headers });

				if (!response.ok) {
					throw new Error(
						`Could not fetch ${url}, status: ${response.status}`
					);
				}

				const data = await response.json();

				setLoading(false);
				return data;
			} catch (err) {
				setLoading(false);
				setError(err.message);
				setProcess('error');
				throw err;
			}
		},
		[]
	);

	const clearError = useCallback(() => {
		setError(null);
		setProcess('loading');
	}, []);

	return { loading, request, error, clearError, process, setProcess };
};
