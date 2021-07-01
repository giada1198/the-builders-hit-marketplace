import { Button, Container, Dropdown, Menu } from 'semantic-ui-react';
import '../css/TopMenu.css';

export default function TopMenu(props) {
	let dropdown = props.isAdmin ?
		<Dropdown item simple text='Admin'>
			<Dropdown.Menu>
				<Dropdown.Item as='a' onClick={() => props.changeAdminPage('cue-list')}>
					Cue List
				</Dropdown.Item>
				<Dropdown.Item as='a' onClick={() => props.changeAdminPage('reputation-ranking')}>
					Reputation Ranking
				</Dropdown.Item>
				<Dropdown.Item as='a' onClick={() => props.changeAdminPage('audience-questions')}>
					Audience Questions
				</Dropdown.Item>
				<Dropdown.Item as='a' onClick={() => props.changeAdminPage('audience-qr-codes')}>
					Login QR Codes
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item>
					<i className='dropdown icon' />
					<span className='text'>Command</span>
					<Dropdown.Menu>
						<Dropdown.Item as='a' onClick={() => props.resetLS()}>
							Reset <b>lshea@cmu.edu</b>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown> : null;
    return (
		<Menu borderless inverted size='large'>
			<Container>
				<img src='/img/the-builders-logo-white.png' alt='' width='78px' height='30px' style={{ margin: '1em' }} />
				{dropdown}
				<Menu.Item position='right'>
					<Button compact inverted size='small' onClick={props.signOut}>Log Out</Button> 
                </Menu.Item>
			</Container>
		</Menu>
    )
}