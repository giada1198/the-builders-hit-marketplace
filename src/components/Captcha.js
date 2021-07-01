import { useState, useEffect } from 'react';
import { Button, Header, Modal, Checkbox } from 'semantic-ui-react';
import '../css/Captcha.css';

export default function Captcha(props) {
    const [imageList, setImageList] = useState([
        { isAnswer: false, image: './img/captcha-01.jpg' },
        { isAnswer: true,  image: './img/captcha-02.jpg' },
        { isAnswer: false, image: './img/captcha-03.jpg' },
        { isAnswer: true,  image: './img/captcha-04.jpg' },
        { isAnswer: false, image: './img/captcha-05.jpg' },
        { isAnswer: true,  image: './img/captcha-06.jpg' },
        { isAnswer: false, image: './img/captcha-07.jpg' },
        { isAnswer: true,  image: './img/captcha-08.jpg' },
        { isAnswer: false, image: './img/captcha-09.jpg' }
    ]);
    const [checkBoxState, setcheckBoxState] = useState(new Array(imageList.length).fill(false));
    const [shuffleTime, setShuffleTime] = useState(0);
    
    const shuffleArray = (a) => {
        // console.log('shuffle!');
        setShuffleTime(shuffleTime + 1);
        for(let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const updateCheckBoxState = (n, b) => {
        let ns = checkBoxState;
        ns[n] = b;
        setcheckBoxState(ns);
    }

    const resetImageList = () => {
        setImageList(shuffleArray(imageList));
        setcheckBoxState(new Array(imageList.length).fill(false));
    }

    const verify = () => {
        for(let i = 0; i < 9; i++) {
            if(checkBoxState[i] !== imageList[i]['isAnswer']) {
                console.log('fail!');
                resetImageList();
                return false;
            }
        }
        console.log('correct!');
        props.signIn();
        return true;
    }

    useEffect(() => {
        resetImageList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

    let images = [];
    for(let i = 0; i < 3; i++) {
        let rowImages = []
        for(let j = 0; j < 3; j++) {
            let key = shuffleTime.toString() + '-' + (i*3+j).toString();
            rowImages.push(<CaptchaImage
                key={key}
                number={i*3+j}
                img={imageList[i*3+j]['image']}
                update={updateCheckBoxState}
            />)
        }
        images.push(rowImages);
    }
    
    let output = <div className='captcha-image-container'>
            <div className='captcha-image-row'>{images[0]}</div>
            <div className='captcha-image-row'>{images[1]}</div>
            <div className='captcha-image-row'>{images[2]}</div>
        </div>;
       
    return (
        <Modal open={true} style={{maxWidth:'450px'}}>
            <Modal.Content>
                <div className='captcha-description'>
                    <Header inverted size='huge'>
                        <Header.Subheader>Select all images with</Header.Subheader>
                    Muffins
                    </Header>
                    <p>Click verify once there are none left.</p>
                </div>
                {output}
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color='blue'
                    onClick={verify}>
                    Verify
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

function CaptchaImage(props) {
    const handleChange = (event, { checked }) => props.update(props.number, checked);
    return (
        <div style={{backgroundImage: `url(${props.img})`}} className='captcha-image'>
            <div className='captcha-checkbox'>
                <Checkbox
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}