import React from 'react';
import { Alert, HelpBlock } from 'react-bootstrap';
import { Row, FormGroup, FormControl, Col,
  ControlLabel } from 'react-bootstrap';


export function setValidationState(byError) {
  if (byError) return {validationState: "error"}
}


// Help text under a form field
export class ValidationHelpText extends React.Component {
  render () {
    if (!this.props.text)
      return null;
    return (
      <HelpBlock bsClass="help-block err">
        <ul>
          {this.props.text.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      </HelpBlock>
    )
  }
}


class errorList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.errors.map(err => (
            <li>{err}</li>
          ))
        }
      </ul>
    )
  }
}

export class FormGroupRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <FormGroup controlId={this.props.controlId}>
        <Col md={3} componentClass={ControlLabel}>{this.props.label}</Col>
        <Col md={9}>
          <FormControl.Static>
            {this.props.value}
          </FormControl.Static>
        </Col>
      </FormGroup>
    )
  }
}

export class FormGroupField extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var byError = false;
    if (this.props.validationStateByError && this.props.errorText) {
      byError = true;
    }
    return (
      <FormGroup controlId={this.props.controlId}
          {...setValidationState(byError)}>
        <Col componentClass={ControlLabel} sm={3}>
          {this.props.label}
        </Col>
        <Col sm={9}>
          <FormControl type={this.props.type}
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}/>
          <ValidationHelpText text={this.props.errorText}/>
        </Col>
      </FormGroup>
    )
  }
}


// Error alert block for an array of strings or a single string
export class NonFieldErrors extends React.Component {
  constructor(props) {
    super(props)
  }
  render () {
    console.log('Nonfield errors');
    if (!this.props.errors) {
      console.log('There are no any nonfield errors', this.props.errors);
      return null;
    }

    let alertBlock = errors => {
      return <Alert bsStyle="danger">{errors}</Alert>
    }

    if (!(this.props.errors instanceof Array)) {
      return alertBlock(this.props.errors);
    }
    if (!(this.props.errors.length)) return(null);

    var errors = [];
    this.props.errors.forEach((error, i) => {
      console.log('error: ', i, error)
      errors.push(<li key={i}>{error}</li>)
    })
    console.log('errors: ', errors);
    return (
        alertBlock(<ul>{errors}</ul>)
    );
  }
}
