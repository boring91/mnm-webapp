import { animations } from './animation';
import { MNMConfig } from './mnm-config';

export const defaultMnmConfig: MNMConfig = {
    http: {
        contentType: 'application/x-www-form-urlencoded',
    },
    modal: {
        animations,
    },
};
