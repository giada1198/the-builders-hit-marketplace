import { useState, useEffect, useRef, Fragment } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import parse from 'html-react-parser';
import data from '../data/agreement.json';
import '../css/Agreement.css';

export default function Agreement(props) {
    // const [currentPage, setCurrentPage] = useState(0);
    const scrollerRef = useRef(null);
    const [scrollerHeight, serScrollerHeight] = useState(null);
    const prevScrollY = useRef(0);
    const [goingUp, setGoingUp] = useState(false);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    
    useEffect(() => {
        if(scrollerRef.current) {
            serScrollerHeight(scrollerRef.current.scrollHeight-scrollerRef.current.offsetHeight);
        }
    }, [scrollerRef]);

    // const goNext = () => {
    //     setCurrentPage((currentPage + 1) % content.length);
    // }
    // const goBack = () => {
    //     setCurrentPage((currentPage - 1 + content.length) % content.length);
    // }

    const onScroll = (event) => {
        const currentScrollY = event.target.scrollTop;
        if (prevScrollY.current < currentScrollY && goingUp) {
          setGoingUp(false);
        }
        if (prevScrollY.current > currentScrollY && !goingUp) {
          setGoingUp(true);
        }
        prevScrollY.current = currentScrollY;
        if(hasScrolledToBottom === false && currentScrollY >= scrollerHeight) setHasScrolledToBottom(true);
        // console.log(goingUp, currentScrollY);
    };

    let style = {display: 'flex', justifyContent: 'center'};
    // let buttons = currentPage === 0 ?
    //     <div style={style}>
    //         <Button
    //             disabled
    //             content='Back'
    //             icon='left arrow'
    //             labelPosition='left'
    //         />
    //         <Button
    //             content='Next'
    //             color='blue'
    //             icon='right arrow'
    //             labelPosition='right'
    //             onClick={goNext}
    //         />
    //     </div> :
    //     currentPage === content.length-1 ?
    let buttons = <div style={style}>
        <Button
            disabled={!hasScrolledToBottom}
            content='I Agree'
            color='yellow'
            icon='check'
            labelPosition='right'
            onClick={() => props.setHasAgreed(true)}
        />
    </div>;
    // <div style={style}>
    //     <Button
    //         content='Back'
    //         icon='left arrow'
    //         labelPosition='left'
    //         onClick={goBack}
    //     />
    //     <Button
    //         content='Next'
    //         color='blue'
    //         icon='right arrow'
    //         labelPosition='right'
    //         onClick={goNext}
    //     />
    // </div>

    return (
        <Container text>
            <Header as='h2' textAlign='center'>{data['heading']}</Header>
            {/* <Header as='h2' textAlign='center'>{heading} ({currentPage + 1}/{content.length})</Header> */}
            <Segment>
                <div className='scroller' ref={scrollerRef} onScroll={onScroll}>
                    <Content text={data['content'][0]}/>
                </div>
            </Segment>
            {/* <Divider /> */}
            {buttons}
        </Container>
    )
}

function Content(props) {
    return (
        <Fragment>{parse(props.text)}</Fragment>
    )
}
