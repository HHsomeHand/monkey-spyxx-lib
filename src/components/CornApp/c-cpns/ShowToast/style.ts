// src/components/CornApp/c-cpns/ShowToast/style.ts

import styled from "styled-components";

// .show-toast
export const ShowToastWrapper = styled.div`
    /* 进入动画 */
    .corn-app__toast-enter, .corn-app__toast-appear {
        opacity: 0;
    }

    .corn-app__toast-enter-active, .corn-app__toast-appear-active {
        opacity: 1;
        transition: all 500ms ease-in-out;
    }

    /* 退出动画 */
    .corn-app__toast-exit {
        opacity: 1;
    }

    .corn-app__toast-exit-active {
        opacity: 0;
        transition: all 500ms ease-in-out;
    }
`

export default ShowToastWrapper;
