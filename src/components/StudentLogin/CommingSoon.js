import React, { useEffect, useState } from 'react';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  

  useEffect(() => {
    
    const countdown = () => {
      const countDate = new Date('Jun 30, 2024 00:00:00').getTime();
      const now = new Date().getTime();
      const gap = countDate - now;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const days = Math.floor(gap / day);
      const hours = Math.floor((gap % day) / hour);
      const minutes = Math.floor((gap % hour) / minute);
      const seconds = Math.floor((gap % minute) / second);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timerId = setInterval(countdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const styles = {
    body: {
      height: '100vh',
      margin: 0,
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
      color: 'white',
    },
    container: {
      maxWidth: '600px',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    h1: {
      fontSize: '3em',
      marginBottom: '10px',
    },
    p: {
      fontSize: '1.5em',
      margin: '20px 0',
    },
    countdown: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '20px',
    },
    countdownItem: {
      fontSize: '2em',
    },
    countdownLabel: {
      display: 'block',
      fontSize: '0.5em',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1em',
      color: '#fff',
      backgroundColor: '#ff7e5f',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    buttonHover: {
      backgroundColor: '#feb47b',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Coming Soon</h1>
        <p style={styles.p}>
          We are working very hard to give you the best experience possible!
          Stay tuned.
        </p>
        <div style={styles.countdown}>
          <div style={styles.countdownItem}>
            <span>{timeLeft.days}</span>
            <span style={styles.countdownLabel}>Days</span>
          </div>
          <div style={styles.countdownItem}>
            <span>{timeLeft.hours}</span>
            <span style={styles.countdownLabel}>Hours</span>
          </div>
          <div style={styles.countdownItem}>
            <span>{timeLeft.minutes}</span>
            <span style={styles.countdownLabel}>Minutes</span>
          </div>
          <div style={styles.countdownItem}>
            <span>{timeLeft.seconds}</span>
            <span style={styles.countdownLabel}>Seconds</span>
          </div>
        </div>
      </div>
      <button
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default ComingSoon;
