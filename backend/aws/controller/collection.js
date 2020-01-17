const AWS = require("aws-sdk");
const proxy = require("proxy-agent");

// adds proxy to aws config if required
// proxy stated in environment as PROXY
if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) }
  });
}

// initialize aws components
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

/**
 * Returns a list of collections from AWS
 * @return {json} [{id, name}, ...]
 */
exports.list = async (req, res) => {
  const response = await rekognition.listCollections({}).promise();
  const returnData = response.CollectionIds.map(i => ({ id: i, name: i }));
  return res.json(returnData);
};

/**
 * Create a collection in AWS
 * @param {string} req.body.name name of collection
 * @return {json} {id, name}
 */
exports.create = async (req, res) => {
  const name = req.body.name;
  const aws_name = `${process.env.APP_NAME}-${name}`;

  // create bucket in s3
  const s3params = {
    Bucket: aws_name,
    CreateBucketConfiguration: {
      LocationConstraint: process.env.AWS_REGION
    }
  };
  await s3.createBucket(s3params).promise();

  // create table in dynamodb
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

  // create collection in rekognition
  const params = { CollectionId: name };
  const response = await rekognition.createCollection(params).promise();

  if (response.StatusCode === 200) return res.json({ id: name, name });
  else return res.status(500).send("Error in creating collection");
};

/**
 * Delete a collection based on id in AWS
 * @param {string} req.body.id id of the collection
 * @return {null}
 */
exports.delete = async (req, res) => {
  const name = req.body.id;
  const aws_name = `${process.env.APP_NAME}-${name}`;

  // get list of objects in s3 and remove them
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

  // remove bucket from s3
  await s3.deleteBucket(s3params).promise();

  // remove table from dynamodb
  const dbparams = {
    TableName: aws_name
  };
  await dynamodb.deleteTable(dbparams).promise();

  // remove collection from rekognition
  const params = { CollectionId: name };
  const response = await rekognition.deleteCollection(params).promise();

  if (response.StatusCode === 200) return res.json({});
  else return res.status(500).send("Error in deleting collection");
};
