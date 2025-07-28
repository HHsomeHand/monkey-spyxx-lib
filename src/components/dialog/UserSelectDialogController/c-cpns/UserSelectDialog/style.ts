// src/components/dialog/UserSelectDialog/style.ts

import styled from "styled-components";

// .user-select-dialog
export const UserSelectDialogAnimation = styled.div`
    /* 进入动画 */
    .dialog-enter, .dialog-appear {
        opacity: 0;
        transform: scale(0.8);
    }

    .dialog-enter-active, .dialog-appear-active {
        opacity: 1;
        transform: scale(1);
        transition: all 300ms ease-in-out;
    }

    /* 退出动画 */
    .dialog-exit {
        opacity: 1;
        transform: scale(1);
    }

    .dialog-exit-active {
        opacity: 0;
        transform: scale(0.8);
        transition: all 300ms ease-in-out;
    }
`

export default UserSelectDialogAnimation;
