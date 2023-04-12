const AWS=require('aws-sdk')

const uploadToS3=async (fileName,data)=>{
    AWS.config.region = 'ap-south-1';
    const bucketName=`${process.env.bucketName}`
    try {
        const s3Bucket= await new AWS.S3({
            accessKeyId:process.env.key_Id,
            secretAccessKey: process.env.Secret_Access_Key

        })
        const params={
            Bucket:bucketName,
            Key:fileName,
            Body:data,
            ACL:'public-read'
        }
         
        console.log("s3 service called..........")
        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,(err,s3response)=>{
                if(err)
                    reject(err)
                else{
                    console.log("s3_reponse",s3response)
                    resolve(s3response.Location)
                }
            })
        })
    } catch (error) {
        console.log("error while uploading to s3: ",error)
    }
}

module.exports={
    uploadToS3
}