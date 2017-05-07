import React, { Component } from 'react';

/* eslint-disable max-len */
export default class AboutUs extends Component {
  render() {
    return <div className="container container-AboutUs">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="page-header">
            <h1>About DC Resources</h1>
          </div>
          <h3>Who are we?</h3>
          <p>
            DCResources.org provides a space for DC residents to connect themselves to local resources. Our goal is to empower DC residents and their advocates to share and rate their experiences with social services. We are a local organization that cares about our community and those who serve it.
          </p>

          <h3>Resource Catalog</h3>
          <p>
            We provide a catalog of resources that provide services in the District spanning from shower services to legal assistance. Everyone in the District is free to add a service or organization, or to give feedback on an experience at one of our listed organizations. This catalog is made by the people DC and will change and grow as the community does.
          </p>

          <h3>Question Matrix</h3>
          <p>
            We have designed a series of questions to better personalize the services our site shows you. The question matrix uses psychological theory and feedback from past site users to tailor a treatment plan that fits your individual needs. This tool grows and changes with each new resource and each new user.
          </p>
        </div>
      </div>
    </div>;
  }
}
