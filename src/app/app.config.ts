export const appConfig = {
 //apiUrl: 'http://ec2-63-35-190-228.eu-west-1.compute.amazonaws.com:3000'
 apiUrl: 'http://localhost:3000'

};

//sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
// http-server -S -C ssl/fullchain.pem -K ssl/privkey.pem -a ec2-13-127-190-180.ap-south-1.compute.amazonaws.com
//  http-server -p 4200 -a ec2-13-233-201-130.ap-south-1.compute.amazonaws.com
//   "DB_HOST": "ec2-18-202-81-36.eu-west-1.compute.amazonaws.com",