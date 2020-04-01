import * as d3 from 'd3';
import fiscal from "./fiscal.csv";
export function process_fiscal(){
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
}

}




//https://stackoverflow.com/questions/17114826/d3-csv-return-rows