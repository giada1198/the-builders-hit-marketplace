import { useState, useEffect, useRef, Fragment } from 'react';
import { Button, Divider, Header, Progress, Segment } from 'semantic-ui-react';
import parse from 'html-react-parser';

import Options from './Options';
import Spinner from './Spinner';

export default function Play(props) {
	const [timer, setTimer] = useState(props.questions[0]['timer']);
	const [questionNumber, setQuestionNumber] = useState(0);
	const [questions, setQuestions] = useState(props.questions);
	const [selectedOptions, setSelectedOptions] = useState((props.questions[0]['type'] === 'radio-group' ||
		props.questions[0]['type'] === 'text') ? '' : props.questions[0]['type'] === 'checkbox' ||
		props.questions[0]['type'] === 'rating' ? [] : null);
	const [isLoading, setIsLoading] = useState(false);
	const [isRejected, setIsRejected] = useState(false);

	useEffect(() => {
		setQuestions(props.questions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		if(timer <= 0) {
			setTimer(0);
			setSelectedOptions(false);
			next();
		} else {
			setTimer(timer - 0.1);
		}
	}, 100);

	const next = () => {
		setIsLoading(true);
		// hard code answer check
		if(props.questions[questionNumber]['question'] === 'Recall that the person who replied to your question mentioned that he would not book Hotel Soho and Ivy Hotel.' && props.questions[questionNumber].type === 'rating' && selectedOptions[5] !== 0) {
			setTimeout(() => {
				setIsLoading(false);
				setIsRejected(true);
			}, 500)
		} else {
			// questions causing rejection
			const isCorrect = props.questions[questionNumber].answer !== null ?
			props.questions[questionNumber].type === 'radio-group' ? props.questions[questionNumber].answer === selectedOptions ? true : false :
			props.questions[questionNumber].type === 'rating' ? props.questions[questionNumber].answer.every((val, index) => val === selectedOptions[index]) ? true : false : true : true;
			if(isCorrect === false) {
				setTimeout(() => {
					setIsLoading(false);
					setIsRejected(true);
				}, 500)
			} else if((questionNumber + 1) < props.questions.length) {
				let nextQuestionNumber;
				// save answer
				if(props.questions[questionNumber]['question'] === "Imagine you work for a union that is attempting to organize a workplace. You are hoping to better understand workers' experiences and frustrations by creating a questionnaire so the union can highlight these issues. Write a short question using one of the following prompts:" && props.questions[questionNumber].type === 'text') {
					props.saveQuestion(selectedOptions);
				};
				// hard code question skipping
				// switch(selectedOptions) {
				// 	case 'I was arrested for animal smuggling.':
				// 		nextQuestionNumber = questionNumber + 4;
				// 		break;
				// 	case 'Neither of these things happened to me.':
				// 		nextQuestionNumber = questionNumber + 4;
				// 		break;
				// 	default:
				// 		nextQuestionNumber = questionNumber + 1;
				// }
				nextQuestionNumber = questionNumber + 1;

				let nso = (props.questions[nextQuestionNumber]['type'] === 'radio-group' ||
					props.questions[nextQuestionNumber]['type'] === 'text') ? '' : props.questions[nextQuestionNumber]['type'] === 'checkbox' ||
					props.questions[nextQuestionNumber]['type'] === 'rating' ? [] : null
				setSelectedOptions(nso);
				setTimeout(() => {
					setTimer(props.questions[nextQuestionNumber]['timer']);
					setQuestionNumber(nextQuestionNumber);
					setIsLoading(false);
				}, 500)
			} else {
				setTimeout(() => {
					setIsLoading(false);
					finish();
				}, 500)
			}
		}
	}

	const finish = () => {
		props.finish();
	}

	let options;
	if(isLoading === false && isRejected === false && questions.length >= 1) {
		let img;
		if(questions[questionNumber]['images'].length > 0) {
			if(questions[questionNumber]['images'].length === 1) {
				img = <img
					src={questions[questionNumber]['images'][0]}
					alt={''}
					width={'100%'}
					height={'auto'}
					style={{marginBottom: '1em'}}
				/>;
			} else if(questions[questionNumber]['images'].length === 2){
				img = <div style={{display: 'flex', maxWidth: '100%'}}>
					<img
						src={questions[questionNumber]['images'][0]}
						alt={''}
						width={'50%'}
						height={'50%'}
						style={{paddingRight: '0.25em', marginBottom: '1em'}}
					/>
					<img
						src={questions[questionNumber]['images'][1]}
						alt={''}
						width={'50%'}
						height={'50%'}
						style={{paddingLeft: '0.25em', marginBottom: '1em'}}
					/>
				</div>;
			}
			
		}
		options =
			<Fragment>
				<Header syle={{margin: '0'}} size='medium'>
					<Header.Subheader>{parse(questions[questionNumber]['heading'])}</Header.Subheader>
					{parse(questions[questionNumber]['question'])}
				</Header>
				<p>{parse(questions[questionNumber]['supplement'])}</p>
				{img}
				<Options
					key={questionNumber}
					keyNumber={questionNumber}
					question={questions[questionNumber]}
					updateAnswer={setSelectedOptions}
				/>
			</Fragment>;
	} else {
		options = <Spinner />;
	}

	let progress;
	let percent = 100-(timer/questions[questionNumber]['timer']*100);
	if(percent >= 100) {
		progress = <Progress percent={percent} attached='top' color='red'/>
	} else if(percent >= 66.66) {
		progress = <Progress percent={percent} attached='top' color='yellow'/>
	} else {
		progress = <Progress percent={percent} attached='top' color='blue'/>
	}

	return (
		isRejected ? 
			<Rejection
				heading={questions[questionNumber]['rejection-heading']}
				description={questions[questionNumber]['rejection-description']}
				reject={props.reject}
				submit={props.submit}
			/> :
			<Segment>
				{progress}
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<p style={{marginBottom: '0'}}>Question {questionNumber+1} of {questions.length}</p>
					<p style={{marginBottom: '0'}}>Time Left: {timer === false ? 0 : Math.ceil(timer)} sec</p>
				</div>
				{options}
				<Divider />
				<div style={{display: 'flex', justifyContent: 'flex-end'}}>
					<Button
						content={'Next'}
						color={'blue'}
						icon='right arrow'
						labelPosition='right'
						disabled={timer <= 0 || selectedOptions === '' || selectedOptions.length === 0 ||
							(typeof selectedOptions === 'object' && selectedOptions.includes(''))}
						onClick={next}
					/>
					{/* <Button
						content={(questionNumber + 1) < props.questions.length ? 'Next' : 'Submit'}
						color={(questionNumber + 1) < props.questions.length ? 'blue' : 'yellow'}
						icon='right arrow'
						labelPosition='right'
						disabled={timer <= 0 || selectedOptions === '' || selectedOptions.length === 0 ||
							(typeof selectedOptions === 'object') && selectedOptions.includes('')}
						onClick={next}
					/> */}
				</div>
			</Segment>
	)
}

function Rejection(props) {
	let d = 'We thank you for participating in this survey. You are not eligible at this time to continue this survey. Thank You!';
	let button = props.description === d ? <Button color='blue' onClick={props.submit}>Submit Hit</Button> :
		<Button color='blue' onClick={props.reject}>Submit Hit</Button>;
	return (
		<Segment>
            <Header as='h2' textAlign='center'>{props.heading}</Header>
            <p style={{textAlign: 'center'}}>{props.description}</p>
            <Divider />
            <div style={{textAlign: 'center'}}>
                {button}
            </div>
        </Segment>
	)
}

function useInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}