import React from 'react'
import classes from './Input.css'

function isInvalid({valid, touched, shouldValidate}) {
  return !valid && shouldValidate && touched
}

class Input extends React.Component {

  onChangeInput = event => {
    this.props.onChange(event, this.props.name)
  }

  render() {
    const inputType = this.props.type || 'text';
    const cls = [classes.Input];
    const htmlFor = `${inputType}-${Math.random()}`;

    if (isInvalid(this.props)) {
      cls.push(classes.invalid)
    }

    return (
      <div className={cls.join(' ')}>
        <label htmlFor={htmlFor}>{this.props.label}</label>
        <input
          type={inputType}
          id={htmlFor}
          value={this.props.value}
          onChange={this.onChangeInput}
        />

        {
          isInvalid(this.props)
            ? <span>{this.props.errorMessage || 'Введите верное значение'}</span>
            : null
        }
      </div>
    )
  }
}

export default Input
