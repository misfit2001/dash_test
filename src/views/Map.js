/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useRef } from "react";

import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';
import { Marker } from 'react-google-maps';

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

 
const MyMap = () => {
  // Map configuration
  const mapOptions = { 
    center: { lat: 37.9592667, lng: 23.7181701 }, // Provide the latitude and longitude of your desired map center
    zoom: 12, // Adjust the zoom level according to your preference
  };
  const markerPosition = { lat: 37.9592667, lng: 23.7181701 };
  return (
      <div className="google-map">
        <GoogleMap
          defaultZoom={mapOptions.zoom}
          defaultCenter={mapOptions.center}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
        
      </div>
  );
};

function Map() {
  
  const MapWithAMarker = withScriptjs(withGoogleMap(MyMap));
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>Google Maps</CardHeader>
              <CardBody>
                <MapWithAMarker
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDKTVnP4JUqspJ9sQ9zlAkVqzLJaPgOWIY&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{ height: '100%' }} />}
                  containerElement={<div style={{ height: '800px' }} />}
                  mapElement={<div style={{ height: '100%' }} />}
                /> 
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Map;
