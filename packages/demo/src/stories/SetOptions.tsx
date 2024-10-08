import { type Options, type UpdateFn } from 'timescape/react'
import { Fragment, useState } from 'react'
import {
  checkbox,
  fieldset,
  label,
  optionsInput,
  button,
} from './timescape.css.ts'

const toDateTimeLocal = (date: Date) => {
  const YMD = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

  const HMS = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join(':')

  return `${YMD}T${HMS}`
}

const ALL_OPTIONS = [
  'date',
  'minDate',
  'maxDate',
  'hour12',
  'digits',
  'wrapAround',
  'snapToStep',
  'wheelControl',
] as const
type PossibleOptions = keyof Omit<Options, 'onChangeDate'>

export const SetOptions = ({
  enabled,
  options,
  updateFn,
}: {
  enabled?: PossibleOptions[]
  options: Options
  updateFn: UpdateFn
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <fieldset
      className={fieldset}
      data-expanded={isExpanded}
      onClick={() => {
        if (isExpanded) return
        setIsExpanded(true)
      }}
    >
      <legend
        style={{ cursor: 'pointer', paddingInline: '7px' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '⏷' : '⏵'} Options
      </legend>
      <div
        style={{
          display: 'contents',
          visibility: isExpanded ? undefined : 'hidden',
        }}
      >
        {(enabled ?? ALL_OPTIONS).map((optionName) => (
          <Fragment key={optionName}>
            <label className={label} htmlFor={`input-${optionName}`}>
              {optionName}
            </label>
            <InputField
              optionName={optionName}
              value={options[optionName]}
              updateFn={updateFn}
            />
          </Fragment>
        ))}
      </div>
      <button className={button} onClick={() => updateFn({ date: new Date() })}>
        Reset
      </button>
    </fieldset>
  )
}

const InputField = ({
  optionName,
  value,
  updateFn,
}: {
  optionName: PossibleOptions
  value: Options[PossibleOptions]
  updateFn: UpdateFn
}) => {
  switch (optionName) {
    case 'date':
    case 'minDate':
    case 'maxDate':
      return (
        <input
          id={`input-${optionName}`}
          className={optionsInput}
          type="datetime-local"
          value={value instanceof Date ? toDateTimeLocal(value) : ''}
          style={{ width: '100%' }}
          onChange={(e) => {
            const date = new Date(e.target.value)

            if (isNaN(date.getTime())) {
              return window.alert(
                `⚠️ Sorry to interrupt: This is an invalid date.\n\nBy the way: This doesn't happen with timescape :)`,
              )
            }
            updateFn((p) => ({ ...p, [optionName]: date }))
          }}
        />
      )
    case 'digits':
      return (
        <select
          id={`input-${optionName}`}
          className={optionsInput}
          value={value as string}
          onChange={(e) => {
            const value = e.target.value as Options['digits']
            updateFn((p) => ({ ...p, [optionName]: value }))
          }}
        >
          <option value="2-digit">2-digit</option>
          <option value="numeric">numeric</option>
        </select>
      )
    case 'wrapAround':
    case 'snapToStep':
    case 'hour12':
    case 'wheelControl':
      return (
        <input
          id={`input-${optionName}`}
          className={checkbox}
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => {
            const value = e.target.checked
            updateFn((p) => ({ ...p, [optionName]: value }))
          }}
        />
      )
  }
}
