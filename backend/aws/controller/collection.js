const AWS = require("aws-sdk");
const proxy = require("proxy-agent");

if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) }
  });
}

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

exports.list = async (req, res) => {
  const response = await rekognition.listCollections({}).promise();
  const returnData = response.CollectionIds.map(i => ({ id: i, name: i }));
  return res.json(returnData);
};

exports.create = async (req, res) => {
  const name = req.body.name;
  const aws_name = `${process.env.APP_NAME}-${name}`;
  const s3params = {
    Bucket: aws_name,
    CreateBucketConfiguration: {
      LocationConstraint: process.env.AWS_REGION
    }
  };
  await s3.createBucket(s3params).promise();
  const dbparams = {
    AttributeDefinitions: [
      {
        AttributeName: "FaceId",
        AttributeType: "S"
      }
    ],
    KeySchema: [
      {
        AttributeName: "FaceId",
        KeyType: "HASH"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    TableName: aws_name
  };
  await dynamodb.createTable(dbparams).promise();
  const params = { CollectionId: name };
  const response = await rekognition.createCollection(params).promise();
  if (response.StatusCode === 200) return res.json({ id: name, name });
  else return res.status(500).send("Error in creating collection");
};

exports.delete = async (req, res) => {
  const name = req.body.id;
  const aws_name = `${process.env.APP_NAME}-${name}`;
  const s3params = {
    Bucket: aws_name
  };
  const s3ListResponse = await s3.listObjectsV2(s3params).promise();
  if (s3ListResponse.Contents.length > 0) {
    const s3ItemParams = {
      Bucket: aws_name,
      Delete: {
        Objects: s3ListResponse.Contents.map(i => ({ Key: i.Key })),
        Quiet: false
      }
    };
    await s3.deleteObjects(s3ItemParams).promise();
  }
  await s3.deleteBucket(s3params).promise();
  const dbparams = {
    TableName: aws_name
  };
  await dynamodb.deleteTable(dbparams).promise();
  const params = { CollectionId: name };
  const response = await rekognition.deleteCollection(params).promise();
  if (response.StatusCode === 200) return res.json({});
  else return res.status(500).send("Error in deleting collection");
};
