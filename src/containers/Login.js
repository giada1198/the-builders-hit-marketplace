import { useState, Fragment } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { getQueryStringValue } from '../components/QueryString';

import TopMenu from '../components/TopMenu';
import Captcha from '../components/Captcha';

export default function Login(props) {
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [loginEmail, setLoginEmail] = useState(getQueryStringValue('email'));
    const [loginPassword, setLoginPassword] = useState(getQueryStringValue('id'));

    const showCaptcha = () => setIsCaptcha(true);

    const signIn = () => {
        // authenticateUser(loginEmail, loginPassword, true);
        props.signIn(loginEmail, loginPassword);
        setTimeout(() => {
			setIsCaptcha(false);
		}, 1000);
    }

    let isAdmin = props.userData === null ? false : props.userData['role'] === 'admin';
    let loginButton = (loginEmail === '' || loginEmail === undefined || loginPassword === '' || loginPassword === undefined) ?
        <Button disabled color='blue' fluid size='large' onClick={showCaptcha}>Login</Button> :
        <Button color='blue' fluid size='large' onClick={showCaptcha}>Login</Button>;

    return (        
        <Fragment>
            { isCaptcha ? (<Captcha signIn={signIn}/>) : null }
            { props.user ?
                <TopMenu
                    isAdmin={isAdmin}
                    signOut={props.signOut}
                    changePage={props.changePage}
                    changeAdminPage={props.changeAdminPage}
                    resetLS={props.resetLS}
                /> :
                <Grid style={{ height: '80vh', margin: '0' }} textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: '450px' }}>
                        <Segment>
                            <Header size='huge' color='blue' textAlign='center'>Log-in to your account</Header>
                            <Form size='large'>
                                <Segment>
                                    <Form.Input
                                        fluid icon='envelope' 
                                        iconPosition='left'
                                        placeholder='E-mail Address'
                                        value={loginEmail || ''}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                    <Form.Input
                                        fluid
                                        icon='id card'
                                        iconPosition='left'
                                        placeholder='Worker ID'
                                        value={loginPassword || ''}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                    {loginButton}
                                </Segment>
                            </Form>
                            <Message>
                                Have trouble logging in? Contact <b>Larry</b> in the Zoom chat.
                            </Message>
                        </Segment>
                    </Grid.Column>
                </Grid>
            }
        </Fragment>
    )
}