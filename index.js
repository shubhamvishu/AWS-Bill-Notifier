const AWS = require('aws-sdk');
const axios = require('axios');
AWS.config.update({region:'us-east-1'});

const getFirstDateOfMonth = () => {
  let temp = String(new Date().toISOString().substring(0,10));
  return temp.substring(0,8)+'01'+temp.substring(10);
}
const getCurrentDate = () => {
  return String(new Date().toISOString().substring(0,10));
}

const getUsageData = (event) =>{
  var costexplorer = new AWS.CostExplorer();
    var params = {
      Metrics: [
        'BlendedCost',
        'UnblendedCost',
        'UsageQuantity',
        'AmortizedCost',
        'NetAmortizedCost',
        'NetUnblendedCost',
        'NormalizedUsageAmount'
      ],
      TimePeriod: {
        End: getCurrentDate(),
        Start: getFirstDateOfMonth()
      },
      Granularity: 'MONTHLY'
    };
  var result = null;
  if(getCurrentDate() != getFirstDateOfMonth()) {
    costexplorer.getCostAndUsage(params, function (err, data) {
          if (err) {
            console.log("ERROR OCCURRED");
            console.log(err, err.stack);
            }
          else     {
            console.log("SUCCESS REQUEST");
            console.log(data.ResultsByTime[0]);
            for (let [key, value] of Object.entries(event)) {
              sendNotification(value,data);
            }
          }
        });
  }
}

const sendNotification = (url, data) => {
  axios({
          method: 'post',
          url: url,
          data: {
            Content:
            "/md \n"
            +`Hey **Shubham**, You monthly bill till today is : ** ${String(data.ResultsByTime[0].Total.BlendedCost.Amount).substring(0,6)} USD ** :flushed::racehorse:\n\n\n`
            +" ----------------------------------- \n"
            +"Name |   From   |   To   |  Total Bill |\n"
            +"------------ | ------------- | ----------- | ---------- |\n"
            +`Shubham | ${getFirstDateOfMonth()} | ${getCurrentDate()} | ** ${String(data.ResultsByTime[0].Total.BlendedCost.Amount).substring(0,6)} USD**`
          }
        })
        .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
}



exports.handler = (event) => {
    
    console.log("CW Bill Usage");
    getUsageData(event);
    console.log("#########");
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    console.log("END");
    return response;
};
