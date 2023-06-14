import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import * as styles from './styles.css'

const INITIAL_DATE = new Date('2021-01-01')
const DateContext = createContext([INITIAL_DATE, () => {}] as [
  Date | undefined,
  Dispatch<SetStateAction<Date | undefined>>,
])
export const useDateContext = () => useContext(DateContext)
export const DateContextProvider = ({
  children,
  showBottomToolbar,
}: {
  children: ReactNode
  showBottomToolbar: boolean
}) => {
  const dateState = useState<Date | undefined>(INITIAL_DATE)

  return (
    <DateContext.Provider value={dateState}>
      {children}
      {showBottomToolbar && (
        <div className={styles.bottomToolbar}>
          <span>
            Output from{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
              target="_blank"
            >
              <code>Date</code>
            </a>
            :{' '}
            {dateState[0]?.toLocaleString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
          <span>👇 See more controls down here</span>
        </div>
      )}
    </DateContext.Provider>
  )
}
