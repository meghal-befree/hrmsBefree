import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    actionButtonName?: string;
    actionButtonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
       open,
       onClose,
       onConfirm,
       title = 'Are you sure?',
       description = '',
       actionButtonName = 'Confirm',
       actionButtonColor = 'primary'
   }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color={actionButtonColor}>{actionButtonName}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
