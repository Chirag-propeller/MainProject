import React, { useState, useEffect } from 'react'
import { Agent } from '@/components/agents/types'
import { Settings, Triangle } from 'lucide-react'

// Predefined call hangup phases
const HANGUP_PHRASES = [
    'bye',
    'goodbye',
    'that\'s it',
    'i don\'t want to talk anymore',
    'hang up',
    'end call',
    'stop calling',
    'not interested',
    'remove me from list',
    'see you later',
    'talk to you later',
    'catch you later',
    'i\'m done',
    'enough for now',
    'that will be all',
    'that\'s all',
    'we\'re done',
    'i\'m finished',
    'you can stop now',
    'stop talking',
    'disconnect',
    'no more',
    'i have to go',
    'let\'s end this',
    'that\'s enough',
    'thank you, goodbye',
    'i\'m signing off',
    'we\'re done here',
    'exit',
    'close conversation',
    'terminate call',
    'wrap it up',
    'that concludes our chat',
    'i\'m logging off',
    'finish',
    'end session',
    'quit'
];

const HANGUP_PHASES = [
    'bye',
    'goodbye',
    'that\'s it',
    'i don\'t want to talk anymore',
    'hang up',
    'end call',
    'see you later',
    'talk to you later',
    'catch you later',
    'i\'m done',
    'enough for now',
    'that will be all',
    'that\'s all',
    'we\'re done',
    'i\'m finished',
    'you can stop now',
    'stop talking',
    'disconnect',
    'no more',
    'i have to go',
    'let\'s end this',
    'that\'s enough',
    'thank you, goodbye',
    'i\'m signing off',
    'we\'re done here',
    'exit',
    'close conversation',
    'terminate call',
    'wrap it up',
    'that concludes our chat',
    'i\'m logging off',
    'finish',
    'end session',
    'quit',
    'stop calling',
    'not interested',
    'remove me from list'
];

const OtherLeft = ({ 
    callDuration, 
    setCallDuration 
}: { 
    callDuration: number, 
    setCallDuration: React.Dispatch<React.SetStateAction<number>> 
}) => {
    return (
        <div className='w-3/5 pr-4'>
            <div className='flex flex-col gap-4'>
                {/* Call Duration Field */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='callDuration' className='text-sm font-medium text-gray-700'>
                        Call Duration (seconds)
                    </label>
                    <input 
                        id='callDuration'
                        type='number'
                        min='20'
                        max='3600'
                        className='w-full p-2 rounded-md border border-gray-300 text-sm'
                        value={callDuration}
                        onChange={(e) => setCallDuration(parseInt(e.target.value) || 150)}
                    />
                </div>
            </div>
        </div>
    )
}

const OtherRight = ({ 
    numberTransfer, 
    setNumberTransfer, 
    transferNumber, 
    setTransferNumber,
    callHangup,
    setCallHangup,
    selectedPhases,
    setSelectedPhases
}: { 
    numberTransfer: boolean,
    setNumberTransfer: React.Dispatch<React.SetStateAction<boolean>>,
    transferNumber: string,
    setTransferNumber: React.Dispatch<React.SetStateAction<string>>,
    callHangup: boolean,
    setCallHangup: React.Dispatch<React.SetStateAction<boolean>>,
    selectedPhases: string[],
    setSelectedPhases: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    
    const handlePhaseToggle = (phase: string) => {
        setSelectedPhases(prev => 
            prev.includes(phase)
                ? prev.filter(p => p !== phase)
                : [...prev, phase]
        )
    }

    return (
        <div className='w-2/5 pl-4 border-l border-gray-200'>
            <div className='flex flex-col gap-6'>
                {/* Number Transfer Toggle */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-start gap-4'>
                        <label className='text-sm font-medium text-gray-700'>
                            Number Transfer
                        </label>
                        <div 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                                numberTransfer ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                            onClick={() => setNumberTransfer(!numberTransfer)}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    numberTransfer ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </div>
                    </div>
                    
                    {/* Conditional Transfer Number Field */}
                    {numberTransfer && (
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='transferNumber' className='text-xs text-gray-600'>
                                Transfer Number
                            </label>
                            <input 
                                id='transferNumber'
                                type='tel'
                                placeholder='+1234567890'
                                className='w-full p-2 rounded-md border border-gray-300 text-sm'
                                value={transferNumber}
                                onChange={(e) => setTransferNumber(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Call Hangup Feature Toggle */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-start gap-4'>
                        <label className='text-sm font-medium text-gray-700'>
                            Call Hangup
                        </label>
                        <div 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                                callHangup ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                            onClick={() => setCallHangup(!callHangup)}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    callHangup ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Conditional Hangup Phases Selection */}
                    {callHangup && (
                        <div className='flex flex-col gap-2'>
                            <label className='text-xs text-gray-600'>
                                Hangup Trigger Phrases
                            </label>
                            <div className='max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2'>
                                <div className='flex flex-col gap-0'>
                                    {HANGUP_PHASES.map((phase) => (
                                        <label key={phase} className='flex items-center gap-2 cursor-pointer p-1 py-0.5 hover:bg-gray-50 rounded text-xs'>
                                            <input
                                                type='checkbox'
                                                checked={selectedPhases.includes(phase)}
                                                onChange={() => handlePhaseToggle(phase)}
                                                className='w-3 h-3 rounded border-gray-300'
                                            />
                                            <span className='text-gray-700'>{phase}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <p className='text-xs text-gray-500'>
                                Select phrases that will trigger call hangup
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const OtherContent = ({ agent, setAgent }: { agent: Agent, setAgent: (agent: Agent) => void }) => {
    // Local state for immediate UI feedback
    const [callDuration, setCallDuration] = useState<number>(agent.maxCallDuration || 150)
    const [numberTransfer, setNumberTransfer] = useState<boolean>(agent.numberTransfer || false)
    const [transferNumber, setTransferNumber] = useState<string>(agent.numberTransferNumber || '')
    const [callHangup, setCallHangup] = useState<boolean>(agent.callHangup || false)
    const [selectedPhases, setSelectedPhases] = useState<string[]>(agent.callHangupPhase || [])

    // Sync local state when agent changes from external source
    useEffect(() => {
        setCallDuration(agent.maxCallDuration || 150)
    }, [agent.maxCallDuration])

    useEffect(() => {
        setNumberTransfer(agent.numberTransfer || false)
    }, [agent.numberTransfer])

    useEffect(() => {
        setTransferNumber(agent.numberTransferNumber || '')
    }, [agent.numberTransferNumber])

    useEffect(() => {
        setCallHangup(agent.callHangup || false)
    }, [agent.callHangup])

    useEffect(() => {
        setSelectedPhases(agent.callHangupPhase || [])
    }, [agent.callHangupPhase])

    // Debounced updates for text inputs (consistent with Model component)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (agent.maxCallDuration !== callDuration) {
                setAgent({...agent, maxCallDuration: callDuration})
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [callDuration, agent, setAgent])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (agent.numberTransferNumber !== transferNumber) {
                setAgent({...agent, numberTransferNumber: transferNumber})
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [transferNumber, agent, setAgent])

    // Immediate updates for toggles (consistent with Model component)
    useEffect(() => {
        if (agent.numberTransfer !== numberTransfer) {
            setAgent({...agent, numberTransfer: numberTransfer})
        }
    }, [numberTransfer, agent, setAgent])

    useEffect(() => {
        if (agent.callHangup !== callHangup) {
            setAgent({...agent, callHangup: callHangup})
        }
    }, [callHangup, agent, setAgent])

    useEffect(() => {
        if (JSON.stringify(agent.callHangupPhase) !== JSON.stringify(selectedPhases)) {
            setAgent({...agent, callHangupPhase: selectedPhases})
        }
    }, [selectedPhases, agent, setAgent])

    return (
        <div className='p-2 flex gap-2'>
            <OtherLeft 
                callDuration={callDuration}
                setCallDuration={setCallDuration}
            />
            <OtherRight 
                numberTransfer={numberTransfer}
                setNumberTransfer={setNumberTransfer}
                transferNumber={transferNumber}
                setTransferNumber={setTransferNumber}
                callHangup={callHangup}
                setCallHangup={setCallHangup}
                selectedPhases={selectedPhases}
                setSelectedPhases={setSelectedPhases}
            />
        </div>
    )
}

const Other = ({ agent, setAgent }: { agent: Agent, setAgent: (agent: Agent) => void }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='border border-gray-200 rounded-lg'>
            <header 
                className='cursor-pointer bg-gray-100 p-2'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Settings className='w-3.5 h-3.5 text-gray-900 self-center' />
                        <h2 className='text-md text-gray-900'>
                            Other Settings
                            <span className='text-sm ml-1'>
                                (Call Duration, Transfer & Hangup)
                            </span>
                        </h2>
                    </div>
                    <Triangle 
                        className={`w-3 h-3 self-center ${isOpen ? "rotate-180" : "rotate-90"}`}
                        style={{ fill: "lightgray" }}
                    />
                </div>
            </header>
            {isOpen && (
                <OtherContent agent={agent} setAgent={setAgent} />
            )}
        </div>
    )
}

export default Other
