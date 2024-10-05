// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {Button, Card, CardBody, CardFooter, Typography} from "@material-tailwind/react";
import bg from "../images/bg.png";

const CARD_CONTENTS = [
  {
    IMAGE: "https://img.freepik.com/free-photo/young-woman-preparing-shaving-her-legs_23-2150162921.jpg?t=st=1728113686~exp=1728117286~hmac=ee166ac145516c03beb777cfa5f73fb0a9f02d178fd771ddb5cb397f5136e84a&w=360",
    CARD_TITLE: "Virtual Fitting Room",
    CARD_DESCRIPTION: "Try on clothes virtually in real-time using advanced AR technology. See how different outfits look on your body before making a purchase, ensuring the perfect fit every time."
  },
  {
    IMAGE:"https://img.freepik.com/free-photo/couple-winter-cloths-studio_1303-5887.jpg?t=st=1728113850~exp=1728117450~hmac=714bf517e50575e6eedf1c5578a787894cd30d581bf52365bd0fb76d6d04331e&w=996",
    CARD_TITLE: "Style Recommendations",
    CARD_DESCRIPTION: "Get personalized clothing suggestions based on your preferences, body type, and occasion. Our AI-powered style guide helps you discover new looks that complement your unique style."
  },
  {
    IMAGE: "https://img.freepik.com/free-photo/close-up-women-posing-together_23-2149157659.jpg?t=st=1728113889~exp=1728117489~hmac=e85fac7b284a0af1db637db09600d9c33d39e371bbdf34a04db62e255042c83c&w=996",
    CARD_TITLE: "Skin Tone Matching",
    CARD_DESCRIPTION: "Find clothes that match your skin tone and enhance your natural beauty. Our system analyzes color combinations to recommend outfits that bring out the best in you."
  },
  {
    IMAGE:"https://img.freepik.com/free-vector/3d-ai-robot-character-chat-bot-wink-mascot-icon_107791-30020.jpg?t=st=1728113947~exp=1728117547~hmac=3b8141a923c4a1687a44e11dc2981f752be61c5500dbccd7abd13e964e8c2f8d&w=996",
    CARD_TITLE: "Interactive Fashion Chatbot",
    CARD_DESCRIPTION: "Need help finding the perfect outfit? Chat with our AI stylist for tips, fashion advice, and quick answers to all your wardrobe questions."
  },
]


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <ServicesSection/>
    </div>
  );
}


function HeroSection() {

  // const {user} = useSelector(state => state.auth);
  // const navigate = useNavigate();

  return (
      <div
          className="h-96 flex justify-between items-center gap-2 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${bg}')`,
            }}
      >
        <div className=" bg-black bg-opacity-10 w-full h-full items-center justify-center flex">
          <div className="flex-col items-center justify-center flex p-2">
            <Typography
                color="white"
                className="font-abril text-center"
                style = {{
                    fontFamily: "Abril Fatface",
                    fontSize: "7rem",
                    fontWeight: "bold",
                }}

            >
              Dress Me
            </Typography>
            <Typography color="white" className="font-abril text-center -mt-10" style = {{
                fontFamily: "Abril Fatface",
                fontSize: "1.3rem",
            }}>
              Discover the future of fashion!
            </Typography>
              <Typography color="white" className="font-abril text-center" style = {{
                  fontFamily: "Abril Fatface",
                  fontSize: "1.1rem",
              }}>
                  Try on your favorite outfits, experiment with new looks, and find your perfect style from the comfort of home. With Dress Me, shopping for clothes has never been easier or more fun.
              </Typography>
          </div>
        </div>
      </div>
  );
}

function ServicesSection() {
  return (
      <div className="mt-4 justify-center flex flex-col">
        <Typography variant="h4" className="text-center text-gray-800" style={
            {
                fontFamily: "Abril Fatface",
                fontSize: "2.0rem",
                fontWeight: "bold",}
        }>
            Our Services
        </Typography>
        <Typography variant="small" className="text-center text-gray-800 font-abril mb-2 justify-center -mt-2"
                    style={
                    {
                        fontFamily: "Abril Fatface"
                    }}>
          Discover How Dress Me Transforms Your Fashion Experience
        </Typography>


        <div className="flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4 mt-2">
            {
              CARD_CONTENTS.map((card_content, index) => (
                  <ServiceCard key={index} CARD_CONTENT={card_content} />
              ))
            }
          </div>
        </div>
      </div>
  );
}

function ServiceCard({CARD_CONTENT}) {
  return (
      <Card className="mt-6 w-80">
        <CardBody>
          <img
              src={CARD_CONTENT.IMAGE}
              alt="card-image "
              className=" object-cover w-full h-40 rounded-lg mb-2"
          />
          <Typography variant="h5" color="blue-gray" className="mb-2 font-abril" style={
              {
                  fontFamily: "Abril Fatface"
              }}>
            {CARD_CONTENT.CARD_TITLE}
          </Typography>
          <Typography className="text-sm font-abril" style={
              {
                  fontFamily: "Abril Fatface"
              }}>
            {CARD_CONTENT.CARD_DESCRIPTION}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0 flex items-center justify-end" style={
            {
                fontFamily: "Abril Fatface"
            }}>
          <Button variant="text">Read More</Button>
        </CardFooter>
      </Card>
  );
}


