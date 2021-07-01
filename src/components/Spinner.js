import { Loader } from 'semantic-ui-react';

export default function Spinner() {
	return (
		<div style={{minHeight: '100px', padding: '40px'}}>
			<Loader active inline='centered' />
		</div>
	)
}