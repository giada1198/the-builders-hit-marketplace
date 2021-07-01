import { useState, Fragment } from 'react';
import { Button, Header, Form, Grid, Segment } from 'semantic-ui-react';

import Agreement from '../components/Agreement';

export default function Onboarding(props) {
    const [hasAgreed, setHasAgreed] = useState(false);

    let output = hasAgreed === false ?
        <Agreement
            setHasAgreed={setHasAgreed}
        /> :
        <SetName
            changePage={props.changePage}
            saveName={props.saveName}
        />;
    return (
        <Fragment>
            {output}
        </Fragment>
    )
}

function SetName(props) {
    const [name, setName] = useState('');

    const save = () => {
        props.saveName(name);
        props.changePage('hits');
    }

    let button = (name === '' || name === undefined) ?
        <Button disabled fluid color='blue' size='large' onClick={save} style={{marginTop: '10px'}}>Login</Button> :
        <Button fluid color='blue' size='large' onClick={save} style={{marginTop: '10px'}}>Login</Button>;

    return (
        <Grid style={{ height: '80vh', margin: '0' }} textAlign='center'>
            <Grid.Column style={{ maxWidth: '400px' }}>
                <Segment>
                    <Header as='h3' textAlign='center'>Please enter your preferred name for use in the show.</Header>
                    <p style={{textAlign: 'center'}}>Also put this name as your Zoom name if you know how to do that.</p>
                    <Form.Input
                        fluid icon='user'
                        iconPosition='left'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {button}
                </Segment>
            </Grid.Column>
        </Grid>
    )
}