import { useState, useEffect } from 'react';
import { Container, Grid, Header, Table } from 'semantic-ui-react';

export default function Ranking(props) {
	const [usersData, setUsersData] = useState(props.usersData);

	useEffect(() => {
		setUsersData(props.usersData);
		console.log(props.usersData);
	}, [props.usersData]);

	let workers = [];
	for (const [key, value] of Object.entries(usersData)) {
		if(value.session === props.session && value.role === 'worker' && value.page !== 'new' && value.page !== 'onboarding' && 
			value.hitsRejected !== undefined && value.hitsCompleted !== undefined) {
			let emailName = value.email.split("@")[0];
			let starSigns = '';
			for(let i = 0; i < value.email.split("@")[1].length; i++) starSigns += '*';
			let approvalRate = Math.round(100-(100*(value.hitsRejected.length-1)/(value.hitsCompleted.length-1)));
			if(isNaN(approvalRate)) approvalRate = 0;
			workers.push({
				key: key,
				id: value.id,
				name: value.name,
				email: `${emailName}@${starSigns}`,
				approvalRate: approvalRate
			});
		}
	}

	// sort workers based on their approval rate
	workers.sort(function (a, b) {
		return b.approvalRate - a.approvalRate;
	});

	// add 2 fake participants
	workers.push({
		key: 9998,
		id: 934577,
		name: 'Karen',
		email: 'karen@iagreetotheterms.com',
		approvalRate: 0
	},
	{
		key: 9999,
		id: 499433,
		name: 'Chad',
		email: 'chad@iagreetotheterms.com',
		approvalRate: 0
	})

	let grouping = [];
	if(workers.length >= 14) {
		grouping.push(14);
		grouping.push(workers.length - grouping[0]);
	} else {
		grouping.push(workers.length);
		grouping.push(0);
	}
	
	let rank = 0;
	let previousApprovalRate = 101;
	const outputLeft = workers.slice(0, grouping[0]).map((worker, index) => {
		if(worker.approvalRate < previousApprovalRate) {
			previousApprovalRate = worker.approvalRate;
			rank += 1;
		}
		const strike = (worker.email === 'karen@iagreetotheterms.com' || worker.email === 'chad@iagreetotheterms.com') && props.cue >= 25;
		return (
			<Table.Row key={index}>
				<Table.Cell>{strike ? <del>{rank}</del> : rank}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.id}</del> : worker.id}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.name}</del> : worker.name}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.approvalRate}%</del> : worker.approvalRate + '%'}</Table.Cell>
			</Table.Row>
		)
	});
	const outputRight = workers.slice(grouping[0]).map((worker, index) => {
		if(worker.approvalRate < previousApprovalRate) {
			previousApprovalRate = worker.approvalRate;
			rank += 1;
		}
		const strike = (worker.email === 'karen@iagreetotheterms.com' || worker.email === 'chad@iagreetotheterms.com') && props.cue >= 25;
		return (
			<Table.Row key={index}>
				<Table.Cell>{strike ? <del>{rank}</del> : rank}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.id}</del> : worker.id}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.name}</del> : worker.name}</Table.Cell>
				<Table.Cell>{strike ? <del>{worker.approvalRate}%</del> : worker.approvalRate + '%'}</Table.Cell>
			</Table.Row>
		)
	});

    return (
		<Container>
			<Header as='h2' textAlign='center'>Reputation Ranking</Header>
			<Grid columns={2} stackable>
				<Grid.Column>
					<Table compact unstackable size='large'>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Rank</Table.HeaderCell>
								<Table.HeaderCell>Worker ID</Table.HeaderCell>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Approval Rate</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{outputLeft}
						</Table.Body>
					</Table>
				</Grid.Column>
				<Grid.Column>
					<Table compact unstackable size='large'>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Rank</Table.HeaderCell>
								<Table.HeaderCell>Worker ID</Table.HeaderCell>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Approval Rate</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{outputRight}
						</Table.Body>
					</Table>
				</Grid.Column>
			</Grid>
		</Container>
	)
}