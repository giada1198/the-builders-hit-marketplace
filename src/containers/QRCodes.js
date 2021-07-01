import { useState, useEffect } from 'react';
import { Container, Header } from 'semantic-ui-react';
import QRCode from 'react-qr-code';

export default function Ranking(props) {
	const [usersData, setUsersData] = useState(props.usersData);

	useEffect(() => {
		setUsersData(props.usersData);
	}, [props.usersData]);

	let qrCodes = [];
	for (const [index, user] of Object.entries(usersData)) {
		if(user.role === 'worker' && user.session === 3) {
            const value = `https://show.iagreetotheterms.com/?email=${user.email}&id=${user.id}`;
            qrCodes.push(
                <div key={index} style={{margin: '15px 10px'}}>
                    <p>
                        <b>Session {user.session}</b>
                        <br />
                        <b>Email:</b> {user.email}
                        <br />
                        <b>ID:</b> {user.id}
                        <br />
                        <b>UID:</b> {index}
                        <br />
                        <a href="value">Login Link</a>
                    </p>
                    <div style={{display: 'inline-block', padding: '15px', border: 'solid #d3d3d3 0.5px'}}>
                        <QRCode value={value} />
                    </div>
                </div>
			);
        }
	}

    return (
		<Container>
            <Header as='h2' textAlign='center'>Login QR Codes</Header>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
			    {qrCodes}
            </div>
		</Container>
	)
}