import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import stringUtil from 'src/utils/string';

// Columns propery is an array in the following format:
//[
  //{ key: 'id', title: 'ID' },
  //{ key: 'title', type: 'internalLink', linkBase: '/foo/' },
  //{ key: 'url', type: 'externalLink' },
//]

export default class DataTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    linkBase: PropTypes.string,
    linkColumn: PropTypes.string
  };

  getRowContent(dataPoint, column) {
    let cellValue = dataPoint[column.key];

    switch (column.type) {
      case 'externalLink':
        return (<a target="_blank" href={cellValue}>
          {cellValue}
        </a>);
      case 'internalLink':
        return (<Link to={`${column.linkBase}${dataPoint.id}`}>
          {cellValue}
        </Link>);
      default:
        return (<span>
          {cellValue}
        </span>);
    }
  }
  render() {
    let { columns, data } = this.props;

    return (<Table striped bordered condensed hover>
      <thead>
        <tr>
          {columns.map((column, i) => {
            return <th key={i}>{column.title || stringUtil.capitalize(column.key)}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map(dataPoint => {
          return (<tr key={dataPoint.id}>
            {columns.map((column, i) => {
              return (<td key={i}>
                { this.getRowContent(dataPoint, column) }
              </td>);
            })}
          </tr>);
        })}
      </tbody>
    </Table>);
  }
}
