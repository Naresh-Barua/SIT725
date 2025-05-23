## Docker

1. **Build the image**  
   ```bash
   docker build -t communityconnect .

2. Run the container
docker run -d \ --name cc-app \  --env-file .env \ -p 3000:3000 \ communityconnect

--env-file .env loads your Mongo/Google/EMAIL vars

-p 3000:3000 maps container port 3000 → host port 3000

3. Open the app
In your browser, visit:
http://localhost:3000

4. Verify /api/student
curl http://localhost:3000/api/student

Expected response: 
{
  "name": "Naresh Barua",
  "studentId": "5225123878"
}
