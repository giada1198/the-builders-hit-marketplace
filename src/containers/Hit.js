import { useState } from 'react';
import { Button, Container, Divider, Header, Segment } from 'semantic-ui-react';
import parse from 'html-react-parser';

import Play from '../components/Play';
import Spinner from '../components/Spinner';

export default function Hit(props) {
    const [currentState, setCurrentState] = useState('init');

    const start = () => setCurrentState('play');
    const finish = () => setCurrentState('finish');

    const submit = () => {
        setCurrentState('submit');
        props.updateUserData('hitsCompleted', props.questions['heading']);
        if(Math.random() <= props.questions['pass-probability']) {
            // console.log('pass!')
            props.updateUserData('hitsRejected', '');
            const reward = getRandomFloat(props.questions['reward'][0], props.questions['reward'][1]);
            props.updateUserData('money', reward);
        } else {
            // console.log('not pass!')
            props.updateUserData('hitsRejected', props.questions['heading']);
        }
        setTimeout(() => {
            props.submit();
        }, 500)
    }

    const reject = () => {
        setCurrentState('submit');
        props.updateUserData('hitsCompleted', props.questions['heading']);
        props.updateUserData('hitsRejected', props.questions['heading']);
        setTimeout(() => {
            props.submit();
        }, 500)
    }

    let output;
    if(currentState === 'init') {
        output = <Init
            heading={props.questions['heading']}
            description={props.questions['description']}
            start={start}
        />;
    } else if(currentState === 'play') {
        output = <Play
            questions={props.questions['questions']}
            finish={finish}
            reject={reject}
            saveQuestion={props.saveQuestion}
            submit={submit}
        />;
    } else if(currentState === 'finish') {
        output = <Finish
            submit={submit}
        />
    } else if(currentState === 'submit') {
        output = <Segment>
            <Spinner />
        </Segment>;
    }

    return (
        <Container text>
            {output}
        </Container>
    )
}

function Init(props) {
    let img = props.heading === 'ACT 2 HITs #3' ? <img src='./img/bmw.jpg' alt='' width='100%' height='auto' style={{margin: '0 0 1em 0'}} /> : null;
	return (
		<Segment>
            <Header as='h2' textAlign='center'>{props.heading}</Header>
            {img}
            <p>{parse(props.description)}</p>
            <Divider />
            <div style={{textAlign: 'center'}}>
                <Button color='blue' onClick={props.start}>Start</Button>
            </div>
        </Segment>
	)
}

function Finish(props) {
	return (
		<Segment>
            <Header as='h2' textAlign='center'>This is the end of the hit.</Header>
            <p style={{textAlign: 'center'}}>All questions complete.</p>
            <Divider />
            <div style={{textAlign: 'center'}}>
                <Button color='blue' onClick={props.submit}>Submit Hit</Button>
            </div>
        </Segment>
	)
}

function getRandomFloat(min, max) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return Math.random() * (max - min) + min; // the maximum is exclusive and the minimum is inclusive
}