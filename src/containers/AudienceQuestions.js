import { useState, useEffect } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';

export default function Ranking(props) {
	const [usersData, setUsersData] = useState(props.usersData);

	useEffect(() => {
		setUsersData(props.usersData);
	}, [props.usersData]);

	let questions = [];
	let totalMoney = 0;
	for (const [index, user] of Object.entries(usersData)) {
		if(user.role === 'worker' && user.page === 'lobby' && user.question !== '') {
            questions.push({
                key: index,
                session: user.session,
				name: user.name,
				question: user.question
			});
			if(user.session === props.session) {
				totalMoney += user.money;
			}
        }        
	}

	questions.sort(function (a, b) {
		return b.session - a.session;
	});

	const output = questions.map((worker, index) => {
		return (
			<Table.Row key={index}>
				<Table.Cell>{worker.session}</Table.Cell>
				<Table.Cell>{worker.name}</Table.Cell>
				<Table.Cell>{worker.question}</Table.Cell>
			</Table.Row>
		)
	});

    return (
		<Container>
			<Header as='h2' textAlign='center'>Audience Questions</Header>
			<Table compact unstackable celled size='large' textAlign='center'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Total Earning</Table.HeaderCell>
                        <Table.HeaderCell>20% Cut</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
					<Table.Row>
						<Table.Cell>${totalMoney.toFixed(2)}</Table.Cell>
						<Table.Cell>${(totalMoney*0.2).toFixed(2)}</Table.Cell>
					</Table.Row>
                </Table.Body>
            </Table>
            <Table unstackable size='large'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Session</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Question</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {output}
                </Table.Body>
            </Table>
		</Container>
	)
}