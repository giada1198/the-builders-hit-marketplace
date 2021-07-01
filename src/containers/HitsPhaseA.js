import { useState } from 'react';
import Hit from './Hit';

export default function HitsPhaseA(props) {
    const [n, setN] = useState(0);
    const [hitsCompleted, setHitsCompleted] = useState([]);
    const [hitsRejected, setHitsRejected] = useState([]);
    const [money, setMoney] = useState(0);

    const updateUserData = (type, value) => {
		if(type === 'hitsCompleted') {
            if(n < 2) setHitsCompleted(hitsCompleted => [...hitsCompleted, value]);
            else props.updateUserData('hitsCompleted', [...hitsCompleted, value]);
		} else if(type === 'hitsRejected') {
            if(value === '') {
                if(n >= 2) props.updateUserData('hitsRejected', hitsRejected);
            } else {
                if(n < 2) setHitsRejected(hitsRejected => [...hitsRejected, value]);
                else props.updateUserData('hitsRejected', [...hitsRejected, value]);
            }
		} else if(type === 'money') {
			if(n < 2) setMoney(money+value);
            else props.updateUserData('money', money+value);
		}
	}

    const submit = () => {
        if(n < 2) {
            setN(n + 1);
         } else {
            props.changePage('lobby');
         }
    }

    let output = '';
    switch(n) {
        case 0:
            output = <Hit
                key='Same Product?'
                questions={props.data['Same Product?']}
                submit={submit}
                updateUserData={updateUserData}
                saveQuestion={props.saveQuestion}
            />;
            break;
        case 1:
            output = <Hit
                key='Ruin or Construction'
                questions={props.data['Ruin or Construction']}
                submit={submit}
                updateUserData={updateUserData}
                saveQuestion={props.saveQuestion}
            />;
            break;
        case 2:
            output = <Hit
                key='Demographic Questions'
                questions={props.data['Demographic Questions']}
                submit={submit}
                updateUserData={updateUserData}
                saveQuestion={props.saveQuestion}
            />;
            break;
        // case 3:
        //     output = <Hit
        //         key='phase-a-4'
        //         questions={props.data['phase-a-4']}
        //         submit={submit}
        //         updateUserData={updateUserData}
        //     />;
        //     break;
        default:
            output = '';
    }

    return output;
}