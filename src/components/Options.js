import { useState, useEffect } from 'react';
import { Checkbox, Form, Radio } from 'semantic-ui-react';
import Spinner from './Spinner';

export default function Options(props) {
	const [input, setInput] = useState(null);

	useEffect(() => {
        if(props.question['type'] === 'radio-group' || props.question['type'] === 'text' ) setInput('');
		else if(props.question['type'] === 'checkbox') setInput(new Array(props.question['options'].length).fill(false));
		else if(props.question['type'] === 'rating') setInput(new Array(props.question['options'].length).fill(''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);

	useEffect(() => {
		if(input !== null) {
			if(props.question['type'] === 'radio-group') props.updateAnswer(input);
			else if(props.question['type'] === 'checkbox') {
				let answer = [];
				input.forEach((element, index) => {
					if(element) answer.push(props.question['options'][index]);
				});
				props.updateAnswer(answer);
			}
			else if(props.question['type'] === 'text') props.updateAnswer(input);
			else if(props.question['type'] === 'rating') props.updateAnswer(input);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[input])

	const handleChange = (event, { value }) => {
		setInput(value);
	};

	const handleCheckBoxChange = (position) => {
		let updatedInput = input.map((item, index) =>
			index === position ? !item : item
	  	);
		setInput(updatedInput);
	}

	const handleRatingChange = (label, position) => {
		let updatedInput = input.map((item, index) =>
			index === label ? position : item
	  	);
		setInput(updatedInput);
	}

	let output = <Spinner />;
	if(input !== null) {
		if(props.question['type'] === 'radio-group') {
			output = props.question['options'].map((option, i) => {
				return (
					<Form.Field key={`${props.keyNumber}-${i}`}>
						<Radio
							key={`${props.keyNumber}-${i}`}
							label={option}
							value={option}
							checked={input === option}
							onChange={handleChange}
						/>
					</Form.Field>
				)
			});
		} else if(props.question['type'] === 'checkbox') {
			output = props.question['options'].map((option, i) => {
				return (
					<Form.Field key={`${props.keyNumber}-${i}`}>
						<Checkbox
							key={`${props.keyNumber}-${i}`}
							label={option}
							checked={input[i]}
							onChange={() => handleCheckBoxChange(i)}
						/>
					</Form.Field>
				)
			});
		} else if(props.question['type'] === 'text') {
			output = <Form>
				<Form.TextArea
					placeholder={props.question['input-placeholder'] === null? 'Enter your answer here' : props.question['input-placeholder']}
					value={input}
					onChange={handleChange}
				/>
			</Form>;
		} else if(props.question['type'] === 'rating') {
			const sp1 = [ "Hotel Soho", "Ivy Hotel", "Hotel Urbanica" ];
			const sp2 = [ "I am dead", "I am alive", "I can read this sentence", "This sentence is invisible", "I am currently answering questions online", "I am currently on the moon." ];
			let radioNumber = (props.question.options.every((val, index) => val === sp1[index])) ? 3 :
				(props.question.options.every((val, index) => val === sp2[index])) ? 2 : 5;
			output = props.question['options'].map((option, i) => {
				let buttons = [];
				for(let j = 0; j < radioNumber; j++) {
					buttons.push(
						<div style={ j < radioNumber - 1 ? {marginRight: '1em'} : {marginRight: '0.5em'} }>
							<Radio
								key={`${props.keyNumber}-${i}-${j}`}
								label={ radioNumber === 2 ? j === 0 ? 'TRUE' : 'FALSE' : j+1 }
								value={ j+1 }
								checked={input[i] === j}
								onChange={() => handleRatingChange(i, j)}
							/>
						</div>
					)
				}
				let labels = [];
				if(props.question.labels !== null) {
					labels = props.question.labels[i].map((label, index) => {
						return (
							<div style={ index === 1 ? { textAlign: 'right' } : { textAlign: 'left' } }>{label}</div>
						)
					});
				}
				return (
					// <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '0.5em 0'}} key={`${props.keyNumber}-${i}`}>
					<div style={{display: 'flex', width: '100%', flexDirection: 'column', margin: '0.75em 0'}} key={`${props.keyNumber}-${i}`}>
						<label><b>{option}</b></label>
						<div>
							<div style={ {display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,.6)'} }>{labels}</div>
							<div style={ radioNumber === 2 ? {display: 'flex'} : {display: 'flex', justifyContent: 'space-between'} }>{buttons}</div>
						</div>
					</div>
				)
			});
			
		}
	}

	return (
		<Form.Group widths='equal'>
			{output}
		</Form.Group>
	)
}