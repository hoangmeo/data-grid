import { Modal, Box, Typography } from '@material-ui/core';
import React, { PureComponent } from 'react';
import NTAMessageManager from './NTAMessageManager';

interface Props {}
interface State {
    title: string | JSX.Element;
    content: string | JSX.Element;
    open: boolean;
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const showMessage = (title: string | JSX.Element, content: string | JSX.Element) => {
    const ref = NTAMessageManager.getCurrent();
    if (ref) {
        ref.showMessage(title, content);
    }
};

export default class NTAMessageWrapper extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.showMessage = this.showMessage.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            content: '',
            title: '',
            open: false,
        };
    }
    componentDidMount() {
        NTAMessageManager.register(this);
    }
    componentWillUnmount() {
        NTAMessageManager.unregister();
    }
    showMessage(title: string | JSX.Element, content: string | JSX.Element) {
        this.setState({
            content: content,
            title: title,
            open: true,
        });
    }

    close() {
        this.setState({
            content: '',
            title: '',
            open: false,
        });
    }
    render() {
        const { title, content, open } = this.state;
        return (
            <Modal open={open} onClose={this.close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Box sx={{ mt: 2 }}>{content}</Box>
                </Box>
            </Modal>
        );
    }
}
