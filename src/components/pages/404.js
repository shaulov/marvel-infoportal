import { Link } from 'react-router-dom';

import img from '../../resources/img/404.gif';

const Page404 = () => {
    return (
        <div>
            <img alt="404. Not found" src={img} style={{ display: 'block', objectFit: 'contain', margin: '0 auto' }}/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
            <Link
                style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}}
                to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;