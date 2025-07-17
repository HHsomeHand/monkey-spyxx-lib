import clsx from 'clsx';
import React, {useEffect, useImperativeHandle, useState} from 'react';
import {memo} from "react";
import {CornButton} from "@/components/ui/button-base.tsx";

export interface CornSelectorDisplayerRef {
    getSelector(): string;
}

interface CornSelectorDisplayerProps {
    className?: string,
    currSelectorArr: string[],
    ref: React.MutableRefObject<CornSelectorDisplayerRef | undefined>
}

export const CornSelectorDisplayer = memo((
    props: CornSelectorDisplayerProps
) => {
    let {
        currSelectorArr: propCurrSelectorArr,
        ref
    } = props;

    const [showIndex, setShowIndex] = useState(-1);

    let showLength = propCurrSelectorArr.length;

    let showList = propCurrSelectorArr;

    if (showIndex !== -1) {
        showList = propCurrSelectorArr.slice(0, showIndex + 1);

        showLength = showIndex + 1;
    }

    useImperativeHandle(ref, () => ({
        getSelector() {
            return showList.join(" > ");
        }
    }), [showList]);


    return (
        <>
            {
                showList.length !== 0 && <section className="flex flex-wrap">
                    {
                        showList.map((selector, index) => {
                            function onSelectorClick() {
                                if (index === 0) return;

                                setShowIndex(index);
                            }

                            return (
                                <React.Fragment key={selector}>
                                    <CornButton onClick={onSelectorClick}>{selector}</CornButton>
                                    {
                                        index < showLength - 1 && (
                                            <div className="mx-1">&gt;</div>
                                        )
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </section>
            }
        </>
    )
});

export default CornSelectorDisplayer;
