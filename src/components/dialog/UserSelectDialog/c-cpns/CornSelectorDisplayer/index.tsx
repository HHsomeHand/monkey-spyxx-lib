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
    onCurrElChange: (el: HTMLElement) => void,
    ref: React.MutableRefObject<CornSelectorDisplayerRef | undefined>
}

export const CornSelectorDisplayer = memo((
    props: CornSelectorDisplayerProps
) => {
    let {
        currSelectorArr: propCurrSelectorArr,
        ref
    } = props;

    const [showIndex, setShowIndex] = useState(propCurrSelectorArr.length - 1);

    useEffect(() => {
        setShowIndex(propCurrSelectorArr.length - 1);

    }, [propCurrSelectorArr]);

    let showList = propCurrSelectorArr.slice(0, showIndex + 1);

    function getSelector() {
        return showList.join(" > ");
    }

    useImperativeHandle(ref, () => ({
        getSelector
    }), [showList]);

    // =================
    // ==== _Slider ====
    // =================
    function onChange(newShowIndex: number) {
        setShowIndex(newShowIndex);
    }

    // 滑块滑动时, 重新让父元素高亮目标元素
    useEffect(() => {
        const selector = getSelector();

        if (!selector) return;

        const el = document.querySelector(selector);

        if (!el) return;

        props.onCurrElChange(el as HTMLElement);
    }, [showIndex]);

    const _Slider = (
        <input
            type="range"
            min="0"
            max={propCurrSelectorArr.length - 1}
            step="1"
            value={showIndex}
            onChange={e => onChange(Number(e.target.value))}
        />
    );

    return (
        <>
            {
                showList.length !== 0 && <section className="flex flex-wrap overflow-y-auto h-15 items-center">
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
                                        index < showIndex && (
                                            <div className="mx-1">&gt;</div>
                                        )
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </section>
            }

            {_Slider}
        </>
    )
});

export default CornSelectorDisplayer;
