import React, { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useHistory } from "react-router-dom";
import Cookie from "js-cookie";
import Button from "./shared/components/FormElements/Button";
import Card from "./shared/components/UIElements/Card";
import { AuthContext } from "./shared/context/auth-context";
import "./Landing.css"; // Import the custom CSS file

const features = [
  {
    icon: "📍",
    title: "Discover Places",
    description: "Find amazing locations shared by others.",
    link: "/discover",
  },
  {
    icon: "🌟",
    title: "Create Your List",
    description: "Save and manage your favorite spots.",
    link: "/places/new",
  },
  {
    icon: "🚀",
    title: "Share with Friends",
    description: "Let others explore the places you love.",
    link: "/discover",
  },
];

const LandingPage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const storedUserId = Cookie.get("userId");
    if (storedUserId && !auth.isLoggedIn) {
      auth.login(storedUserId);
      history.push("/");
    }
  }, [auth, history]);

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
          <article key={index} className="feature-card">
            <Link
              to={feature.link}
              className="link-card"
              aria-label={feature.title}>
              <Card className="card">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="card-content">
                  <div className="icon">{feature.icon}</div>
                  <h2>{feature.title}</h2>
                  <p className="description">{feature.description}</p>
                </motion.div>
              </Card>
            </Link>
          </article>
        ))}
      </main>
    </div>
  );
};

export default LandingPage;
