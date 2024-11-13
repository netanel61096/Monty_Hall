import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MontyHall.css'; // נוסיף קובץ CSS נפרד לעיצוב


function MontyHall() {
    const [gameState, setGameState] = useState("choose"); // choose, reveal, result, auto
    const [playerChoice, setPlayerChoice] = useState(null);
    const [prizeDoor, setPrizeDoor] = useState(null);
    const [montyOpens, setMontyOpens] = useState(null);
    const [switchChoice, setSwitchChoice] = useState(null);
    const [result, setResult] = useState("");
    const [autoRuns, setAutoRuns] = useState(""); // מספר ההרצות באוטומט
    const [autoResults, setAutoResults] = useState({ stayWins: 0, switchWins: 0 }); // תוצאות
    const [manualResults, setManualResults] = useState({ stayWins: 0, switchWins: 0, stayLose: 0, switchLose: 0 }); // תוצאות ידניות
    const [simulationState, setSimulationState] = useState("manual"); // choose, reveal, result, auto
    const [count, setCount] = useState(0);
    const [emptyText,setEmptyText]=useState("");
    const [TextError,setTextError]= useState("")

    const startGame = () => {
        setPrizeDoor(Math.floor(Math.random() * 3));
        setGameState("choose");
        setPlayerChoice(null);
        setMontyOpens(null);
        setSwitchChoice(null);
        // setCount(prevCount => prevCount+1);
        // setNewGame(true);
        setResult("");
        setEmptyText("")
    };

    // בחירת שחקן ראשונית
    const chooseDoor = (door) => {
        setPlayerChoice(door);
        let montyOpensDoor;
        do {
            montyOpensDoor = Math.floor(Math.random() * 3);
        } while (montyOpensDoor === prizeDoor || montyOpensDoor === door);
        setMontyOpens(montyOpensDoor);

        const otherDoor = [0, 1, 2].find(d => d !== door && d !== montyOpensDoor);
        setSwitchChoice(otherDoor);
        setGameState("reveal");
        setSimulationState("manual")

    };

    // תוצאה של הבחירה הסופית
    const finalizeChoice = (choice) => {
        setGameState("result");
        const isWin = choice === prizeDoor;
        setCount(prevCount => prevCount+1);
        setResult(isWin ? <p style={{ color: 'green' }}>ניצחת</p> : <p style={{ color: 'red' }}>הפסדת</p>);

        // עדכון תוצאות ידניות
        setManualResults((prev) => ({
            ...prev,
            stayWins: choice === playerChoice && isWin ? prev.stayWins + 1 : prev.stayWins,
            stayLose: choice === playerChoice && !isWin ? prev.stayLose + 1 : prev.stayLose,
            switchWins: choice === switchChoice && isWin ? prev.switchWins + 1 : prev.switchWins,
            switchLose: choice === switchChoice && !isWin ? prev.switchLose + 1 : prev.switchLose,

        }));
    };

    // הפעלת סימולציה אוטומטית
    const runAutoSimulations = () => {
        let stayWins = 0;
        let switchWins = 0;
        if(autoRuns<=0){
            setTextError("לא ניתן לבצע סימולציה על מספר שקטן מ-1")
            return;
        }

        for (let i = 0; i < autoRuns; i++) {
            const prizeDoor = Math.floor(Math.random() * 3);
            const playerChoice = Math.floor(Math.random() * 3);

            let montyOpensDoor;
            do {
                montyOpensDoor = Math.floor(Math.random() * 3);
            } while (montyOpensDoor === prizeDoor || montyOpensDoor === playerChoice);

            const switchChoice = [0, 1, 2].find(d => d !== playerChoice && d !== montyOpensDoor);

            // בדיקה אם זכה בהישארות או בהחלפה
            if (playerChoice === prizeDoor) {
                stayWins++;
            } else if (switchChoice === prizeDoor) {
                switchWins++;
            }
        }

        setAutoResults({ stayWins, switchWins });
        setSimulationState("auto")

    };
    const getIntroOfPage = (chartId, name ,value) => {
        if (chartId === 'auto') {
            if(value>0){
                return `${name}:  ${value}  ${(value * 100 / autoRuns).toFixed(1)}%`
            }
            else return ""
        };
        if (chartId === 'manual') {
            if(value>0){
                return `${name}:  ${value}   ${(value * 100 / (count+1)).toFixed(1)}%`
            }
            else return ""
        };
    }
    const CustomTooltip = ({ active, payload, label ,chartId}) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="hebro">{`${label} :`}</p>
                    {payload.map(p=> <p className="intro">{getIntroOfPage(chartId, p.name, p.value)}</p>)}
                </div>
            );
        }
    }
    const handleChange = (e) => {
        setTextError("")
        const inputValue = e.target.value;
    
        // אם הקלט לא ריק והערך הוא מספר
        if (inputValue === "" || !isNaN(inputValue)) {
          setAutoRuns(inputValue);
        }
      };

    const buttons = [
        { id: 1, label: `החלף לדלת ${switchChoice + 1}`, state: switchChoice, onClick: () => finalizeChoice(switchChoice), className: "door-button" },
        { id: 2, label: `השאר בדלת ${playerChoice + 1}`, state: playerChoice, onClick: () => finalizeChoice(playerChoice), className: "door-button" },
        { id: 3, label: `דלת ${montyOpens + 1} ריקה`, state: montyOpens,onClick: () => setEmptyText("לא ניתן לבחור דלת זו"), className: "door-button empty", p:emptyText },
    ];
    const sortedButtons = buttons.sort((a, b) => a.state - b.state);

    return (
        <div className="monty-hall-container">
            <h1 className="game-title">monty hall game</h1>
            <div className='allGame'>
                <div className='chosse'>
                    <div className='manual-simulation'>
                        {gameState === "choose" && (
                            <div className="choose-door">
                                <h2 className='mode-text'>מצב ידני:</h2>
                                <h2>בחר דלת:</h2>
                               <div className="door-button-father">
                               {[0, 1, 2].map((door) => (
                                    <button
                                        key={door}
                                        onClick={() => chooseDoor(door)}
                                        className="door-button"
                                    >
                                        <div className="door-text">
                                            <p > {door + 1}</p>
                                        </div>

                                    </button>
                                ))}
                               </div>
                            </div>
                        )}
                        {gameState === "reveal" && (
                            <div className="reveal-stage">
                                <h2>מונטי פותח דלת {montyOpens + 1} עם עז 🐐</h2>
                                <h3>האם תרצה להחליף לדלת {switchChoice + 1}?</h3>
                                <div className='button_doors'>
                                    {sortedButtons.map(button => (
                                        <button key={button.id} onClick={button.onClick} className={button.className}>
                                            <div className="change-door-text">
                                            <p >{button.label}</p>
                                            <p className='empty-text-in-door'>{button?.p}</p>
                                        </div>
                                        </button>
                                    ))}
                                </div>


                            </div>
                        )}
                        {gameState === "result" && (
                            <div className='manual-result'>
                                <h2 className='result-text'>{result}</h2>
                                <p>הפרס היה מאחורי דלת {prizeDoor + 1}.</p>
                                <button onClick={startGame} className="restart-button">
                                    התחל משחק חדש
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='line'></div>
                    <div className="auto-simulation">
                        <h2 className='mode-text'>מצב אוטומטי:</h2>
                        <div className='auto-button'>
                        <div className='input-and-text'>
                        <input
                            type="number"
                            value={autoRuns}
                            onChange={handleChange}
                            placeholder="מספר סימולציות"
                            className="input-field"
                        />
                        <div className='TextError'>{TextError}</div>
                        </div>
                        <button onClick={runAutoSimulations} className="action-button">
                            הרץ סימולציה אוטומטית
                        </button>
                    </div>
                <div className='line-result'></div>

                        </div>
                </div>

                <div className='chartResult'>
                <h2 className='mode-text'>תוצאות:</h2>


                    {simulationState === "auto" && (
                        <div className="auto-results">
                            <h2>תוצאות סימולציה אוטומטית</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                    { name: 'הישארות', wins: autoResults.stayWins, lose: autoResults.switchWins },
                                    { name: 'החלפה', wins: autoResults.switchWins, lose: autoResults.stayWins }
                                ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickMargin={20}/>
                                    <Tooltip content={<CustomTooltip chartId={"auto"} />} />
                                    <Legend />
                                    <Bar dataKey="wins" barSize={30} fill="#73e1daa1" />
                                    <Bar dataKey="lose" barSize={30} fill="#ed4e4eba" />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    )}
                    {simulationState === "manual" && (
                        <div className="manual-results">
                            <div className='result-title'>
                            <h2>תוצאות משחק ידני</h2>
                            <p className='count'>{`${count} משחקים`}</p>
                            </div>
                            <ResponsiveContainer  height={300}>
                                <BarChart  width={2000} data={[
                                    { name: 'הישארות', wins: manualResults.stayWins, lose: manualResults.stayLose },
                                    { name: 'החלפה', wins: manualResults.switchWins, lose: manualResults.switchLose }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" className='xaxis'/>
                                    <YAxis className='yaxis'  tickMargin={30}/>
                                    <Tooltip content={<CustomTooltip chartId={"manual"} />}/>
                                    <Legend />
                                    <Bar dataKey="wins" barSize={20} fill="#73e1daa1" />
                                    <Bar  dataKey="lose" barSize={20} fill="#ed4e4eba" />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    )

                    }


                </div>
            </div>

        </div>

    );
}

export default MontyHall;
