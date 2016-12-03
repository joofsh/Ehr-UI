import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormInfo, ResourceMap } from 'src/components';

export default class PersonalizedResourceRow extends Component {
  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  getAddress() {
    let { resource } = this.props;
    return (<span>
      {resource.addressLine1()}
      <br/>
      {resource.addressLine2()}
    </span>);
  }

  render() {
    let {
      resource,
      resource: {
        category,
        description,
        email,
        id,
        operating_hours,
        note,
        phone,
        title,
        url
      }
    } = this.props;
    global.resource = resource;

    require('./PersonalizedResourceRow.scss');
    return (<div className="row form-horizontal PersonalizedResourceRow">
      <div className="col-lg-12">
        <Link to={`/resources/${id}`}><h4>{title}</h4></Link>
        <p>{description}</p>
        <div className="col-md-4 resourceMap">
          <ResourceMap resources={[resource]} activeResourceId={resource.id}/>
        </div>
        <div className="col-md-8">
          <FormInfo className="col-sm-6 col-xs-12" label="Category" value={category}/>
          <FormInfo className="col-sm-6 col-xs-12" label="Operating Hours" value={operating_hours}/>
          <FormInfo className="col-sm-6 col-xs-12" label="Phone" value={phone}/>
          <FormInfo className="col-sm-6 col-xs-12" label="Email" value={email}/>
          <FormInfo className="col-sm-6 col-xs-12" label="Website" value={url} type="url"/>
          <FormInfo className="col-sm-6 col-xs-12" label="Address" value={this.getAddress()}/>
          <FormInfo
            className="col-xs-12"
            label="Tips"
            value={note}
            labelClassName="col-xs-3 tipLabel"
            valueClassName="col-xs-9 tipValue"
          />
        </div>
      </div>
    </div>);
  }
}
