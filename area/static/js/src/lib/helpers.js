export function o(value) {
    return (value || {});
}

export function setStateForUser(value, field) {
  this.setState({
    profile: {
      ...this.state.profile,
      user: {
        ...this.state.profile.user,
        [field]: value
      }}
  })
}

export function setStateForProfile(value, field) {
  this.setState({
    profile: {
      ...this.state.profile,
      [field]: value
    }
  })
}