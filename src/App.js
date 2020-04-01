import React, { Component } from 'react';
import "./App.css";
import * as d3 from 'd3';
import * as algo1 from "./Algorithms/algo1";
import SlopeChart from "./components/SlopeChart"
import { Container, Row, Col } from 'reactstrap';
import fiscal from "./Data/fiscal.csv";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data:null,state_limit: 10,models:["Cord.Ascent","LinearReg.","LambdaRank","LambdaMART"]};
    this.fiscaldata=algo1.process_fiscal()
    this.data={
      "A":[
      {
         "name":"Birkbeck",
         "rank":1
      },
      {
         "name":"LSE",
         "rank":2
      },
      {
         "name":"London Met",
         "rank":3
      },
      {
         "name":"LSHTM",
         "rank":4
      }
   ],
   "B":[
      {
         "name":"Birkbeck",
         "rank":1
      },
      {
         "name":"LSE",
         "rank":3
      },
      {
         "name":"London Met",
         "rank":35
      },
      {
         "name":"LSHTM",
         "rank":1
      }
   ]
}
  }  
dataprocessor=()=>{
   var self=this
   var myData = null;
   d3.csv(fiscal).row(function(d) { return d })
   .get(function(error, rows) {
     myData = rows;
     myDataIsReady()
   });
function myDataIsReady() {
    var data={"2006":[],"2007":[],"2008":[],"2009":[],"2010":[],"2011":[],"2012":[],"2013":[],"2014":[],"2015":[],"2016":[]};
     myData.forEach(element => {
     if(element["1-qid"]=="2006"){data["2006"].push(element)}
     if(element["1-qid"]=="2007"){data["2007"].push(element)}
     if(element["1-qid"]=="2008"){data["2008"].push(element)}
     if(element["1-qid"]=="2009"){data["2009"].push(element)}
     if(element["1-qid"]=="2010"){data["2010"].push(element)}
     if(element["1-qid"]=="2011"){data["2011"].push(element)}
     if(element["1-qid"]=="2012"){data["2012"].push(element)}
     if(element["1-qid"]=="2013"){data["2013"].push(element)}
     if(element["1-qid"]=="2014"){data["2014"].push(element)}
     if(element["1-qid"]=="2015"){data["2015"].push(element)}
     if(element["1-qid"]=="2016"){data["2016"].push(element)}
     });
     self.setState({data:data},()=>{})
   }

}
componentDidMount(){
   this.dataprocessor()
}
  render() {   
    return (
      <Row>
      { this.state.data!=null?this.state.models.map((model_name)=>{
         return <Col key={model_name} all_models={this.state.models} xl="4" lg="6" md="6"><SlopeChart mymax={32} state_limit={this.state.state_limit} year="2008" model_name={model_name} data={this.state.data} models={this.state.models} data2={this.data}></SlopeChart></Col>;
      }):null
      }
      </Row>
      
    );
  }
}
export default App;
