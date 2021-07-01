import React, { useState, useEffect, Fragment } from 'react';
// import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Container, Message, Segment } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/auth';

import Login from './containers/Login';
import Onboarding from './containers/Onboarding';
import Hit from './containers/Hit';
import HitsPhaseA from './containers/HitsPhaseA';
import Lobby from './containers/Lobby';
import CueList from './containers/CueList';
import Ranking from './containers/Ranking';
import AudienceQuestions from './containers/AudienceQuestions';
import QRCodes from './containers/QRCodes';
import Spinner from './components/Spinner';

import data from './data/data.json';
import cueList from './data/cue-list.json';
// import accounts from './data/account.json';
import './App.css';

export default function App() {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [usersData, setUsersData] = useState(null);
	const [publicData, setPublicData] = useState(null);

	const [currentCueNumber, setCurrentCueNumber] = useState(null);
	const [currentHit, setCurrentHit] = useState('none');

	const [page, setPage] = useState('login');
	const [adminPage, setAdminPage] = useState('cue-list');

	const signIn = (email, password) => { // a callback function for logging in existing users
		// setState({ errorMessage: null }); // clear any old errors
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// signed in
				let user = userCredential.user;
				console.log('User signs in: ' + user.uid);
			})
			.catch((error) => {
				console.log(error.message);
				// setState({ errorMessage: error.message });
			});
  	}

  	const signOut = () => { // a callback function for logging out the current user
		// setState({ errorMessage: null }); // clear any old errors
		firebase.auth().signOut()
			.catch((error) => {
				console.log(error.message);
				// setState({ errorMessage: error.message });
			});
		setUser(null);
		setUserData(null);
  	}

	// const createAccounts = () => {
	// 	for(let i = 0 ; i < accounts['email'].length ; i++) {
	// 		const u = {
	// 			email: accounts['email'][i],
	// 			id: accounts['id'][i],
	// 			session: 3,
	// 			role: 'worker',
	// 			page: 'new'
	// 		};
	// 		firebase.database().ref(`users/${accounts['uid'][i]}`).set(u);
	// 	}
	// }
	
	useEffect(() => {
		const authUnregFunc = firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				console.log('logged in');
				setUser(user);
				firebase.database().ref('users').on('value', (snapshot) => {
					let d = snapshot.val();
					setUserData(d[user.uid]);
					if(d[user.uid]['role'] === 'admin') {
						setUsersData(d);
						setPage(d[user.uid]['page']);
						// createAccounts();
					} else if(d[user.uid]['role'] === 'worker') {
						// console.log('user role: ' + d[user.uid]['role']);
						setPage(d[user.uid]['page']);
						// create initial firebase data for new users
						if(d[user.uid]['page'] === 'new') {
							firebase.database().ref(`users/${user.uid}/name`).set(d[user.uid].email.split("@")[0]);
							firebase.database().ref(`users/${user.uid}/hitsCompleted`).set(['nothing']);
							firebase.database().ref(`users/${user.uid}/hitsRejected`).set(['nothing']);
							firebase.database().ref(`users/${user.uid}/money`).set(0.0);
							firebase.database().ref(`users/${user.uid}/question`).set('');
							setTimeout(() => {
								firebase.database().ref(`users/${user.uid}/page`).set('onboarding');
							}, 1000)
						}
					}
				});
				// create public data listener
				firebase.database().ref('public').on('value', (snapshot) => {
					let d = snapshot.val();
					setPublicData(d);
					setCurrentCueNumber(cueToCueNumber(d['cue']));
				});
			}
			else { // firebaseUser undefined: is not logged in
				console.log('logged out');
				firebase.database().ref('users').off('value');
				firebase.database().ref('public').off('value');
			}
		});
		// Specify how to clean up after this effect:
		return () => {
			authUnregFunc();
			firebase.database().ref('users').off('value');
		};
	}, []);

	const cueToCueNumber = (c) => {
		return cueList['cues'][c]['no'];
	};

	// const cueNumberToCue = (n) => {
	// 	let c = 0;
	// 	cueList['cues'].forEach((cue) => {
	// 		if(cue['no'] === n) return c;
	// 		c += 1;
	// 	});
	// 	return null;
	// };

	const changeCue = (q) => {
		if(userData['role'] === 'admin') {
			firebase.database().ref('public/cue').set(q);
		}
	}

	const changePage = (p) => {
		firebase.database().ref(`users/${user.uid}/page`).set(p);
	}

	const changeAdminPage = (p) => {
		setAdminPage(p);
	}

	const resetLS = () => {
		firebase.database().ref(`users/llk1VYKlo4ZpM7S8NXCtlbYAQG43/page`).set('new');
	};

	const changeHit = (hitName) => {
		setCurrentHit(hitName);
	};

	const submitHit = () => {
		changeHit('none');
	};

	const saveName = (name) => {
		firebase.database().ref(`users/${user.uid}/name`).set(name);
	};

	const saveQuestion = (q) => {
		firebase.database().ref(`users/${user.uid}/question`).set(q);
	};

	const updateUserData = (type, value) => {
		if(type === 'hitsCompleted') {
			let updatedData = [...userData['hitsCompleted']];
			typeof value === 'object' ? updatedData = updatedData.concat(value) : updatedData.push(value);
			firebase.database().ref(`users/${user.uid}/hitsCompleted`).set(updatedData);
		} else if(type === 'hitsRejected' && value !== '') {
			let updatedData = [...userData['hitsRejected']];
			typeof value === 'object' ? updatedData = updatedData.concat(value) : updatedData.push(value);
			firebase.database().ref(`users/${user.uid}/hitsRejected`).set(updatedData);
		} else if(type === 'money') {
			firebase.database().ref(`users/${user.uid}/money`).set(userData['money']+value);
		}
	}

	let output = null;
	if(user && userData !== null && publicData !== null) {
		if(userData['role'] === 'admin') {
			if(page === 'dashboard') {
				switch(adminPage) {
					case 'cue-list':
						output = <CueList
							userData={userData}
							publicData={publicData}
							changeCue={changeCue}
						/>;
						break;
					case 'reputation-ranking':
						output = <Ranking
							cue={currentCueNumber}
							session={publicData.session}
							usersData={usersData}
						/>
						break;
					case 'audience-questions':
						output = <AudienceQuestions
							session={publicData.session}
							usersData={usersData}
						/>
						break;
					case 'audience-qr-codes':
						output = <QRCodes
							session={publicData.session}
							usersData={usersData}
						/>
						break;
					default:
						output = '';
				}
			}			
		} else if(userData['role'] === 'worker' || userData['role'] === 'invisible-worker') {
			if(userData['session'] !== 0 && userData['session'] !== publicData['session'] && userData['role'] !== 'invisible-worker') {
				output = <TextMessage
					icon={'calendar alternate outline'}
					header={'Your session has not started yet.'}
					content={'Please come back later.'}
				/>;
			} else {
				if(page === 'new') {
					output = <Spinner />;
				} else if(page === 'onboarding') {
					output = <Onboarding
						user={user}
						userData={userData}
						currentCueNumber={currentCueNumber}
						changePage={changePage}
						saveName={saveName}
					/>;
				} else {
					switch(currentCueNumber) {
						case 10:
							output = <TextMessage
								icon={'warehouse'}
								header={`Welcome to The Builders HIT Marketplace, ${userData.name}!`}
								content={'You are in the right place — you will be instructed on what to do next.'}
							/>;
							break;
						case 20:
						case 25:
							if(page === 'hits') {
								userData['hitsCompleted'].includes('phase-a-4') ? changePage('lobby') :
								output = <HitsPhaseA
									key='HitsPhaseA'
									data={data}
									changePage={changePage}
									updateUserData={updateUserData}
									saveQuestion={saveQuestion}
								/>;
							} else if(page === 'lobby') {
								output = (
									<Fragment>
										<Lobby
											key={'locked-lobby'}
											data={data}
											userData={userData}
											isLocked={true}
											changeHit={changeHit}
										/>
										<Footer />
									</Fragment>
								)};
							break;
						case 30:
							if(page === 'lobby') {
								if(currentHit === 'none') {
									output = (
										<Fragment>
											<Lobby
												key={'lobby'}
												data={data}
												userData={userData}
												isLocked={false}
												changeHit={changeHit}
											/>
											<Footer />
										</Fragment>
									);
								} else {
									output = <Hit
										questions={data[currentHit]}
										submit={submitHit}
										updateUserData={updateUserData}
										saveQuestion={saveQuestion}
									/>;
								}
							} else if(page === 'hits') {
								output = <Spinner />;
								setTimeout(() => {
									changePage('lobby');
								}, 500);								
							}
							break;
						default:
							output = '';
					}
				}
			}
		}
	}

	return (
		<div className="App">
			<Login
				user={user}
				userData={userData}
				signIn={signIn}
				signOut={signOut}
				changePage={changePage}
				changeAdminPage={changeAdminPage}
				resetLS={resetLS}
			/>
			{output}
		</div>
	);
}

function TextMessage(props) {
	return (
		<Container text>
            <Message
				icon={props.icon}
				header={props.header}
				content={props.content}
			/>
        </Container>
	);
}

function Footer() {
	return (
		<Segment secondary as="footer">
			<Container textAlign="center">
				<p>© 2021 The Builders Association.</p>
			</Container>
		</Segment>
	)
}