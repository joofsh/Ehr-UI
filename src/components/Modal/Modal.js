import React, { Component, PropTypes } from 'react';

import Modal from 'react-bootstrap/lib/Modal';

export default class _Modal extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.string.isRequired
  };

  render() {
    let {
      title,
      children,
      ...rest
    } = this.props;

    require('./Modal.scss');
    return (<Modal {...rest}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>);
  }
}
