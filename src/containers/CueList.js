import { useState, useEffect } from 'react';
import { Button, Container, Header, Icon, Table } from 'semantic-ui-react';
import data from '../data/cue-list.json';

export default function CueList(props) {
    const [cue, setCue] = useState(props.publicData['cue']);

    useEffect(() => {
        setCue(props.publicData['cue']);
        // eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.publicData['cue']])

    const goNext = () => {
        if(cue < (data['cues'].length - 1)) props.changeCue(cue + 1);
    }

    const goBack = () => {
        if(cue > 0) props.changeCue(cue - 1);
    }

    let cues = [];
    for(let i = 0; i < data['cues'].length; i++) {
        let row;
        if(i === cue) {
            row = <Table.Row positive>
                <Table.Cell><Icon name='checkmark' />{data['cues'][i]['no']}</Table.Cell>
                <Table.Cell>{data['cues'][i]['time']}</Table.Cell>
                <Table.Cell>{data['cues'][i]['content']}</Table.Cell>
            </Table.Row>
        } else {
            row = <Table.Row>
                <Table.Cell>{data['cues'][i]['no']}</Table.Cell>
                <Table.Cell>{data['cues'][i]['time']}</Table.Cell>
                <Table.Cell>{data['cues'][i]['content']}</Table.Cell>
            </Table.Row>
        }
        cues.push(row);
    }

    return (
        <Container text>
            <Header as='h2' textAlign='center'>Cue List</Header>
            <Table compact celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Cue No.</Table.HeaderCell>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Content</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {cues}
                </Table.Body>

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Button
                                content='Back'
                                icon='left arrow'
                                labelPosition='left'
                                onClick={goBack}
                            />
                            <Button
                                content='Next'
                                floated='right'
                                color='blue'
                                icon='right arrow'
                                labelPosition='right'
                                onClick={goNext}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </Container>
    )
}