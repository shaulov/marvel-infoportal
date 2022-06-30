import { useState } from 'react';
import {
	Form,
	Formik,
	Field,
	ErrorMessage as FormikErrorMessage,
} from 'formik';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

const CharSearchForm = () => {
	const [char, setChar] = useState(null);
	const { loading, error, getCharacterByName, clearError } =
		useMarvelService();

	const onCharLoaded = (char) => {
		setChar(char);
	};

	const onUpdateSearch = (name) => {
		clearError();
		getCharacterByName(name).then(onCharLoaded);
	};

	const errorMessage = error ? (
		<div className="char__search-critical-error">
			<ErrorMessage />
		</div>
	) : null;

	const result =
		char && char.length > 0 ? (
			<div className="char__search-wrapper">
				<div className="char__search-success">
					There is! Visit {char[0].name} page?
				</div>
				<Link
					to={`/${char[0].id}`}
					className="button button__secondary"
				>
					<div className="inner">to page</div>
				</Link>
			</div>
		) : (
			<div className="char__search-error">
				The character was not found. Check the name and try again
			</div>
		);

	return (
		<div className="char__search-form">
			<Formik
				initialValues={{ search: '' }}
				validate={(values) => {
					const errors = {};
					if (!values.search) {
						errors.search = 'This field is required';
					}
					return errors;
				}}
				onSubmit={({ search }) => onUpdateSearch(search)}
			>
				<Form>
					<label className="char__search-label" htmlFor="charName">
						Or find a character by name:
					</label>
					<div
						name="search"
						type="text"
						className="char__search-wrapper"
					>
						<Field
							id="charName"
							name="search"
							type="text"
							placeholder="Enter name"
						/>
						<button
							className="button button__main"
							type="submit"
							disabled={loading}
						>
							<div className="inner">find</div>
						</button>
					</div>
					<FormikErrorMessage
						name="search"
						component="div"
						className="char__search-error"
					/>
				</Form>
			</Formik>
			{errorMessage}
			{result}
		</div>
	);
};

export default CharSearchForm;
