import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for routing
import Button from "./shared/components/FormElements/Button";
import Card from "./shared/components/UIElements/Card";
import { CardContent } from "@mui/material";
import "./Landing.css"; // Import the custom CSS file

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          Welcome to WanderWise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}>
          Discover and share amazing places with ease.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}>
          <Link to="/discover">
            <Button className="btn-start">Get Started</Button>
          </Link>
        </motion.div>
      </header>

      <main className="features">
        {features.map((feature, index) => (
          <Link to={feature.link} key={index} className="link-card">
            <Card className="card">
              <CardContent className="card-content">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}>
                  <div className="icon">{feature.icon}</div>
                  <h2>{feature.title}</h2>
                  <p className="description">{feature.description}</p>
                </motion.div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
};

const features = [
  {
    icon: "📍",
    title: "Discover Places",
    description: "Find amazing locations shared by others.",
    link: "/discover", // Link to Discover page
  },
  {
    icon: "🌟",
    title: "Create Your List",
    description: "Save and manage your favorite spots.",
    link: "/places/new", // Updated link to /places/new
  },
  {
    icon: "🚀",
    title: "Share with Friends",
    description: "Let others explore the places you love.",
    link: "/discover", // Link to Discover page
  },
];

export default LandingPage;
