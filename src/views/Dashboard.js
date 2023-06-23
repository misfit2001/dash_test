import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartPrice,
  chartKWH,
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";
import { useLocation } from 'react-router-dom';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';
import { Marker } from 'react-google-maps';

let pinakasURI = []

let pinakasProfileInfo = []
const markers = [];
 

const MyMap = () => {
  // Map configuration
  const mapOptions = { 
    center: { lat: 37.9592667, lng: 23.7181701 }, // Provide the latitude and longitude of your desired map center
    zoom: 12, // Adjust the zoom level according to your preference
  };

 

  return (
   
    <div className="map">
      <div className="google-map">
        <GoogleMap
          defaultZoom={mapOptions.zoom}
          defaultCenter={mapOptions.center}
        >
        {markers}
        </GoogleMap>
        
      </div>
    </div>
  );
};

var MapWithAMarker = withScriptjs(withGoogleMap(MyMap));
 

function Dashboard(props) {

  const location = useLocation();
  const token = location.state && location.state.token;
  
  const [chartDataPrice, setChartDataPrice] = useState(chartPrice.data(document.createElement('canvas')));
  const [chartDataKWH, setChartDataKWH] = useState(chartKWH.data(document.createElement('canvas')));
  useEffect(() => {
    const updateChartPrice = () => {
      // Create a new chart data object with the updated data
      const updatedChartDataPrice = {
        ...chartDataPrice,
        datasets: [
          {
            ...chartDataPrice.datasets[0],
            data: chartDataPrice.datasets[0].data,
          },
        ],
        labels: chartDataPrice.labels,
      };

      // Update the state with the new chart data
      setChartDataPrice(updatedChartDataPrice);
    };

    updateChartPrice();

    const updateChartKWH = () => {
      // Create a new chart data object with the updated data
      const updatedChartDataKWH = {
        ...chartDataKWH,
        datasets: [
          {
            ...chartDataKWH.datasets[0],
            data: chartDataKWH.datasets[0].data,
          },
        ],
        labels: chartDataKWH.labels,
      };
  
      // Update the state with the new chart data
      setChartDataKWH(updatedChartDataKWH);
    };
  
    updateChartKWH();

  }, []);


 

  const refreshCharts = (i) => {
    axios
      .get(
        "http://greece.snap4city.org/ServiceMap/api/v1/?serviceUri="+pinakasProfileInfo[i].realtime.results.bindings[0].Invoice.value+"&accessToken="+token+"&fromTime=730-day&toTime="+new Date().toISOString().split(".")[0]+"&format=json"
      )
      .then((response) => {
        const data = response.data;

        if (data.error) {
          console.log('Error:', data.error);
        } else {
          console.log('OK');
          const jsonData = data.realtime.results.bindings;

          // Clear the existing chart data
          const clearedDataPrice = {
            labels: [],
            datasets: [
              {
                ...chartDataPrice.datasets[0],
                data: [],
              },
            ],
          };
  
          const clearedDataKWH = {
            labels: [],
            datasets: [
              {
                ...chartDataKWH.datasets[0],
                data: [],
              },
            ],
          };

          let totalPrice = 0;
          let totalKWH = 0;
          // Add the new data to the cleared chart data
          jsonData.reverse().forEach(binding => {
            const price = parseFloat(binding.price.value);
            clearedDataPrice.datasets[0].data.push(price);
            totalPrice+=price;
            const startDate = new Date(binding.StartDate.value);
            const month = startDate.toLocaleString("en-US", { month: "short" });
            clearedDataPrice.labels.push(month);
          });
          
          document.getElementById('price').innerHTML=totalPrice +" €";
          // Trigger a re-render by updating the state with the new chart data
          setChartDataPrice(clearedDataPrice);

            // Add the new data to the cleared chart data
            jsonData.reverse().forEach(binding => {
              const kwh = parseFloat(binding.kwh.value);
              clearedDataKWH.datasets[0].data.push(kwh);
              totalKWH+=kwh;
              const startDate = new Date(binding.StartDate.value);
              const month = startDate.toLocaleString("en-US", { month: "short" });
              clearedDataKWH.labels.push(month);
            });
            
            document.getElementById('kwh').innerHTML=totalKWH +" kwh";  
            // Trigger a re-render by updating the state with the new chart data
            setChartDataKWH(clearedDataKWH);


            
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [markersLoaded, setMarkersLoaded] = useState(false);
  useEffect(() => {
    getDataURI();

  
  }, []);
  
 

  const getDataURI = () => {
  
    axios
      .get(
        "https://greece.snap4city.org/ServiceMap/api/v1/?selection=34.243594729697406;12.194824218750002;42.09822241118974;29.772949218750004&categories=IoTSensor&maxResults=100&maxDists=0.1&text=EnergyConsumer&accessToken="+ token +"&model=&value_type=&format=json"
      )
      .then((response) => {
        const data = response.data;
        for(let i=0; i<data.Services.features.length; i++){
          pinakasURI.push(data.Services.features[i].properties.serviceUri)
        }
        console.log(pinakasURI);
        console.log('======URI=======')
        console.log(data.Services.features[0].properties.serviceUri);
        console.log('===============')
        if (data.error) {
          console.log('Error:', data.error);
        } else {
          console.log('OK');
          pinakasURI.forEach((uri) => {
            axios
            .get(
              "http://greece.snap4city.org/ServiceMap/api/v1/?serviceUri="+uri+"&accessToken="+token+"&fromTime=730-day&toTime="+new Date().toISOString().split(".")[0]+"&format=json"
            )
            .then((response) => {
              const data = response.data;
              console.log(data)
              pinakasProfileInfo.push(data)
              console.log('======PROFILE=====')
              console.log(pinakasProfileInfo[0].realtime.results.bindings[0]);
              console.log('=============')

              setTimeout(() => { // Set a timeout of 2 seconds for demonstration purposes
                for (let i = 0; i < pinakasProfileInfo.length; i++) {
                  const position = pinakasProfileInfo[i];
                  const latitude = position.Service.features[0].geometry.coordinates[1];
                  const longitude = position.Service.features[0].geometry.coordinates[0];
                  console.log('Latitude:', latitude);
                  console.log('Longitude:', longitude);
                
                  markers.push(
                    <Marker position={{ lat: latitude, lng: longitude }} onClick={() => refreshCharts(i)}/>
                  );
                }
                setMarkersLoaded(true);
              }, 5000); 

              if (data.error) {
                console.log('Error:', data.error);
              } else {
                console.log('OK');
        
              }
            })
            .catch((error) => {
              console.error(error);
            });

        
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
 
 

  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  const [tableRows, setTableRows] = useState([]);
  const results = [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await axios.get(`https://greece.snap4city.org/ServiceMap/api/v1/?selection=34.243594729697406;12.194824218750002;42.09822241118974;29.772949218750004&categories=IoTSensor&maxResults=100&maxDists=0.1&text=EnergyConsumer&accessToken=${token}&model=&value_type=&format=json`);
        const serviceFeatures = servicesResponse.data.Services.features;

        
        for (const feature of serviceFeatures) {
          const serviceResponse = await axios.get(`http://greece.snap4city.org/ServiceMap/api/v1/?serviceUri=${feature.properties.serviceUri}&accessToken=${token}&format=json`);
          const serviceData = serviceResponse.data;
          for (let i = 0; i < serviceData.realtime.results.bindings.length; i++) {
            results.push(serviceData.realtime.results.bindings[i]);
          }
        }
        setTableRows(results);
        console.log(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    

    fetchData();
  }, []);

 
  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Pois</h5>
                    <CardTitle tag="h2">Interactive Map</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Accounts
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2",
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Purchases
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3",
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Sessions
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
 
              {/*EDW EINAI TO KLEIDI GIA TON XARTH-TURN OFF GIA THN WRA MHN TO FORTOSOUME REQUEST KRIMA EINAI */}
              {markersLoaded ? (
                <MapWithAMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDKTVnP4JUqspJ9sQ9zlAkVqzLJaPgOWIY&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{ height: '100%' }} />}
                  containerElement={<div style={{ height: '400px' }} />}
                  mapElement={<div style={{ height: '100%' }} />}
                />
              ) : (
                <div>Loading markers...</div>
              )}
  
                  {/* <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  /> */}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Expense</h5>
                <CardTitle tag="h3" style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                  <i className="tim-icons icon-bell-55 text-info" /> 
                  <p id="price"></p>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartDataPrice}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total kw/h</h5>
                <CardTitle tag="h3" style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                  <i className="tim-icons icon-delivery-fast text-primary" /> 
                  <p id="kwh"></p>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartDataKWH}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Completed Tasks</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total GENERAL</h5>
                    <CardTitle tag="h2">GENERAL</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Accounts
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2",
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Purchases
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3",
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Sessions
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
  
                  <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
         
          <Col lg="12" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <td>measuredTime</td>
                      <td>Address</td>
                      <td>DataObserved</td>
                      <td>Email</td>
                      <td>FullName</td>
                      <td>Gender</td>
                      <td>Invoice</td>
                      <td>PhoneNumber</td>
                      <td>Questionnaire</td>
                      <td>YearOfBirth</td>
                      <td>password</td>
                      <td >username</td>
                    </tr>
                  </thead>
                  
                  <tbody>
                  {tableRows.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((key) => (
                      <td key={key}>{`${row[key].value}`}</td>
                    ))}
                  </tr>
                  ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
