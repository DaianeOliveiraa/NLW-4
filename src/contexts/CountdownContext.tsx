import { useChallenges } from "../hooks/useChallenges";

import { createContext, ReactNode,  useEffect, useState } from 'react';

interface CountdownProviderProps{
    children: ReactNode;
}

interface CountdownContextData{
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;

}

let countdownTimeout: NodeJS, Timeout;

export const CountdownContext = createContext ({} as CountdownContextData)


export function CountdownProvider({children}: CountdownProviderProps){
    const { startNewChallenge } = useChallenges();

    const [time, setTime] = useState(0.1 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        window.onbeforeunload = () => {
            if (isActive){
                return 'Você perderá o progresso do countdown até aqui, tem certeza?'
            }
        };
    }, [isActive])

    useEffect(() => {
        if (isActive && time > 0){
            countdownTimeout = setTimeout(() => {
                setTime(time -1);
            }, 1000);
        } else if (isActive && time === 0){
            startNewChallenge();
            setHasFinished(true);
            setIsActive(false);
        }
    }, [isActive,time]);

    function startCountdown(){
        setIsActive(true);

    }

    function resetCountdown(){
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(0.1 * 60);
        setHasFinished(false);

    }

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown,
        }}>
            {children}
        </CountdownContext.Provider>
    );

}