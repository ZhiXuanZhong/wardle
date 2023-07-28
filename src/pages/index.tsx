import { useReducer } from 'react'

enum StateStyle {
  EMPTY = 0,
  TYPING = 1,
  CORRECT = 2,
  NOT_LIST = 3,
  WRONG_POSITION = 4,
}

interface GridItem {
  letter: string
  styleName: string
}

interface GameState {
  grid: GridItem[][]
  round: number
  currentIndex: number
  answer: string[]
}

interface Action {
  type: string
  data: string
  payload?: any
}

export default function Home() {
  const resultColor = (state: StateStyle = StateStyle.EMPTY): string => {
    const styles = {
      0: 'w-[70px] h-[70px] flex justify-center items-center border-2 border-gray-300',
      1: 'w-[70px] h-[70px] flex justify-center items-center border-2 border-slate-700',
      2: 'w-[70px] h-[70px] flex justify-center items-center bg-correct text-gray-50',
      3: 'w-[70px] h-[70px] flex justify-center items-center bg-exclude text-gray-50',
      4: 'w-[70px] h-[70px] flex justify-center items-center bg-include text-gray-50',
    }

    return styles[state]
  }

  const getLetters = (letters: GridItem[], index: number = 0): string[] => {
    if (index >= letters.length) {
      return []
    }

    const currentLetter = letters[index].letter
    const remainingLetters = getLetters(letters, index + 1)

    return [currentLetter, ...remainingLetters]
  }

  const compareArrays = (guess: string[], answer: string[]) => {
    const result: GridItem[] = []
    let letterCount = 5

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        result.push({ letter: guess[i], styleName: resultColor(StateStyle.CORRECT) })
        letterCount -= 1
      } else if (answer.includes(guess[i])) {
        result.push({ letter: guess[i], styleName: resultColor(StateStyle.WRONG_POSITION) })
      } else {
        result.push({ letter: guess[i], styleName: resultColor(StateStyle.NOT_LIST) })
      }
    }

    return { result, letterCount }
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    const isSingleChar = /[a-zA-Z]/.test(key) && key.length === 1

    if (gameState.round !== -1) {
      if (key === 'Backspace' && gameState.currentIndex > 0) {
        dispatch({ type: 'delete', data: '' })
      } else if (key === 'Enter' && gameState.currentIndex === 5) {
        dispatch({ type: 'checkAnswer', data: '' })
      } else if (isSingleChar && gameState.currentIndex < 5) {
        dispatch({ type: 'set', data: key.toUpperCase() })
      }
    }
  }

  // Plan
  // STEP 1: Complete typing in the first row  - done
  // STEP 2: Allow deleting letters in the first row when the user presses 'Backspace'  - done
  // STEP 3: Implement comparison functionality when the string length reaches 5 and the user presses 'Enter'  - done
  // STEP 4: Store the typed letters in the 'currentString' variable. --done
  // SETP 5: Validate user input against the answer --done
  // STEP 6: Transition to a new row or end the game if the user wins after pressing 'Enter' --done
  // STEP 7: Lock the result status and prevent any further input --done
  // STEP 8: Start a new game by clicking the replay button

  const reducer = (state: GameState, action: Action) => {
    const newGrid = [...state.grid]

    switch (action.type) {
      case 'set':
        newGrid[state.round] = [...newGrid[state.round]]
        newGrid[state.round][state.currentIndex] = { letter: action.data, styleName: resultColor(StateStyle.TYPING) }
        return { ...state, currentIndex: state.currentIndex + 1, grid: newGrid }

      case 'delete':
        newGrid[state.round] = [...newGrid[state.round]]
        newGrid[state.round][state.currentIndex - 1] = { letter: '', styleName: resultColor(StateStyle.EMPTY) }
        return { ...state, currentIndex: state.currentIndex - 1, grid: newGrid }

      case 'checkAnswer':
        const currentString = getLetters(state.grid[state.round])
        const checkedRow = compareArrays(currentString, state.answer)

        // match perfectly
        if (!checkedRow.letterCount) {
          setTimeout(() => {
            alert('You Win!')
          }, 0)

          newGrid[state.round] = checkedRow.result
          return { ...state, currentIndex: 0, round: -1, grid: newGrid }
        }

        // Last round
        if (state.round === 5 && checkedRow.letterCount) {
          setTimeout(() => {
            alert('Not your lucky day! Try again!')
          }, 0)
          newGrid[state.round] = checkedRow.result
          return { ...state, currentIndex: 0, round: -1, grid: newGrid }
        } else {
          newGrid[state.round] = checkedRow.result
          return { ...state, currentIndex: 0, round: state.round + 1, grid: newGrid }
        }

        case 'reset':
          return initialState
    }
    return state
  }

  const initialState: GameState = {
    grid: [
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
      [
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
        { letter: '', styleName: resultColor() },
      ],
    ],
    round: 0,
    currentIndex: 0,
    answer: ['C', 'U', 'R', 'L', 'Y'],
  }

  const [gameState, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center bg-gray-200" tabIndex={0} onKeyDown={handleKeydown}>
        <h1 className="p-8 text-6xl font-black">Wardle</h1>
        <div className=" w-[450px] h-[500px] bg-gray-100 rounded flex flex-wrap justify-center gap-2 p-3 text-4xl font-bold">
          {gameState.grid.map((round, roundIndex) => {
            return round.map((square, squareIndex) => {
              return (
                <div key={`${roundIndex}-${squareIndex}`} className={square.styleName}>
                  {square.letter}
                </div>
              )
            })
          })}
        </div>
        <div className="p-5">
          Hello baby, let&apos;s start a<span className=" text-red-600 p-2">War</span>now
        </div>
        {gameState.round === -1 && <button onClick={()=> dispatch({ type: 'reset', data: '' })} className="rounded-xl px-10 bg-red-400 ">Reset</button>}
      </div>
    </>
  )
}
