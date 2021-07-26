# AWS-Bill-Notifier

### An AWS Bill notifier application that notfies the user on daily basis about the current AWS bill and helps user to avoid any sudden high charges that could happen to some unused resources etc.


### It notifies the user via webhookls to any Slack, Chime, Discord etc. or any other chanels. 

======================================================

### STEPS FOR SETUP

1.  Create a AWS Lambda function from the lambda console https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions by zipping the code or uploading tthe "lambda0.zip" with Node.js as runtime.

2. Update the lambda execution role in IAM console by adding the below policy statement to the execution role policy.

```json

    {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
                "ce:GetCostCategories",
                "ce:GetCostAndUsageWithResources",
                "ce:GetCostAndUsage",
                "ce:GetCostForecast"
            ],
        "Resource": "*"
    }


```

3. Go to EventBridge(CloudWatch events) console https://us-east-1.console.aws.amazon.com/events/home?region=us-east-1#/

4. Create a rule i.e. event with name for eg : "my-bill-rule".

5. For Define pattern , choose "Schedule" and provide the Cron expression for eg: cron(30 6 * * ? *)

6. Select the target as the earlier created lambda fucntion in Step 1.

7. In 'Configure input' , choose "Constant( JSON text)" and provide the webhook links int he below format,

```json
{"WEBHOOK1":"https://hooks.chime.aws/incomingwebhooks/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "WEBHOOK2":"https://xxxxxxxxxxxxxxxxxxxxxxx"}

```

8. Click "Create" to create the rule

=======================================================

Libraries/Technologies Used : AWS Lambda, Amazon EventBridge(CloudWatch events), Javascript, AWS SDK, Axios, Webhooks


