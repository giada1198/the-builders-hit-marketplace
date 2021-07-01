import { Fragment } from 'react'
import { Button, Header, Icon, Table, Container } from "semantic-ui-react";
import hitList from '../data/hit-list.json';

export default function Lobby(props) {
	// const shuffleArray = (a) => {
    //     for(let i = a.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [a[i], a[j]] = [a[j], a[i]];
    //     }
    //     return a;
    // }

	let hits = [];
	let i = 1;
	for (const [key, value] of Object.entries(hitList)) {
		hits.push(<Hit
			key={i}
			number={i}
			title={`${key} ${value['reward-description']}`}
			hitName={key}
			isLocked={props.isLocked}
			isGhosted={value['is-ghosted']}
			isCompleted={props.userData.hitsCompleted.includes(key)}
			isRejected={props.userData.hitsRejected.includes(key)}
			chageHit={props.changeHit}
		/>);
		i += 1;
	}
	// hits = shuffleArray(hits);
	
	return (
		<Container>
			<UserInfo userData={props.userData} />
			<Header as='h3'>Available Hits</Header>
			<Table compact striped selectable unstackable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>#</Table.HeaderCell>
						<Table.HeaderCell>Title</Table.HeaderCell>
						<Table.HeaderCell>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{hits}
				</Table.Body>
			</Table>
		</Container>
	)
}

function Hit(props) {
	const button = props.isGhosted ? <Button compact disabled content='Accept' color='yellow' /> :
		props.isRejected ? <Button compact disabled content='Rejected' color='red' /> :
		props.isCompleted ? <Button compact disabled content='Finished' color='grey' /> :
		props.isLocked ? <Button compact disabled content='Accept' color='yellow' /> :
		<Button compact content='Accept' color='yellow' onClick={() => props.chageHit(props.hitName)}/>
	return (
		<Table.Row>
			<Table.Cell>{props.number}</Table.Cell>
			{/* <Table.Cell>{props.isGhosted ? <Icon name='signal' color='red' /> : <Icon name='signal' color='green' />}</Table.Cell> */}
			<Table.Cell>
				{props.isCompleted ? props.isRejected ? <Icon name='close' color='red' /> :
					<Icon name='check' color='green' /> : null}
				{props.title}
			</Table.Cell>
			<Table.Cell>{button}</Table.Cell>
		</Table.Row>
	)
}

function UserInfo(props) {
	// console.log(props.userData);
	let approvalRate = Math.round(100-(100*(props.userData.hitsRejected.length-1)/(props.userData.hitsCompleted.length-1)));
	if(isNaN(approvalRate)) approvalRate = 0;
	const money = Number.parseFloat(props.userData.money).toFixed(2);
	return (
		<Fragment>
			<Table compact unstackable definition size='small' textAlign='center'>
					<Table.Body>
						<Table.Row>
							<Table.Cell><Icon name='user' />Name</Table.Cell>
							<Table.Cell>{props.userData.name}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell><Icon name='id card' />Work ID</Table.Cell>
							<Table.Cell>{props.userData.id}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell><Icon name='envelope' />Email Address</Table.Cell>
							<Table.Cell>{props.userData.email}</Table.Cell>
						</Table.Row>
					</Table.Body>
			</Table>
			<Table unstackable textAlign='center' >
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Approval Rate</Table.HeaderCell>
						<Table.HeaderCell>$Money Earned</Table.HeaderCell>
						<Table.HeaderCell>#HITS Completed</Table.HeaderCell>
						<Table.HeaderCell>#HITS Rejected</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row warning textAlign='center'>
						<Table.Cell><Icon name='checkmark' />{`${approvalRate}%`}</Table.Cell>
						<Table.Cell><Icon name='dollar sign'/ >{money}</Table.Cell>
						<Table.Cell><Icon name='inbox' /> {props.userData.hitsCompleted.length-1}</Table.Cell>
						<Table.Cell><Icon name='close' />{props.userData.hitsRejected.length-1}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</Fragment>
	)
}